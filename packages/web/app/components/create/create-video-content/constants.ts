export const getDurationLabel = (value: string) => {
  const labels: Record<string, string> = {
    sns_short: 'SNS投稿用 (15-60秒)',
    product_intro: '商品・サービス紹介 (1-3分)',
    tutorial: 'チュートリアル・ハウツー (3-8分)',
    detailed_explanation: '詳細解説・講義 (8-15分)',
    long_content: '長編コンテンツ (15分以上)',
    custom: 'カスタム',
  };
  return labels[value] || value;
};

export const PERSONA_PRESETS = [
  {
    name: 'プログラミング初心者',
    ageRange: '20-30代',
    gender: '問わない',
    occupation: '学生・新社会人',
    characteristics: 'プログラミング経験が浅い、基礎から学びたい、実践的なスキルを身につけたい',
  },
  {
    name: 'ビジネスパーソン',
    ageRange: '30-40代',
    gender: '問わない',
    occupation: '会社員・管理職',
    characteristics: '効率性を重視、実用的な知識を求める、時間が限られている',
  },
  {
    name: '学生',
    ageRange: '18-25歳',
    gender: '問わない',
    occupation: '大学生・大学院生',
    characteristics: '学習意欲が高い、新しい技術に興味津々、キャリア形成を考えている',
  },
  {
    name: 'シニア層',
    ageRange: '50代以上',
    gender: '問わない',
    occupation: 'さまざま',
    characteristics: 'デジタルに不慣れ、丁寧な説明を求める、実生活に役立つ内容を好む',
  },
] as const;