import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserCompleted } from "../api/quiz";
import { useAuth } from "../context/AuthContext";
import Preloder from "../sections/Preloder";

const Button = ({ text = "TAKE QUIZ NOW", cText = "MY NUTRITION REPORT" }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const resCompleted = await getUserCompleted();
        const isCompleted = resCompleted?.data?.data;
        if (mounted) setCompleted(isCompleted);
      } catch (error) {
        // fail silently; optionally log in dev
        // eslint-disable-next-line no-console
        console.warn("Failed to fetch quiz completion status:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [user]);

  const handleClick = () => {
    if (loading) return;
    if (completed) navigate("/recommend");
    else navigate("/quiz");
  };

  if (loading) return <Preloder />;

  return (
    <button
      className={`rounded-xl uppercase bg-[linear-gradient(90deg,#E7497B_0%,#717FF3_100%)] px-6 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90 transition ${loading ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:bg-[linear-gradient(270deg,#E7497B_0%,#717FF3_100%)]"}`}
      onClick={handleClick}
      disabled={loading}
      aria-busy={loading}
      title={completed ? cText : text}
    >
      {loading ? (
        <>
          <i className="fa-solid fa-spinner fa-spin mr-2" />
          Checking...
        </>
      ) : completed ? (
        cText
      ) : (
        text
      )}
    </button>
  );
};

export default Button;
