import { industryProfiles, getIndustryProfile, getJobTypeProfile } from './IndustryData';

// テスト用の業界・職種データの検証
export const validateIndustryData = () => {
  const results = {
    totalIndustries: industryProfiles.length,
    totalJobTypes: 0,
    validationErrors: [] as string[],
    industryDetails: [] as any[]
  };

  industryProfiles.forEach(industry => {
    // 業界データの検証
    if (!industry.id || !industry.name || !industry.description) {
      results.validationErrors.push(`業界 ${industry.name} の必須フィールドが不足しています`);
    }

    if (!industry.jobTypes || industry.jobTypes.length === 0) {
      results.validationErrors.push(`業界 ${industry.name} に職種が定義されていません`);
    }

    // 職種データの検証
    industry.jobTypes.forEach(jobType => {
      results.totalJobTypes++;
      
      if (!jobType.id || !jobType.name || !jobType.description) {
        results.validationErrors.push(`職種 ${jobType.name} の必須フィールドが不足しています`);
      }

      // 評価重みの合計が100になるかチェック
      const weightSum = jobType.evaluationWeight.technical + 
                       jobType.evaluationWeight.communication + 
                       jobType.evaluationWeight.leadership + 
                       jobType.evaluationWeight.industryKnowledge;
      
      if (weightSum !== 100) {
        results.validationErrors.push(`職種 ${jobType.name} の評価重みの合計が100ではありません (${weightSum})`);
      }
    });

    results.industryDetails.push({
      id: industry.id,
      name: industry.name,
      jobTypeCount: industry.jobTypes.length,
      keywords: industry.keywords.length
    });
  });

  return results;
};

// ヘルパー関数のテスト
export const testHelperFunctions = () => {
  const testResults = {
    getIndustryProfile: {
      valid: false,
      invalid: false
    },
    getJobTypeProfile: {
      valid: false,
      invalid: false
    }
  };

  // 有効な業界IDでテスト
  const itIndustry = getIndustryProfile('it');
  testResults.getIndustryProfile.valid = itIndustry?.name === 'IT・テクノロジー';

  // 無効な業界IDでテスト
  const invalidIndustry = getIndustryProfile('invalid');
  testResults.getIndustryProfile.invalid = invalidIndustry === undefined;

  // 有効な職種IDでテスト
  const engineerJob = getJobTypeProfile('it', 'engineer');
  testResults.getJobTypeProfile.valid = engineerJob?.name === 'エンジニア';

  // 無効な職種IDでテスト
  const invalidJob = getJobTypeProfile('it', 'invalid');
  testResults.getJobTypeProfile.invalid = invalidJob === undefined;

  return testResults;
};

// サンプルデータの出力（開発時の確認用）
export const getSampleData = () => {
  return {
    industries: industryProfiles.map(industry => ({
      id: industry.id,
      name: industry.name,
      description: industry.description,
      jobTypes: industry.jobTypes.map(jobType => ({
        id: jobType.id,
        name: jobType.name,
        description: jobType.description,
        requiredSkills: jobType.requiredSkills,
        evaluationWeight: jobType.evaluationWeight
      })),
      keywords: industry.keywords
    }))
  };
};



