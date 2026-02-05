import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import Preloder from "../sections/Preloder";

const Button = ({ text = "TAKE QUIZ NOW", cText = "MY NUTRITION REPORT" }) => {
  const navigate = useNavigate();
  const { completed, loading } = useQuiz();

  if (loading) return <Preloder />;

  return (
    <button
      onClick={() => navigate(completed ? "/recommend" : "/quiz")}
      className="rounded-xl uppercase bg-[linear-gradient(90deg,#E7497B_0%,#717FF3_100%)] px-6 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90 transition"
    >
      {completed ? cText : text}
    </button>
  );
};

export default Button;
