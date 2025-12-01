"use client";
import { useState } from 'react';
import { industryTestScenarios, runIndustryTest, runAllIndustryTests } from '@/data/IndustryTestScenarios';

interface TestResult {
  scenario: string;
  status: 'success' | 'error';
  data?: any;
  error?: string;
}

export default function IndustryIntegrationTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('');

  const handleSingleTest = async (scenarioId: string) => {
    setIsRunning(true);
    try {
      const result = await runIndustryTest(scenarioId);
      setTestResults([{
        scenario: result.scenario.name,
        status: 'success',
        data: result
      }]);
    } catch (error) {
      setTestResults([{
        scenario: industryTestScenarios.find(s => s.id === scenarioId)?.name || scenarioId,
        status: 'error',
        error: error instanceof Error ? error.message : '不明なエラー'
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleAllTests = async () => {
    setIsRunning(true);
    try {
      const results = await runAllIndustryTests();
      setTestResults(results);
    } catch (error) {
      console.error('テスト実行エラー:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">業界特化面接統合テスト</h2>
        <p className="text-gray-600">業界・職種特化機能の動作確認</p>
      </div>

      {/* テストシナリオ選択 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">テストシナリオ選択</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {industryTestScenarios.map((scenario) => (
            <div key={scenario.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">{scenario.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
              <button
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
                onClick={() => handleSingleTest(scenario.id)}
                disabled={isRunning}
              >
                個別テスト実行
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* テスト実行ボタン */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          onClick={handleAllTests}
          disabled={isRunning}
        >
          {isRunning ? 'テスト実行中...' : '全テスト実行'}
        </button>
        <button
          className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
          onClick={clearResults}
        >
          結果クリア
        </button>
      </div>

      {/* テスト結果表示 */}
      {testResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">テスト結果</h3>
          {testResults.map((result, index) => (
            <div key={index} className={`border rounded-lg p-4 ${
              result.status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{result.scenario}</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  result.status === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {result.status === 'success' ? '成功' : '失敗'}
                </span>
              </div>
              
              {result.status === 'success' && result.data && (
                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2">生成された質問:</h5>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {result.data.questions.map((q: any, i: number) => (
                        <li key={i}>{q.question}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2">評価結果:</h5>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm text-gray-600 mb-2">
                        総合スコア: <span className="font-semibold">{result.data.evaluation.totalScore}/100</span>
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        フィードバック: {result.data.evaluation.overallFeedback}
                      </p>
                      <p className="text-sm text-gray-600">
                        アドバイス: {result.data.evaluation.industrySpecificAdvice}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {result.status === 'error' && (
                <div className="text-red-600 text-sm">
                  エラー: {result.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ローディング表示 */}
      {isRunning && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">テストを実行中です...</p>
        </div>
      )}
    </div>
  );
}




