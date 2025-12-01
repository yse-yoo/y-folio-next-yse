"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  [key: number]: {
    transcript?: string;
  };
};

type SpeechRecognitionEventLike = Event & {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  addEventListener: (type: string, listener: (event: Event) => void) => void;
  removeEventListener: (type: string, listener: (event: Event) => void) => void;
}

type SpeechRecognitionConstructorLike = new () => SpeechRecognitionLike;

interface WindowWithSpeech extends Window {
  SpeechRecognition?: SpeechRecognitionConstructorLike;
  webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
}

interface Question {
  id: number;
  question: string;
}

type HistoryItem = { type: 'question' | 'answer'; text: string };

interface InterviewSessionProps {
  onFinish: (answers: { questionId: number; answer: string }[]) => void;
  questions: Question[];
  industry?: string;
  jobType?: string;
}

export default function InterviewSession({ onFinish, questions }: InterviewSessionProps) {
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>(
    questions[0] ? [{ type: 'question', text: questions[0].question }] : []
  );
  // 回答履歴のref配列
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const answersRef = useRef<{ questionId: number; answer: string }[]>([]);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const speechWindow = window as WindowWithSpeech;
    const SpeechRecognitionClass: SpeechRecognitionConstructorLike | undefined =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.lang = "ja-JP";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    const handleResult = (event: Event) => {
      const recognitionEvent = event as SpeechRecognitionEventLike;
      let finalTranscript = "";
      let interim = "";

      for (let i = recognitionEvent.resultIndex; i < recognitionEvent.results.length; i += 1) {
        const result = recognitionEvent.results[i];
        const transcript = result?.[0]?.transcript ?? "";
        if (!transcript) continue;
        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }

      if (finalTranscript.trim().length > 0) {
        setAnswer((prev) => {
          const trimmedPrev = prev.trimEnd();
          const trimmedNew = finalTranscript.trim();
          if (!trimmedPrev) return trimmedNew;
          return `${trimmedPrev} ${trimmedNew}`;
        });
      }

      setInterimTranscript(interim);
    };

    const handleError = (event: Event) => {
      const message = (event as { error?: string }).error ?? "unknown-error";
      setSpeechError(message);
      setIsListening(false);
      setInterimTranscript("");
    };

    const handleEnd = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    const handleStart = () => {
      setIsListening(true);
      setSpeechError("");
    };

    recognition.addEventListener("result", handleResult);
    recognition.addEventListener("error", handleError);
    recognition.addEventListener("end", handleEnd);
    recognition.addEventListener("start", handleStart);

    recognitionRef.current = recognition;
    setIsSpeechSupported(true);

    return () => {
      recognition.removeEventListener("result", handleResult);
      recognition.removeEventListener("error", handleError);
      recognition.removeEventListener("end", handleEnd);
      recognition.removeEventListener("start", handleStart);
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
      recognitionRef.current = null;
    };
  }, []);

  const stopListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      recognition.stop();
    } catch (error) {
      console.warn("Speech recognition stop failed", error);
    }
    setIsListening(false);
    setInterimTranscript("");
  };

  const startListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition || isListening) return;
    setSpeechError("");
    try {
      recognition.start();
    } catch (error) {
      const message = error instanceof Error ? error.message : "音声認識を開始できませんでした";
      setSpeechError(message);
    }
  };

  const toggleListening = () => {
    if (!isSpeechSupported) return;
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const finishInterview = (finalAnswers: { questionId: number; answer: string }[]) => {
    stopListening();
    onFinish(finalAnswers);
  };

  // 回答送信
  const handleSend = () => {
    const trimmed = answer.trim();
    if (!trimmed) return;

    const currentQuestion = questions[current];
    if (!currentQuestion) return;

    stopListening();

    const nextAnswers = [...answersRef.current, { questionId: currentQuestion.id, answer: trimmed }];
    answersRef.current = nextAnswers;

    const newHistory: HistoryItem[] = [...history, { type: 'answer', text: trimmed }];

    if (current < questions.length - 1) {
      newHistory.push({ type: 'question', text: questions[current + 1].question });
      setCurrent(current + 1);
      setAnswer("");
      setHistory(newHistory);
      setInterimTranscript("");
      setSpeechError("");
    } else {
      const closingHistory: HistoryItem[] = [...newHistory, { type: 'question', text: "面接は終了です。お疲れさまでした！" }];
      setHistory(closingHistory);
      setAnswer("");
      setInterimTranscript("");
      setSpeechError("");
      setTimeout(() => finishInterview(nextAnswers), 2000);
    }
  };

  // 履歴クリックで該当回答にスクロール
  const handleHistoryClick = (idx: number) => {
    answerRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // チャット本体の幅を調整し、履歴サイドバーを追加
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-16 mt-10 flex flex-row h-[80vh]">
      {/* 履歴サイドバー */}
      <div className="w-64 pr-8 border-r flex flex-col">
        <h3 className="text-lg font-bold mb-4 text-blue-700">回答履歴</h3>
        <div className="flex-1 overflow-y-auto space-y-2">
          {history
            .map((item, idx) => ({ ...item, idx }))
            .filter(item => item.type === 'answer')
            .map((item, i) => (
              <button
                key={i}
                className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 border border-transparent hover:border-blue-300 text-gray-800 truncate"
                onClick={() => handleHistoryClick(item.idx)}
              >
                {item.text}
              </button>
            ))}
        </div>
      </div>
      {/* チャット本体 */}
      <div className="flex-1 flex flex-col h-full pl-8">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {history.map((item, idx) => (
            <div
              key={idx}
              ref={el => {
                if (item.type === 'answer') answerRefs.current[idx] = el;
              }}
              className={`flex ${item.type === 'question' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`px-4 py-2 rounded-lg ${item.type === 'question' ? 'bg-blue-100 text-blue-900' : 'bg-gray-200 text-gray-800'}`}>
                {item.text}
              </div>
            </div>
          ))}
        </div>
        {current < questions.length && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-start">
              <input
                className="flex-1 border rounded-lg p-2"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="回答を入力してください"
              />
              {isSpeechSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  aria-pressed={isListening}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition ${
                    isListening
                      ? 'bg-red-50 border-red-400 text-red-600'
                      : 'bg-blue-50 border-blue-300 text-blue-700'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isListening ? '停止' : '音声入力'}</span>
                </button>
              )}
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                onClick={handleSend}
                disabled={!answer.trim()}
              >
                送信
              </button>
            </div>
            {interimTranscript && (
              <div className="text-sm text-gray-600 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2">
                {interimTranscript}
              </div>
            )}
            {speechError && (
              <div className="text-sm text-red-600">音声入力エラー: {speechError}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 