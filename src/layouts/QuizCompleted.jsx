import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Preloder from "../sections/Preloder";
import { useState } from "react";
import { getUserCompleted } from "../api/quiz";
import { useEffect } from "react";

const QuizCompleted = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const getReport = async () => {
      try {
        const resCompleted = await getUserCompleted();
        const session = resCompleted?.data?.data;
        if (session) navigate("/recommend");
      } catch (error) {
        showError("No completed quiz session found. Please complete the quiz.");
      } finally {
        setLoading(false);
      }
    };
    getReport();
  }, []);

  if (loading) return <Preloder />;
  return <Outlet />;
};

export default QuizCompleted;
