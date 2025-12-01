import { NextRequest, NextResponse } from "next/server";
import { genAI } from "@/lib/gemini";

const MAX_FETCH_SIZE = 180_000;
const MAX_TEXT_LENGTH = 8_000;
const MAX_SNIPPET_LENGTH = 1_200;

const parseGeminiJson = (raw: string) => {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("Gemini APIの応答が空です");
  }
  try {
    return JSON.parse(trimmed);
  } catch {
    const fallback = trimmed.match(/\{[\s\S]*\}/);
    if (!fallback) {
      throw new Error("Gemini APIの応答をJSONとして解析できませんでした");
    }
    return JSON.parse(fallback[0]);
  }
};

const sanitizeHtml = (html: string) => {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<head[\s\S]*?<\/head>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
  .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(\/)?(p|div|br|li|h[1-6]|section|article)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
};

const truncate = (value: string, length: number) => {
  if (value.length <= length) return value;
  return `${value.slice(0, length)}...`;
};

const fetchCompanyPage = async (url: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
        "Accept-Language": "ja,en;q=0.8",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`サイトの取得に失敗しました (status: ${res.status})`);
    }

    const contentType = res.headers.get("content-type") ?? "";
    const charsetMatch = contentType.match(/charset=([^;]+)/i);
    const encoding = charsetMatch ? charsetMatch[1].trim().toLowerCase() : "utf-8";

    const arrayBuffer = await res.arrayBuffer();
    const buffer = arrayBuffer.byteLength > MAX_FETCH_SIZE
      ? arrayBuffer.slice(0, MAX_FETCH_SIZE)
      : arrayBuffer;

    let decoded: string;
    try {
      decoded = new TextDecoder(encoding as unknown as string, { fatal: false }).decode(buffer);
    } catch {
      decoded = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
    }

    return decoded;
  } finally {
    clearTimeout(timeout);
  }
};

export async function POST(req: NextRequest) {
  try {
    const { url, extraText } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "url が必要です" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        throw new Error();
      }
    } catch {
      return NextResponse.json({ error: "URL の形式が正しくありません" }, { status: 400 });
    }

    const html = await fetchCompanyPage(parsedUrl.toString());
    const cleaned = sanitizeHtml(html);
    const truncatedText = truncate(cleaned, MAX_TEXT_LENGTH);

    const additionalSection = typeof extraText === "string" && extraText.trim().length > 0
      ? `\n【追加情報】\n${extraText.trim()}`
      : "";

    const prompt = `あなたは日本企業の採用リサーチャーです。以下の企業関連情報を読み、次の形式で日本語のJSONを出力してください。\n\n` +
      `1. summary: 企業の概要と事業の特徴を200〜300文字で分かりやすく要約する。\n` +
      `2. highlights: 最大5項目の配列。採用で注目したい独自性、事業トピック、必要スキルなどのキーポイントを50文字以内で列挙する。\n` +
      `3. 注意: JSON以外の文章は出力しない。\n\n` +
      `【企業サイトの本文（要約対象、先頭から抜粋）】\n${truncatedText}\n${additionalSection}\n\n` +
      `出力例:\n{"summary":"...","highlights":["...","..."]}`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      config: { responseMimeType: "application/json" },
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    const responseText = response.candidates
      ?.flatMap(candidate => candidate.content?.parts ?? [])
      .map(part => part?.text ?? "")
      .join("") ?? "";

    const parsed = parseGeminiJson(responseText);
    const summary = typeof parsed.summary === "string" ? parsed.summary.trim() : "";
    const highlights = Array.isArray(parsed.highlights)
      ? parsed.highlights.filter((item: unknown): item is string => typeof item === "string" && item.trim().length > 0)
      : [];

    return NextResponse.json({
      url: parsedUrl.toString(),
      summary,
      highlights,
      rawTextSnippet: truncate(truncatedText, MAX_SNIPPET_LENGTH),
    });
  } catch (error) {
    console.error("Company context fetch failed:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "企業情報の取得に失敗しました" }, { status: 500 });
  }
}
