import React, { createContext, useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { getSession, getUserSession, syncSession } from "../api/quiz.js";
import { useAuth } from "./AuthContext.jsx";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const { user } = useAuth();
  const [completed, setCompleted] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Initialize / Resume Session
  useEffect(() => {
    const init = async () => {
      let sid = localStorage.getItem("quiz_sid");
      if (!sid || user) {
        try {
          setLoading(true);
          const res = await getUserSession();
          if (res?.data?.data) {
            sid = res.data.data.sessionId;
            if (res.data.data.isCompleted) {
              setCompleted(true);
            }
          } else {
            setCompleted(false);
            sid = uuidv4();
          }
        } catch (e) {
          console.warn("Session fetch failed, starting new session", e);
          setCompleted(false);
          sid = uuidv4();
        } finally {
          setLoading(false);
        }
        localStorage.setItem("quiz_sid", sid);
      }
      const res = await getSession(sid);
      setSession(res.data.data);
      setLoading(false);
    };
    init();
  }, [user]);

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
    <QuizContext.Provider
      value={{ session, updateSession, loading, completed }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);
