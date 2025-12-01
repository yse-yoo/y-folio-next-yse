import { testUser } from './TestUser';
import { testPortfolio } from './TestPortfolio';

// 業界特化面接のテストシナリオ
export const industryTestScenarios = [
  {
    id: 'it-engineer',
    name: 'IT業界・エンジニア職種',
    industry: 'it',
    jobType: 'engineer',
    description: 'ソフトウェア開発に特化した面接',
    expectedQuestions: [
      'プログラミング経験について教えてください',
      'チーム開発での経験はありますか？',
      '最新の技術トレンドについてどう思いますか？',
      'システム設計で重要な要素は何ですか？',
      'エラーが発生した時の対処方法を教えてください'
    ],
    mockAnswers: [
      'JavaScriptとPythonでWebアプリケーションを開発した経験があります。特にReactとNode.jsを使ったSPAの開発が得意です。',
      '大学のプロジェクトで4人チームでWebサイトを開発しました。Gitを使ったバージョン管理とAgile開発手法を学びました。',
      'AIやクラウド技術の進歩が著しく、特にChatGPTのような生成AIが開発効率を大幅に向上させると考えています。',
      'スケーラビリティ、セキュリティ、保守性が重要だと思います。マイクロサービスアーキテクチャを採用することで、これらを実現できます。',
      'まずエラーログを確認し、問題の原因を特定します。その後、デバッガーを使ってステップバイステップで調査し、修正を行います。'
    ]
  },
  {
    id: 'finance-analyst',
    name: '金融業界・アナリスト職種',
    industry: 'finance',
    jobType: 'analyst',
    description: '投資分析に特化した面接',
    expectedQuestions: [
      'リスク管理の重要性について説明してください',
      '投資判断の基準を教えてください',
      '市場変動への対応方法は？',
      '財務モデルの作成経験を教えてください'
    ],
    mockAnswers: [
      'リスク管理は投資の基本です。ポートフォリオの分散投資とストップロスの設定により、損失を最小限に抑えることができます。',
      'PER、PBR、ROEなどの財務指標と、業界の成長性、競合他社との比較を総合的に判断します。',
      '市場の変動は避けられないので、長期的な視点で投資し、短期的な変動に惑わされないことが重要です。',
      'ExcelとPythonを使ってDCFモデルを作成した経験があります。将来のキャッシュフローを予測し、企業価値を算出しました。'
    ]
  },
  {
    id: 'consulting-strategy',
    name: 'コンサルティング業界・戦略コンサルタント職種',
    industry: 'consulting',
    jobType: 'strategy-consultant',
    description: '経営戦略に特化した面接',
    expectedQuestions: [
      '企業の競争優位性をどう分析しますか？',
      '事業戦略の立案プロセスを説明してください',
      'クライアントとの関係構築で大切なことは？',
      '市場分析の手法を教えてください'
    ],
    mockAnswers: [
      'VRIOフレームワークを使って、価値、希少性、模倣困難性、組織を分析します。また、ポーターの5つの力も活用します。',
      '現状分析、課題設定、解決策の検討、実行計画の策定の4段階で進めます。各段階でクライアントとの合意形成が重要です。',
      '信頼関係の構築が最も重要です。専門知識だけでなく、クライアントの立場に立った提案と、継続的なコミュニケーションが必要です。',
      '定量的分析では市場規模、成長率、シェアを分析し、定性的分析では競合他社、顧客ニーズ、技術動向を調査します。'
    ]
  }
];

// テスト用の評価結果データ
export const mockEvaluationResults = {
  'it-engineer': {
    totalScore: 88,
    categoryScores: {
      technical: 23,
      communication: 22,
      leadership: 21,
      industryKnowledge: 22
    },
    evaluations: [
      {
        questionId: 1,
        score: 23,
        feedback: "プログラミング経験が豊富で、具体的な技術スタックを説明できています。",
        strengths: ["技術的深さ", "具体例の提示", "実践経験"],
        improvements: ["より詳細な技術説明"]
      },
      {
        questionId: 2,
        score: 22,
        feedback: "チーム開発の経験を具体的に説明し、使用したツールや手法も言及できています。",
        strengths: ["チーム経験", "ツール知識", "開発手法"],
        improvements: ["リーダーシップ経験"]
      }
    ],
    overallFeedback: "全体的にIT業界の理解が深く、エンジニア職種に適した回答でした。技術的な知識と実践経験が豊富です。",
    industrySpecificAdvice: "IT業界で重視されるプログラミング、システム設計のスキルをさらに深めることをお勧めします。また、最新の技術トレンドへの理解を深めると良いでしょう。"
  },
  'finance-analyst': {
    totalScore: 82,
    categoryScores: {
      technical: 20,
      communication: 21,
      leadership: 19,
      industryKnowledge: 22
    },
    evaluations: [
      {
        questionId: 1,
        score: 22,
        feedback: "リスク管理の重要性を理解し、具体的な手法を説明できています。",
        strengths: ["リスク理解", "具体的手法", "実践的知識"],
        improvements: ["より詳細な分析手法"]
      }
    ],
    overallFeedback: "金融業界の基礎知識がしっかりしており、アナリスト職種に適した回答でした。",
    industrySpecificAdvice: "金融業界で重視される財務分析、リスク管理のスキルをさらに深めることをお勧めします。"
  }
};

// テスト実行用のヘルパー関数
export const runIndustryTest = async (scenarioId: string) => {
  const scenario = industryTestScenarios.find(s => s.id === scenarioId);
  if (!scenario) {
    throw new Error(`テストシナリオ ${scenarioId} が見つかりません`);
  }

  // 質問生成のテスト
  const questionsResponse = await fetch('/api/ai/job-interview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user: testUser,
      portfolio: testPortfolio,
      industry: scenario.industry,
      jobType: scenario.jobType
    })
  });

  if (!questionsResponse.ok) {
    throw new Error('質問生成に失敗しました');
  }

  const { questions } = await questionsResponse.json();

  // 評価生成のテスト
  const evaluationResponse = await fetch('/api/ai/evaluate-interview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      questions,
      answers: scenario.mockAnswers,
      industry: scenario.industry,
      jobType: scenario.jobType
    })
  });

  if (!evaluationResponse.ok) {
    throw new Error('評価生成に失敗しました');
  }

  const { evaluation } = await evaluationResponse.json();

  return {
    scenario,
    questions,
    evaluation
  };
};

// 全シナリオのテスト実行
export const runAllIndustryTests = async () => {
  const results = [];
  
  for (const scenario of industryTestScenarios) {
    try {
      const result = await runIndustryTest(scenario.id);
      results.push({
        scenario: scenario.name,
        status: 'success',
        data: result
      });
    } catch (error) {
      results.push({
        scenario: scenario.name,
        status: 'error',
        error: error instanceof Error ? error.message : '不明なエラー'
      });
    }
  }
  
  return results;
};




