import React, { createContext, useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { getSession, getUserCompleted, syncSession } from "../api/quiz.js";
import { useAuth } from "./AuthContext.jsx";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const { user } = useAuth();
  const [completed, setCompleted] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCompleted(false);
      setLoading(false);
      return;
    }

    let ignore = false;

    const fetchStatus = async () => {
      setLoading(true);
      try {
        const res = await getUserCompleted();
        if (!ignore) {
          setCompleted(!!res?.data?.data);
        }
      } catch (e) {
        console.warn("Quiz status fetch failed", e);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchStatus();
    return () => {
      ignore = true;
    };
  }, [user?.id]);

  // 1. Initialize / Resume Session
  useEffect(() => {
    const init = async () => {
      let sid = localStorage.getItem("quiz_sid");
      if (!sid) {
        sid = uuidv4();
        localStorage.setItem("quiz_sid", sid);
      }
      const res = await getSession(sid);
      setSession(res.data.data);
      setLoading(false);
    };
    init();
  }, []);

  // 2. Sync Logic
  const updateSession = async (section, step, data, goal = null) => {
    try {
      const payload = {
        sessionId: session.sessionId,
        section,
        step,
        data,
        selectedGoal: goal || session.selectedGoal,
      };

      const res = await syncSession(payload);
      setSession(res.data.data);
    } catch (err) {
      console.error("Sync error or Section Locked:", err);
    }
  };

  return (
    <QuizContext.Provider value={{ session, updateSession, loading, completed }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);
