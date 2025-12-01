import { NextRequest, NextResponse } from "next/server";
import { runAllIndustryTests } from "@/data/IndustryTestScenarios";

export async function GET(req: NextRequest) {
  try {
    const results = await runAllIndustryTests();
    
    const summary = {
      total: results.length,
      success: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
      results
    };
    
    return NextResponse.json({ 
      message: "業界特化面接統合テスト完了",
      summary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('統合テストエラー:', error);
    return NextResponse.json(
      { 
        error: "統合テストの実行に失敗しました",
        details: error instanceof Error ? error.message : "不明なエラー"
      }, 
      { status: 500 }
    );
  }
}




