export const sampleForm = {
  name: '山田 太郎',
  university: '東京大学 工学部',
  grade: '4年生',
  email: 'yamada@example.com',
  birthdayAt: '2000-01-01',
  phone: '090-1234-5678',
  address: '東京都新宿区',
  selfIntroduction: 'Web開発とAI技術に興味があります。React/Next.jsでの開発経験あり。',
  skillTags: ['JavaScript', 'React', 'Python'],
  certifications: 'TOEIC 850点、基本情報技術者試験 合格',
  projects: [
    { name: 'AIチャットボット開発', description: 'PythonとReactで社内向けAIチャットボットを開発。', url: 'https://github.com/yamada/ai-bot' },
    { name: 'Webポートフォリオ', description: 'Next.jsとTailwind CSSで自身のポートフォリオを作成。', url: '' },
  ],
  experience: {
    internship: '株式会社サンプルでAI開発インターンを経験。',
    extracurricular: 'プログラミングサークル所属。ハッカソン参加経験あり。',
    awards: '2024年 学生ハッカソン最優秀賞',
  },
  other: {
    customQuestions: '当社のサービスについて知っていることを教えてください。',
    additionalInfo: 'チーム開発でのリーダー経験あり。',
  },
  visibilitySettings: {
    basicInfo: true,
    phone: true,
    address: true,
    skills: true,
    projects: true,
    experience: true,
    other: true,
  },
};