// /components/quiz/QuestionRenderer.jsx
import SingleChoice from './Tixing/SingleChoice';
import TrueFalse from './Tixing/TrueFalse';

export default function QuestionRenderer({ question, onAnswer }) {
  // 根据 json 里的 type 渲染对应的组件
  switch (question.type) {
    case 'single_choice':
      return <SingleChoice question={question} onAnswer={onAnswer} />;
    case 'true_false':
      return <TrueFalse question={question} onAnswer={onAnswer} />;
    default:
      return <div>未知的题型: {question.type}</div>;
  }
}
