'use client';

import { useMemo, useState } from "react";
import type { ResumeReviewResponse, ResumeSectionInput, ReviewStyleOptions } from "@/types/AiReview";

interface ReviewExportActionsProps {
  originalSections: ResumeSectionInput[];
  result: ResumeReviewResponse;
  settings: ReviewStyleOptions;
}

type ExportingKind = "pdf" | "docx" | null;

const formatDateTime = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = `${date.getMonth() + 1}`.padStart(2, "0");
  const dd = `${date.getDate()}`.padStart(2, "0");
  const hh = `${date.getHours()}`.padStart(2, "0");
  const min = `${date.getMinutes()}`.padStart(2, "0");
  return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
};

const buildFilename = (kind: "pdf" | "docx") => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = `${now.getMonth() + 1}`.padStart(2, "0");
  const dd = `${now.getDate()}`.padStart(2, "0");
  return `resume-review-${yyyy}${mm}${dd}.${kind}`;
};

const mapSectionTitle = (sections: ResumeSectionInput[], sectionId: string, fallback: string) => {
  const section = sections.find(item => item.id === sectionId);
  return section?.title || fallback || sectionId;
};

export default function ReviewExportActions({ originalSections, result, settings }: ReviewExportActionsProps) {
  const [exporting, setExporting] = useState<ExportingKind>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportPayload = useMemo(() => {
    const generatedAt = new Date();
    const sections = result.sections.map(section => ({
      id: section.sectionId,
      title: mapSectionTitle(originalSections, section.sectionId, section.sectionTitle),
      revisedText: section.revisedText,
      summary: section.summary,
      score: section.score,
    }));

    return {
      generatedAt,
      overallSummary: result.overallSummary,
      overallScore: result.overallScore,
      suggestions: result.suggestions ?? [],
      sections,
      style: settings,
    };
  }, [originalSections, result.sections, result.overallSummary, result.overallScore, result.suggestions, settings]);

  const handleExportPdf = async () => {
    setExporting("pdf");
    setExportError(null);

    try {
      const [{ jsPDF }] = await Promise.all([import("jspdf")]);

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const margin = 15;
      const lineWidth = 210 - margin * 2;
      let cursor = margin;

      const addTextBlock = (text: string, options: { size?: number; gap?: number; bold?: boolean } = {}) => {
        const size = options.size ?? 12;
        const gap = options.gap ?? 6;
        if (cursor + gap >= 297 - margin) {
          doc.addPage();
          cursor = margin;
        }
        doc.setFontSize(size);
        doc.setFont("Helvetica", options.bold ? "bold" : "normal");
        const lines = doc.splitTextToSize(text, lineWidth);
        lines.forEach(line => {
          if (cursor >= 297 - margin) {
            doc.addPage();
            cursor = margin;
            doc.setFontSize(size);
            doc.setFont("Helvetica", options.bold ? "bold" : "normal");
          }
          doc.text(line, margin, cursor);
          cursor += 6;
        });
        cursor += gap - 6;
      };

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(18);
      doc.text("AI履歴書・職務経歴書 添削レポート", margin, cursor);
      cursor += 10;

      doc.setFont("Helvetica", "normal");
      addTextBlock(`生成日時: ${formatDateTime(exportPayload.generatedAt)}`);
      addTextBlock(`スタイル: トーン=${settings.tone} / 文体=${settings.writingStyle} / 敬称=${settings.honorific} / 想定読者=${settings.audience} / 言語=${settings.language}`);

      if (exportPayload.overallSummary) {
        addTextBlock("総評", { size: 14, bold: true, gap: 8 });
        addTextBlock(exportPayload.overallSummary);
      }
      if (typeof exportPayload.overallScore === "number") {
        addTextBlock(`総合スコア: ${exportPayload.overallScore}/100`);
      }
      if (exportPayload.suggestions.length > 0) {
        addTextBlock("追加アドバイス", { size: 14, bold: true, gap: 8 });
        exportPayload.suggestions.forEach((suggestion, index) => {
          addTextBlock(`${index + 1}. ${suggestion}`, { gap: 4 });
        });
      }

      exportPayload.sections.forEach((section, index) => {
        addTextBlock(`セクション${index + 1}: ${section.title}`, { size: 14, bold: true, gap: 8 });
        if (section.summary) {
          addTextBlock(`要約: ${section.summary}`);
        }
        if (typeof section.score === "number") {
          addTextBlock(`スコア: ${section.score}/100`);
        }
        if (section.revisedText) {
          addTextBlock(section.revisedText, { gap: 10 });
        }
      });

      doc.save(buildFilename("pdf"));
    } catch (error) {
      console.error("Failed to export PDF", error);
      setExportError("PDFの書き出しに失敗しました");
    } finally {
      setExporting(null);
    }
  };

  const handleExportDocx = async () => {
    setExporting("docx");
    setExportError(null);

    try {
      const docxModule = await import("docx");
      const fileSaverModule = await import("file-saver");

      const { Document, Packer, Paragraph, HeadingLevel, TextRun } = docxModule;
      const saveAs = (fileSaverModule.default ?? (fileSaverModule as { saveAs: (blob: Blob, name: string) => void }).saveAs) as (blob: Blob, name: string) => void;

      const paragraphs: any[] = [];

      paragraphs.push(new Paragraph({
        text: "AI履歴書・職務経歴書 添削レポート",
        heading: HeadingLevel.TITLE,
      }));
      paragraphs.push(new Paragraph({
        text: `生成日時: ${formatDateTime(exportPayload.generatedAt)}`,
      }));
      paragraphs.push(new Paragraph({
        text: `スタイル: トーン=${settings.tone} / 文体=${settings.writingStyle} / 敬称=${settings.honorific} / 想定読者=${settings.audience} / 言語=${settings.language}`,
      }));

      if (exportPayload.overallSummary) {
        paragraphs.push(new Paragraph({ text: "総評", heading: HeadingLevel.HEADING_2 }));
        paragraphs.push(new Paragraph({ text: exportPayload.overallSummary }));
      }

      if (typeof exportPayload.overallScore === "number") {
        paragraphs.push(new Paragraph({ text: `総合スコア: ${exportPayload.overallScore}/100` }));
      }

      if (exportPayload.suggestions.length > 0) {
        paragraphs.push(new Paragraph({ text: "追加アドバイス", heading: HeadingLevel.HEADING_2 }));
        exportPayload.suggestions.forEach(suggestion => {
          paragraphs.push(new Paragraph({
            children: [
              new TextRun({ text: suggestion }),
            ],
            bullet: {
              level: 0,
            },
          }));
        });
      }

      exportPayload.sections.forEach((section, index) => {
        paragraphs.push(new Paragraph({ text: `セクション${index + 1}: ${section.title}`, heading: HeadingLevel.HEADING_2 }));
        if (section.summary) {
          paragraphs.push(new Paragraph({ text: `要約: ${section.summary}` }));
        }
        if (typeof section.score === "number") {
          paragraphs.push(new Paragraph({ text: `スコア: ${section.score}/100` }));
        }
        if (section.revisedText) {
          paragraphs.push(new Paragraph({ text: section.revisedText }));
        }
      });

      const document = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });

      const blob = await Packer.toBlob(document);
      saveAs(blob, buildFilename("docx"));
    } catch (error) {
      console.error("Failed to export DOCX", error);
      setExportError("Wordファイルの書き出しに失敗しました");
    } finally {
      setExporting(null);
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">書き出しオプション</h2>
          <p className="text-xs text-slate-500">添削結果をPDFまたはWord形式で保存できます。現在はローカルダウンロードのみ対応しています。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExportPdf}
            className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-60"
            disabled={exporting !== null}
          >
            {exporting === "pdf" ? "生成中..." : "PDFで書き出し"}
          </button>
          <button
            type="button"
            onClick={handleExportDocx}
            className="rounded border border-slate-800 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-800 hover:text-white disabled:opacity-60"
            disabled={exporting !== null}
          >
            {exporting === "docx" ? "生成中..." : "Wordで書き出し"}
          </button>
        </div>
      </header>
      {exportError && <p className="mt-3 text-xs text-rose-600">{exportError}</p>}
    </section>
  );
}
