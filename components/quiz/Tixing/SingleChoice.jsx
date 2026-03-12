import { useState } from 'react';

export default function SingleChoice({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);

  const handleSubmit = () => {
    if (!selected) return;
    const isCorrect = selected === question.correctAnswer;
    onAnswer(isCorrect);
    setSelected(null); // 重置状态给下一题
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-8">{question.question}</h2>
      
      <div className="flex flex-col gap-4 mb-8">
        {question.options.map(option => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            className={`p-4 rounded-xl border-2 text-left font-bold ${
              selected === option ? 'border-blue-500 bg-blue-50 text-blue-500' : 'border-gray-200'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-auto pb-4">
        <button 
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full bg-green-500 disabled:bg-gray-300 text-white p-4 rounded-2xl font-bold"
        >
          提交
        </button>
      </div>
    </div>
  );
}
