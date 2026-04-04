import { useState } from 'react';

export default function TrueFalse({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);

  const handleSubmit = () => {
    if (selected === null) return;
    const isCorrect = selected === question.correctAnswer;
    onAnswer(isCorrect);
    setSelected(null);
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-8">{question.question}</h2>
      
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setSelected(true)}
          className={`flex-1 p-4 rounded-xl border-2 font-bold ${selected === true ? 'border-blue-500 bg-blue-50 text-blue-500' : 'border-gray-200'}`}
        >
          正确
        </button>
        <button
          onClick={() => setSelected(false)}
          className={`flex-1 p-4 rounded-xl border-2 font-bold ${selected === false ? 'border-blue-500 bg-blue-50 text-blue-500' : 'border-gray-200'}`}
        >
          错误
        </button>
      </div>

      <div className="mt-auto pb-4">
        <button 
          onClick={handleSubmit}
          disabled={selected === null}
          className="w-full bg-green-500 disabled:bg-gray-300 text-white p-4 rounded-2xl font-bold"
        >
          提交
        </button>
      </div>
    </div>
  );
}
