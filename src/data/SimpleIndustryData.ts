// シンプルな業界・職種データ（段階的実装用）
export interface SimpleIndustry {
  id: string;
  name: string;
  description: string;
}

export interface SimpleJobType {
  id: string;
  name: string;
  description: string;
}

export const simpleIndustries: SimpleIndustry[] = [
  {
    id: 'it',
    name: 'IT・テクノロジー',
    description: 'ソフトウェア開発、システム設計、データ分析など'
  },
  {
    id: 'finance',
    name: '金融・保険',
    description: '銀行、証券、保険、投資など'
  },
  {
    id: 'consulting',
    name: 'コンサルティング',
    description: '経営戦略、業務改善、ITコンサルティング'
  }
];

export const simpleJobTypes: Record<string, SimpleJobType[]> = {
  'it': [
    {
      id: 'engineer',
      name: 'エンジニア',
      description: 'ソフトウェア開発、システム設計'
    },
    {
      id: 'data-scientist',
      name: 'データサイエンティスト',
      description: 'データ分析、機械学習、統計解析'
    }
  ],
  'finance': [
    {
      id: 'analyst',
      name: 'アナリスト',
      description: '投資分析、リスク評価、市場調査'
    },
    {
      id: 'banker',
      name: 'バンカー',
      description: '企業融資、M&A、投資銀行業務'
    }
  ],
  'consulting': [
    {
      id: 'strategy-consultant',
      name: '戦略コンサルタント',
      description: '経営戦略立案、事業計画策定'
    },
    {
      id: 'it-consultant',
      name: 'ITコンサルタント',
      description: 'システム導入、DX推進、IT戦略'
    }
  ]
};




