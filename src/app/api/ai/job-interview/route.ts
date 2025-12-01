import { NextRequest, NextResponse } from "next/server";
import { generateInterviewQuestionsWithGemini, generateIndustrySpecificQuestions } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    const { user, portfolio, industry, jobType, companyContext } = await req.json();
    
    if (!user || !portfolio) {
        return NextResponse.json({ error: "userとportfolioが必要です" }, { status: 400 });
    }
    
    try {
        let questions;
        
        if (industry && jobType) {
            // 業界特化面接
            questions = await generateIndustrySpecificQuestions({
                user,
                portfolio,
                industry,
                jobType,
                companyContext,
            });
        } else {
            // 通常面接
            questions = await generateInterviewQuestionsWithGemini({ user, portfolio, companyContext });
        }
        
        return NextResponse.json({ questions });
    } catch (e) {
        console.error('質問生成エラー:', e);
        return NextResponse.json({ 
            error: "質問生成に失敗しました。",
            details: e instanceof Error ? e.message : "不明なエラー"
        }, { status: 500 });
    }
}