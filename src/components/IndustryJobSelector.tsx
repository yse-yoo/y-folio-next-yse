"use client";
import { useState } from "react";
import { industryProfiles, getIndustryProfile } from "@/data/IndustryData";

interface IndustryJobSelectorProps {
  onSelect: (industry: string, jobType: string) => void;
}

export default function IndustryJobSelector({ onSelect }: IndustryJobSelectorProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedJobType, setSelectedJobType] = useState<string>("");

  const selectedIndustryData = getIndustryProfile(selectedIndustry);

  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustry(industryId);
    setSelectedJobType(""); // 職種選択をリセット
  };

  const handleJobTypeSelect = (jobTypeId: string) => {
    setSelectedJobType(jobTypeId);
  };

  const handleConfirm = () => {
    if (selectedIndustry && selectedJobType) {
      onSelect(selectedIndustry, selectedJobType);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">業界・職種選択</h2>
        <p className="text-gray-600">面接練習に適した業界と職種を選択してください</p>
      </div>
      
      {/* 業界選択セクション */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-3">Step 1</span>
          業界を選択してください
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industryProfiles.map((industry) => (
            <button
              key={industry.id}
              type="button"
              className={`p-6 rounded-xl border-2 transition-all duration-200 text-left group hover:shadow-lg
                ${selectedIndustry === industry.id 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-md' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              onClick={() => handleIndustrySelect(industry.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-lg text-gray-800 group-hover:text-blue-700">
                  {industry.name}
                </h4>
                {selectedIndustry === industry.id && (
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {industry.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {industry.keywords.slice(0, 3).map((keyword) => (
                  <span 
                    key={keyword}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
                {industry.keywords.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{industry.keywords.length - 3}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 職種選択セクション */}
      {selectedIndustryData && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mr-3">Step 2</span>
            {selectedIndustryData.name}の職種を選択してください
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedIndustryData.jobTypes.map((jobType) => (
              <button
                key={jobType.id}
                type="button"
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left group hover:shadow-lg
                  ${selectedJobType === jobType.id 
                    ? 'border-green-500 bg-green-50 ring-2 ring-green-200 shadow-md' 
                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                onClick={() => handleJobTypeSelect(jobType.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-lg text-gray-800 group-hover:text-green-700">
                    {jobType.name}
                  </h4>
                  {selectedJobType === jobType.id && (
                    <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {jobType.description}
                </p>
                
                {/* 必要なスキル */}
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-700 mb-2 text-sm">必要なスキル</h5>
                  <div className="flex flex-wrap gap-2">
                    {jobType.requiredSkills.map((skill) => (
                      <span 
                        key={skill}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 評価重み */}
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-700 mb-2 text-sm">評価基準</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(jobType.evaluationWeight).map(([key, weight]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-bold text-green-600">{weight}%</div>
                        <div className="text-xs text-gray-600 capitalize">
                          {key === 'technical' ? '技術' : 
                           key === 'communication' ? 'コミュニケーション' :
                           key === 'leadership' ? 'リーダーシップ' : '業界知識'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 選択内容の確認と決定ボタン */}
      {selectedIndustryData && selectedJobType && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-3">確認</span>
            選択内容
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700">
                <span className="font-semibold">業界:</span> {selectedIndustryData.name}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">職種:</span> {selectedIndustryData.jobTypes.find(j => j.id === selectedJobType)?.name}
              </p>
            </div>
            <button
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={handleConfirm}
            >
              この業界・職種で面接を開始
            </button>
          </div>
        </div>
      )}

      {/* ヘルプテキスト */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          業界・職種を選択することで、より実践的で専門的な面接練習ができます
        </p>
      </div>
    </div>
  );
}



