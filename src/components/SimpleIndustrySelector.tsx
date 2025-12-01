"use client";
import { useState } from "react";
import { simpleIndustries, simpleJobTypes } from "@/data/SimpleIndustryData";

interface SimpleIndustrySelectorProps {
  onSelect: (industry: string, jobType: string) => void;
}

export default function SimpleIndustrySelector({ onSelect }: SimpleIndustrySelectorProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedJobType, setSelectedJobType] = useState<string>("");

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

  const availableJobTypes = selectedIndustry ? simpleJobTypes[selectedIndustry] || [] : [];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">業界・職種選択</h2>
        <p className="text-gray-600">面接練習に適した業界と職種を選択してください</p>
      </div>
      
      {/* 業界選択 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">業界を選択してください</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {simpleIndustries.map((industry) => (
            <button
              key={industry.id}
              type="button"
              className={`p-4 rounded-lg border-2 transition-all text-left
                ${selectedIndustry === industry.id 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              onClick={() => handleIndustrySelect(industry.id)}
            >
              <h4 className="font-bold text-lg text-gray-800 mb-2">{industry.name}</h4>
              <p className="text-sm text-gray-600">{industry.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 職種選択 */}
      {selectedIndustry && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            {simpleIndustries.find(i => i.id === selectedIndustry)?.name}の職種を選択してください
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableJobTypes.map((jobType) => (
              <button
                key={jobType.id}
                type="button"
                className={`p-4 rounded-lg border-2 transition-all text-left
                  ${selectedJobType === jobType.id 
                    ? 'border-green-500 bg-green-50 ring-2 ring-green-200' 
                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                onClick={() => handleJobTypeSelect(jobType.id)}
              >
                <h4 className="font-bold text-lg text-gray-800 mb-2">{jobType.name}</h4>
                <p className="text-sm text-gray-600">{jobType.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 確認ボタン */}
      {selectedIndustry && selectedJobType && (
        <div className="text-center">
          <button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={handleConfirm}
          >
            この業界・職種で面接を開始
          </button>
        </div>
      )}
    </div>
  );
}




