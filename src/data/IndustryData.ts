import { IndustryProfile } from "@/types/Industry";

export const industryProfiles: IndustryProfile[] = [
  {
    id: 'it',
    name: 'IT・テクノロジー',
    description: 'ソフトウェア開発、システム設計、データ分析など',
    jobTypes: [
      {
        id: 'engineer',
        name: 'エンジニア',
        description: 'ソフトウェア開発、システム設計',
        requiredSkills: ['プログラミング', 'システム設計', '問題解決', 'チーム開発'],
        commonQuestions: [
          '最新の技術トレンドについてどう思いますか？',
          'チーム開発での経験を教えてください',
          '技術的な課題をどう解決しますか？',
          'コードレビューの重要性について説明してください'
        ],
        evaluationWeight: {
          technical: 40,
          communication: 25,
          leadership: 20,
          industryKnowledge: 15
        }
      },
      {
        id: 'data-scientist',
        name: 'データサイエンティスト',
        description: 'データ分析、機械学習、統計解析',
        requiredSkills: ['統計学', '機械学習', 'データ可視化', 'Python/R'],
        commonQuestions: [
          'データ分析のプロセスを説明してください',
          '機械学習モデルの評価方法を教えてください',
          'ビジネス課題をデータで解決した経験は？',
          'データの品質管理についてどう考えますか？'
        ],
        evaluationWeight: {
          technical: 45,
          communication: 20,
          leadership: 15,
          industryKnowledge: 20
        }
      },
      {
        id: 'product-manager',
        name: 'プロダクトマネージャー',
        description: 'プロダクト企画、要件定義、プロジェクト管理',
        requiredSkills: ['プロダクト企画', '要件定義', 'プロジェクト管理', 'ユーザー分析'],
        commonQuestions: [
          'プロダクトの成功指標をどう設定しますか？',
          'ユーザーニーズの分析方法を教えてください',
          'ステークホルダーとの調整で苦労した経験は？',
          '競合分析の重要性についてどう考えますか？'
        ],
        evaluationWeight: {
          technical: 25,
          communication: 30,
          leadership: 30,
          industryKnowledge: 15
        }
      }
    ],
    evaluationCriteria: {
      technical: {
        weight: 40,
        description: '技術的な知識と実装能力',
        questions: ['技術的な深さ', '実装経験', '問題解決能力', '技術学習能力']
      },
      communication: {
        weight: 25,
        description: '技術的な内容を分かりやすく説明する能力',
        questions: ['説明の分かりやすさ', '質問への対応', 'チームコミュニケーション', 'ドキュメント作成']
      },
      leadership: {
        weight: 20,
        description: 'プロジェクト管理とチームリーダーシップ',
        questions: ['プロジェクト管理', 'チーム運営', '意思決定能力', 'メンタリング']
      },
      industryKnowledge: {
        weight: 15,
        description: 'IT業界の動向と技術トレンドの理解',
        questions: ['業界動向の理解', '技術トレンド', '市場理解', '競合分析']
      }
    },
    keywords: ['プログラミング', 'システム', 'データ', 'AI', 'クラウド', '開発', '技術']
  },
  {
    id: 'finance',
    name: '金融・保険',
    description: '銀行、証券、保険、投資など',
    jobTypes: [
      {
        id: 'analyst',
        name: 'アナリスト',
        description: '投資分析、リスク評価、市場調査',
        requiredSkills: ['財務分析', 'リスク管理', '市場分析', 'Excel/BI'],
        commonQuestions: [
          'リスク管理の重要性について説明してください',
          '投資判断の基準を教えてください',
          '市場変動への対応方法は？',
          '財務モデルの作成経験を教えてください'
        ],
        evaluationWeight: {
          technical: 30,
          communication: 25,
          leadership: 20,
          industryKnowledge: 25
        }
      },
      {
        id: 'banker',
        name: 'バンカー',
        description: '企業融資、M&A、投資銀行業務',
        requiredSkills: ['財務分析', '企業評価', '交渉力', 'プレゼンテーション'],
        commonQuestions: [
          '企業の財務健全性をどう評価しますか？',
          'M&A案件での交渉経験を教えてください',
          '市場環境の変化にどう対応しますか？',
          'クライアントとの関係構築で大切なことは？'
        ],
        evaluationWeight: {
          technical: 25,
          communication: 30,
          leadership: 25,
          industryKnowledge: 20
        }
      }
    ],
    evaluationCriteria: {
      technical: {
        weight: 30,
        description: '財務分析とリスク管理の技術',
        questions: ['財務分析能力', 'リスク評価', '数値処理能力', 'モデリング']
      },
      communication: {
        weight: 25,
        description: '複雑な金融商品を分かりやすく説明',
        questions: ['説明能力', 'プレゼンテーション', '顧客対応', 'レポート作成']
      },
      leadership: {
        weight: 20,
        description: 'プロジェクト管理とチーム運営',
        questions: ['プロジェクト管理', 'チームリーダーシップ', '意思決定', '交渉力']
      },
      industryKnowledge: {
        weight: 25,
        description: '金融業界の知識と規制理解',
        questions: ['金融規制', '市場動向', '業界知識', 'コンプライアンス']
      }
    },
    keywords: ['金融', '投資', 'リスク', '保険', '証券', '銀行', '財務']
  },
  {
    id: 'consulting',
    name: 'コンサルティング',
    description: '経営戦略、業務改善、ITコンサルティング',
    jobTypes: [
      {
        id: 'strategy-consultant',
        name: '戦略コンサルタント',
        description: '経営戦略立案、事業計画策定',
        requiredSkills: ['戦略思考', '問題解決', 'データ分析', 'プレゼンテーション'],
        commonQuestions: [
          '企業の競争優位性をどう分析しますか？',
          '事業戦略の立案プロセスを説明してください',
          'クライアントとの関係構築で大切なことは？',
          '市場分析の手法を教えてください'
        ],
        evaluationWeight: {
          technical: 20,
          communication: 30,
          leadership: 25,
          industryKnowledge: 25
        }
      },
      {
        id: 'it-consultant',
        name: 'ITコンサルタント',
        description: 'システム導入、DX推進、IT戦略',
        requiredSkills: ['システム設計', 'プロジェクト管理', '業務分析', '技術知識'],
        commonQuestions: [
          'DX推進で重要な要素は何ですか？',
          'システム導入プロジェクトの管理方法を教えてください',
          '業務要件の分析方法を説明してください',
          '技術とビジネスの橋渡しで大切なことは？'
        ],
        evaluationWeight: {
          technical: 35,
          communication: 25,
          leadership: 25,
          industryKnowledge: 15
        }
      }
    ],
    evaluationCriteria: {
      technical: {
        weight: 25,
        description: '分析力と問題解決能力',
        questions: ['分析能力', '問題解決', '論理的思考', 'データ活用']
      },
      communication: {
        weight: 30,
        description: 'クライアントとのコミュニケーション能力',
        questions: ['説明能力', 'プレゼンテーション', '傾聴力', '提案力']
      },
      leadership: {
        weight: 25,
        description: 'プロジェクト管理とチーム運営',
        questions: ['プロジェクト管理', 'チームリーダーシップ', '意思決定', '交渉力']
      },
      industryKnowledge: {
        weight: 20,
        description: '業界知識とクライアント理解',
        questions: ['業界理解', 'クライアント理解', '市場動向', 'ベストプラクティス']
      }
    },
    keywords: ['戦略', 'コンサルティング', 'DX', '業務改善', 'プロジェクト', '分析']
  },
  {
    id: 'marketing',
    name: 'マーケティング・広告',
    description: 'ブランディング、デジタルマーケティング、広告企画',
    jobTypes: [
      {
        id: 'digital-marketer',
        name: 'デジタルマーケター',
        description: 'デジタル広告、SNS運用、Webマーケティング',
        requiredSkills: ['デジタル広告', 'データ分析', 'SNS運用', 'Web解析'],
        commonQuestions: [
          'デジタルマーケティングの成功指標をどう設定しますか？',
          'SNS運用で重要な要素は何ですか？',
          '広告効果の測定方法を教えてください',
          'ユーザーエンゲージメントをどう向上させますか？'
        ],
        evaluationWeight: {
          technical: 30,
          communication: 25,
          leadership: 20,
          industryKnowledge: 25
        }
      },
      {
        id: 'brand-manager',
        name: 'ブランドマネージャー',
        description: 'ブランド戦略、商品企画、マーケティング戦略',
        requiredSkills: ['ブランド戦略', '商品企画', '市場分析', 'クリエイティブ'],
        commonQuestions: [
          'ブランド価値をどう構築しますか？',
          '商品企画のプロセスを説明してください',
          '競合との差別化戦略をどう立てますか？',
          '消費者インサイトの活用方法を教えてください'
        ],
        evaluationWeight: {
          technical: 20,
          communication: 30,
          leadership: 25,
          industryKnowledge: 25
        }
      }
    ],
    evaluationCriteria: {
      technical: {
        weight: 25,
        description: 'マーケティング技術とデータ分析',
        questions: ['データ分析', 'ツール活用', '測定技術', '最適化']
      },
      communication: {
        weight: 30,
        description: 'クリエイティブとコミュニケーション',
        questions: ['クリエイティブ', 'プレゼンテーション', 'ストーリーテリング', '視覚表現']
      },
      leadership: {
        weight: 25,
        description: 'プロジェクト管理とチーム運営',
        questions: ['プロジェクト管理', 'チームリーダーシップ', '意思決定', '協調性']
      },
      industryKnowledge: {
        weight: 20,
        description: 'マーケティング業界の知識',
        questions: ['業界動向', '消費者行動', '市場理解', 'トレンド分析']
      }
    },
    keywords: ['マーケティング', 'ブランド', 'デジタル', '広告', 'SNS', 'クリエイティブ']
  },
  {
    id: 'manufacturing',
    name: '製造・メーカー',
    description: '製造業、品質管理、生産管理、研究開発',
    jobTypes: [
      {
        id: 'production-manager',
        name: '生産管理者',
        description: '生産計画、品質管理、現場管理',
        requiredSkills: ['生産管理', '品質管理', '現場管理', '改善活動'],
        commonQuestions: [
          '生産効率をどう向上させますか？',
          '品質管理の重要性について説明してください',
          '現場での改善活動の経験を教えてください',
          'コスト削減の方法を教えてください'
        ],
        evaluationWeight: {
          technical: 35,
          communication: 20,
          leadership: 30,
          industryKnowledge: 15
        }
      },
      {
        id: 'r-d-engineer',
        name: '研究開発エンジニア',
        description: '新製品開発、技術研究、特許管理',
        requiredSkills: ['技術研究', '新製品開発', '実験設計', '特許知識'],
        commonQuestions: [
          '新製品開発のプロセスを説明してください',
          '技術研究での課題解決方法を教えてください',
          '特許の重要性についてどう考えますか？',
          '実験設計で重要な要素は何ですか？'
        ],
        evaluationWeight: {
          technical: 45,
          communication: 20,
          leadership: 20,
          industryKnowledge: 15
        }
      }
    ],
    evaluationCriteria: {
      technical: {
        weight: 40,
        description: '製造技術と品質管理',
        questions: ['製造技術', '品質管理', '改善技術', '技術研究']
      },
      communication: {
        weight: 20,
        description: '現場でのコミュニケーション',
        questions: ['現場コミュニケーション', '報告能力', 'チーム連携', '説明能力']
      },
      leadership: {
        weight: 25,
        description: '現場管理とチーム運営',
        questions: ['現場管理', 'チームリーダーシップ', '改善推進', '安全管理']
      },
      industryKnowledge: {
        weight: 15,
        description: '製造業界の知識',
        questions: ['業界動向', '技術動向', '品質基準', '規制理解']
      }
    },
    keywords: ['製造', '品質', '生産', '改善', '研究開発', '技術', '現場']
  }
];

// 業界IDから業界プロファイルを取得するヘルパー関数
export const getIndustryProfile = (industryId: string): IndustryProfile | undefined => {
  return industryProfiles.find(industry => industry.id === industryId);
};

// 職種IDから職種プロファイルを取得するヘルパー関数
export const getJobTypeProfile = (industryId: string, jobTypeId: string) => {
  const industry = getIndustryProfile(industryId);
  return industry?.jobTypes.find(jobType => jobType.id === jobTypeId);
};

// 全ての業界リストを取得
export const getAllIndustries = (): IndustryProfile[] => {
  return industryProfiles;
};

// 特定業界の職種リストを取得
export const getJobTypesByIndustry = (industryId: string) => {
  const industry = getIndustryProfile(industryId);
  return industry?.jobTypes || [];
};



