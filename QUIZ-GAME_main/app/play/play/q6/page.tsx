"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { saveAnswer, getAnswers } from "@/lib/answers";

const answers = [
  "Top 100 or Bust!",
  "Top 200 works for me!",
  "It’s all about the program",
  "Who cares about ranking?",
] as const;

type ChoiceIndex = 0 | 1 | 2 | 3;
const QID = "q6";

// 存储到 localStorage.answers 的值
const Q6_VALUE_MAP: Record<ChoiceIndex, string> = {
  0: "Top 100 or bust",
  1: "Top 200 works for me",
  2: "It’s all about the program",
  3: "Who cares about rankings",
};

export default function UniversityQuestion() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);

  // ✅ 回填：如果之前答过 q6，自动选中
  useEffect(() => {
    const a = getAnswers();
    const stored = a[QID] as string | undefined;
    if (!stored) return;

    // 反向映射为索引
    const backMap: Partial<Record<string, ChoiceIndex>> = {
      "Top 100 or bust": 0,
      "Top 200 works for me": 1,
      "It’s all about the program": 2,
      "Who cares about rankings": 3,
    };
    const idx = backMap[stored];
    if (idx !== undefined) setSelected(idx);
  }, []);

  const onConfirm = () => {
    if (selected === null) return;
    const ok = saveAnswer(QID, Q6_VALUE_MAP[selected as ChoiceIndex]);
    if (!ok) {
      alert("保存失败，请重试");
      return;
    }
    router.push("/play/play/q7");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      {/* iPhone framework */}
      <div
        className="w-[390px] h-[844px] rounded-[28px] shadow-2xl overflow-hidden relative text-white flex flex-col justify-between"
        style={{ background: "linear-gradient(to bottom, #c44b1e, #0b2540)" }}
      >
        {/* Question */}
        <h2 className="text-center text-xl font-bold text-white mt-6">
          Do you need a top-tier university <br /> to claim victory of the quest?
        </h2>

        {/* Image */}
        <div className="flex-1 flex items-center justify-center">
          <motion.img
            src="/quiz/q6/Mini-University.png"
            alt="Mini University"
            className="w-64 h-64 object-contain"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Options + Confirm */}
        <div className="flex flex-col items-center gap-3 mb-8">
          {answers.map((ans, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(idx)}
              className={`w-72 py-2 rounded-lg font-bold text-sm transition 
                ${
                  selected === idx
                    ? "bg-orange-400 text-white shadow-lg scale-105"
                    : "bg-blue-900 text-white opacity-90 hover:opacity-100"
                }`}
            >
              {ans}
            </button>
          ))}

          {/* Confirm */}
          <button
            disabled={selected === null}
            className={`w-72 py-2 rounded-lg font-bold text-sm transition ${
              selected !== null
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-orange-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>

        {/* Notification */}
        <p className="text-xs text-white text-center mb-4">
          Select Answer then Confirm
        </p>
      </div>
    </main>
  );
}
