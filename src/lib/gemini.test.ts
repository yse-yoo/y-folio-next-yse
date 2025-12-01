import { generateIndustrySpecificQuestions, evaluateIndustrySpecificAnswers } from './gemini';
import { testUser } from '@/data/TestUser';
import { testPortfolio } from '@/data/TestPortfolio';

// モック関数（実際のテストでは適切なモックを使用）
jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn().mockResolvedValue({
        candidates: [{
          content: {
            parts: [{
              text: `1. あなたのプログラミング経験について教えてください。
2. チーム開発での経験はありますか？
3. 最新の技術トレンドについてどう思いますか？
4. システム設計で重要な要素は何ですか？
5. エラーが発生した時の対処方法を教えてください。`
            }]
          }
        }]
      })
    })
  }))
}));

describe('Gemini API Functions', () => {
  describe('generateIndustrySpecificQuestions', () => {
    test('IT業界・エンジニア職種の質問生成', async () => {
      const questions = await generateIndustrySpecificQuestions({
        user: testUser,
        portfolio: testPortfolio,
        industry: 'it',
        jobType: 'engineer'
      });

      expect(questions).toHaveLength(5);
      expect(questions[0]).toHaveProperty('id', 1);
      expect(questions[0]).toHaveProperty('question');
      expect(typeof questions[0].question).toBe('string');
    });

    test('無効な業界・職種でエラーが発生する', async () => {
      await expect(
        generateIndustrySpecificQuestions({
          user: testUser,
          portfolio: testPortfolio,
          industry: 'invalid',
          jobType: 'invalid'
        })
      ).rejects.toThrow('無効な業界・職種です');
    });
  });

  describe('evaluateIndustrySpecificAnswers', () => {
    const mockQuestions = [
      { id: 1, question: 'プログラミング経験について教えてください' },
      { id: 2, question: 'チーム開発での経験はありますか？' }
    ];
    
    const mockAnswers = [
      'JavaScriptとPythonでWebアプリケーションを開発した経験があります',
      '大学のプロジェクトで4人チームでWebサイトを開発しました'
    ];

    test('IT業界・エンジニア職種の評価生成', async () => {
      const evaluation = await evaluateIndustrySpecificAnswers({
        questions: mockQuestions,
        answers: mockAnswers,
        industry: 'it',
        jobType: 'engineer'
      });

      expect(evaluation).toHaveProperty('totalScore');
      expect(evaluation).toHaveProperty('categoryScores');
      expect(evaluation).toHaveProperty('evaluations');
      expect(evaluation).toHaveProperty('overallFeedback');
      expect(evaluation).toHaveProperty('industrySpecificAdvice');
    });

    test('無効な業界・職種でエラーが発生する', async () => {
      await expect(
        evaluateIndustrySpecificAnswers({
          questions: mockQuestions,
          answers: mockAnswers,
          industry: 'invalid',
          jobType: 'invalid'
        })
      ).rejects.toThrow('無効な業界・職種です');
    });
  });
});



