import React, { useEffect, useState } from "react";
import { useQuiz } from "../context/QuizContext";
import { useAuth } from "../context/AuthContext";
import StepRenderer from "../components/StepRenderer";
import QuestionSlider from "../components/QuestionSlider";
import { getQuestions, getUserCompleted, deleteSession } from "../api/quiz.js";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../api/user-auth.js";
import QuizProgress from "../components/QuizProgress.jsx";
import Preloder from "../sections/Preloder.jsx";

const SECTIONS = ["BASIC", "GOAL_SELECT", "GOALS", "LIFESTYLE", "COMPLETED"];

const BASIC_DRAFT_KEY = "quiz_basic_draft";

function loadBasicDraft() {
  try {
    return JSON.parse(localStorage.getItem(BASIC_DRAFT_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

function saveBasicDraft(next) {
  localStorage.setItem(BASIC_DRAFT_KEY, JSON.stringify(next));
}

function inferFieldKey(question) {
  const vt = question?.metadata?.validationType?.toLowerCase?.();
  const text = (question?.questionText || "").toLowerCase();
  const placeholder = (question?.metadata?.placeholder || "").toLowerCase();
  const hay = `${text} ${placeholder}`;

  if (vt === "phone" || hay.includes("phone") || hay.includes("mobile"))
    return "mobile";
  if (vt === "number" && hay.includes("age")) return "age";
  if (hay.includes("age")) return "age";
  if (hay.includes("name")) return "fullName";
  if (hay.includes("gender")) return "gender";
  if (hay.includes("weight")) return "weight";
  if (hay.includes("body type") || hay.includes("bodytype")) return "bodyType";
  return null;
}

const Quiz = () => {
  const { user, signIn, signUp } = useAuth();
  const { session, updateSession, loading } = useQuiz();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [actionError, setActionError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  // direction for slide animation: 1 = forward, -1 = backward
  const [direction, setDirection] = useState(1);
  // Ensure we run an initial completion check before any quiz logic executes
  const [initializing, setInitializing] = useState(true);

  // Helper: check if the authenticated user already completed the quiz.
  // If completed, and we're in quiz flow, switch this session into the COMPLETED section
  // so the COMPLETED questions (e.g., GIF) can be shown; only navigate to /recommend
  // after the completed section's questions finish. If `skipShow` is true, navigate
  // immediately (keeps backward-compatible behavior).
  const checkAndRedirectIfCompleted = async ({
    withLoading = false,
    skipShow = false,
  } = {}) => {
    if (withLoading) setActionLoading(true);
    try {
      const resCompleted = await getUserCompleted();
      const completed = resCompleted?.data?.data;
      if (completed) {
        if (skipShow) {
          try {
            await deleteSession(session.sessionId);
          } catch (e) {
            // ignore
          }
          localStorage.removeItem("quiz_sid");
          navigate("/recommend");
          return true;
        }

        // Switch current session to COMPLETED so client shows the COMPLETED questions
        try {
          await updateSession("COMPLETED", 0, null);
        } catch (e) {
          // if update fails, fallback to immediate redirect
          try {
            await deleteSession(session.sessionId);
          } catch (e2) {
            // ignore
          }
          localStorage.removeItem("quiz_sid");
          navigate("/recommend");
          return true;
        }

        // After switching to COMPLETED, the fetch effect will load questions. If there are none,
        // navigate immediately.
        try {
          const resQ = await getQuestions("COMPLETED");
          const q = resQ?.data?.data || [];
          if (q.length === 0) {
            try {
              await deleteSession(session.sessionId);
            } catch (e) {
              // ignore
            }
            localStorage.removeItem("quiz_sid");
            navigate("/recommend");
            return true;
          }
        } catch (e) {
          // ignore errors and allow normal flow
        }

        return true;
      }
      return false;
    } catch (e) {
      return false;
    } finally {
      if (withLoading) setActionLoading(false);
    }
  };

  // Initial check: before running any quiz logic, ensure the authenticated user hasn't already completed.
  useEffect(() => {
    let mounted = true;
    const initialCheck = async () => {
      if(user?.role) navigate('/admin', { replace: true });
      try {
        const res = await getUserCompleted();
        const completed = res?.data?.data;
        if (completed) {
          // If completed, immediately navigate away (showing only Preloder during this phase)
          localStorage.removeItem("quiz_sid");
          navigate("/recommend");
          return;
        }
      } catch (e) {
        // ignore - treat as not completed
      } finally {
        if (mounted) setInitializing(false);
      }
    };
    initialCheck();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  // Fetch Questions when Section Changes
  useEffect(() => {
    if (initializing) return;
    if (!session) return;
    const fetchQ = async () => {
      // allow fetching for COMPLETED as well so we can show COMPLETED questions (e.g., GIF)
      const res = await getQuestions(
        session.currentSection,
        session.selectedGoal,
      );
      setQuestions(res.data.data);

      // If this is COMPLETED and there are no questions, navigate straightaway
      if (session.currentSection === "COMPLETED") {
        const q = res?.data?.data || [];
        if (q.length === 0) {
          navigate("/recommend");
        }
      }
    };
    fetchQ();
  }, [initializing, session?.currentSection, session?.selectedGoal, navigate]);

  // When session switches to COMPLETED we should show COMPLETED questions (e.g., GIFs).
  // Navigation to /recommend is performed after completed questions finish (handled in handleNext).
  // If the COMPLETED section has no questions (or they fail to appear), perform a fallback redirect after a short timeout.
  useEffect(() => {
    if (initializing) return;
    if (questions.length === 0 && session?.currentSection === "COMPLETED") {
      const t = setTimeout(() => navigate("/recommend"), 2000);
      return () => clearTimeout(t);
    }
  }, [initializing, questions.length, session?.currentSection, navigate]);

  // Fallback: if COMPLETED section has a GIF question but the normal flow doesn't redirect, force a redirect
  useEffect(() => {
    if (initializing) return;
    if (session?.currentSection !== "COMPLETED" || questions.length === 0)
      return;

    // Guard: ensure the loaded questions belong to the current section.
    // If we just switched sections the questions array may still contain
    // previous-section questions until the fetch completes — skip in that case.
    if (questions[0]?.section && String(questions[0].section) !== String(session.currentSection)) {
      return;
    }

    const current = questions[session.currentStep] || questions[0];
    if (!current) return;

    if (current.type === "GIF") {
      const durationSec = Math.max(1, Number(current.metadata?.duration) || 3);
      // small buffer so onNext has chance to run first
      const t = setTimeout(
        () => {
          // eslint-disable-next-line no-console
          console.warn(
            "Fallback redirect after COMPLETED GIF (duration):",
            durationSec,
          );
          navigate("/recommend");
        },
        durationSec * 1000 + 800,
      );
      return () => clearTimeout(t);
    }

    // Non-GIF completed content: quick fallback after short delay
    const t2 = setTimeout(() => {
      // eslint-disable-next-line no-console
      console.warn("Fallback redirect for COMPLETED section (no GIF)");
      navigate("/recommend");
    }, 800);
    return () => clearTimeout(t2);
  }, [initializing, session?.currentSection, session?.currentStep, questions, navigate]);

  if (initializing || loading || !session || questions.length === 0) return <Preloder />;

  const currentQ = questions[session.currentStep];
  const currentFieldKey = inferFieldKey(currentQ);

  // Back availability logic (used by UI and StepRenderer)
  const canGoBackRenderer =
    (session.currentStep > 0 && session.currentSection === "GOALS") ||
    (session.currentStep > 1 && session.currentSection !== "GOALS");

  // Show Back button only when renderer allows it, it's not a GIF step, user present,
  // and preserve the special-case rule to hide on BASIC step 3
  const showBackButton =
    (canGoBackRenderer && currentQ?.type !== "GIF") ||
    (user && session.currentSection === "BASIC" && session.currentStep === 3);

  const handleNext = async (answer) => {
    setActionError(null);

    let nextStep = session.currentStep + 1;
    let nextSection = session.currentSection;
    let goalUpdate = null;

    // BASIC section: store everything locally (draft)
    if (session.currentSection === "BASIC" && currentQ) {
      const draft = loadBasicDraft();
      const key = currentFieldKey || currentQ._id;
      const value =
        (answer?.value ?? answer?.value === "") ? answer?.value : answer;

      const nextDraft = {
        ...draft,
        [key]: value,
        _byQuestionId: {
          ...(draft._byQuestionId || {}),
          [currentQ._id]: value,
        },
      };

      // Also keep normalized keys for known fields (if we can infer them)
      if (currentFieldKey) {
        nextDraft[currentFieldKey] = value;
      }

      saveBasicDraft(nextDraft);
    }

    // ensure forward animation when advancing
    setDirection(1);

    // BASIC email step -> registerUser (send all localStorage draft)
    if (session.currentSection === "BASIC" && currentFieldKey === "mobile") {
      const draft = loadBasicDraft();
      const payload = {
        fullName: draft.fullName,
        mobile: draft.mobile,
        age: draft.age,
        gender: draft.gender,
        weight: draft.weight,
        bodyType: draft.bodyType,
      };

      try {
        setActionLoading(true);
        await signUp(payload);
      } catch (e) {
        // If email already exists, instruct the user to sign in explicitly
        const status = e?.response?.status;
        if (status === 409) {
          try {
            await signIn({ mobile: draft.mobile });
            const updatePayload = {};
            if (draft.fullName) updatePayload.fullName = draft.fullName;
            if (draft.age !== undefined) updatePayload.age = draft.age;
            if (draft.gender !== undefined) updatePayload.gender = draft.gender;
            if (draft.weight !== undefined) updatePayload.weight = draft.weight;
            if (draft.bodyType !== undefined)
              updatePayload.bodyType = draft.bodyType;

            if (Object.keys(updatePayload).length > 0) {
              await updateUser(updatePayload);
            }
            // mark that this flow is login (existing user)
            saveBasicDraft({ ...draft, authMode: "login" });

            // After sign-in inside quiz, check if user already completed the quiz and redirect if so
            if (await checkAndRedirectIfCompleted()) return;
          } catch (e2) {
            const msg = e2?.response?.data?.message || e2?.message;
            setActionError(msg);
            setActionLoading(false);
            return; // don't advance
          }
          return updateSession(
            session.currentSection,
            nextStep,
            null,
            goalUpdate,
          );
        }

        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "Failed to register user.";
        setActionError(msg);
        setActionLoading(false);
        return; // don't advance
      } finally {
        setActionLoading(false);
      }

      // signup succeeded -> mark as register flow
      const latestDraft = loadBasicDraft();
      saveBasicDraft({ ...latestDraft, authMode: "register" });

      // After signup inside quiz, check if user already completed the quiz and redirect if so
      if (await checkAndRedirectIfCompleted()) return;
    }

    // check if user already completed the quiz; if yes delete current session and redirect
    if (await checkAndRedirectIfCompleted(true)) return;

    // Special Case: user already loggedin
    if (
      user &&
      user?.mobile &&
      currentFieldKey === "bodyType" &&
      session.currentSection === "BASIC"
    ) {
      const draft = loadBasicDraft();
      const updatePayload = {};
      if (draft.age !== undefined) updatePayload.age = draft.age;
      if (draft.gender !== undefined) updatePayload.gender = draft.gender;
      if (draft.weight !== undefined) updatePayload.weight = draft.weight;
      if (draft.bodyType !== undefined) updatePayload.bodyType = draft.bodyType;

      if (Object.keys(updatePayload).length > 0) {
        await updateUser(updatePayload);
      }
      return updateSession(
        session.currentSection,
        questions.length - 1,
        null,
        goalUpdate,
      );
    }
    // Special Case: user already loggedin
    if (
      user &&
      user?.fullName &&
      currentQ.stepOrder === 0 &&
      session.currentSection === "BASIC"
    ) {
      return updateSession(session.currentSection, 2, null, goalUpdate);
    }

    // Special Case: Goal Selection
    if (session.currentSection === "GOAL_SELECT" && session.currentStep === 1) {
      goalUpdate = answer.value; // Store "PCOS", "Gut Health" etc.
    }

    // Check if section finished
    if (nextStep >= questions.length) {
      // Special handling for COMPLETED section: after last question, go to /recommend
      if (session.currentSection === "COMPLETED") {
        navigate("/recommend");
        return;
      }

      const currentIdx = SECTIONS.indexOf(session.currentSection);
      nextSection = SECTIONS[currentIdx + 1];
      nextStep = 0;
    }

    // For BASIC: keep progress synced, but keep answers in localStorage only
    const dataToSync =
      session.currentSection === "BASIC" ||
      session.currentSection === "GOAL_SELECT"
        ? null
        : answer
          ? { [currentQ._id]: answer }
          : null;

    updateSession(nextSection, nextStep, dataToSync, goalUpdate);
  };

  const handleBack = () => {
    let prevSection = session.currentSection;
    let goalUpdate = null;

    // Special Case
    if (session.currentSection === "BASIC" && session.currentStep === 3) {
      return updateSession(prevSection, 1, null, goalUpdate);
    }
    let prevStep = session.currentStep - 1;

    updateSession(prevSection, prevStep, null, goalUpdate);
  };

  // Wrapper helpers to set slide direction before moving
  const goNext = async (answer) => {
    setDirection(1);
    await handleNext(answer);
  };

  const goBack = () => {
    setDirection(-1);
    handleBack();
  };

  return (
    <div className="min-h-screen bg-[url('/bg/quiz-bg.jpg')] bg-center flex flex-col">
      {/* Header */}
      <div className="pt-8">
        <img
          src="/logo.png"
          alt="Nutrient"
          className="mx-auto h-20 object-contain cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      {/* Progress */}
      <div className="mt-10">
        <QuizProgress currentStep={session.currentSection} />
      </div>

      <QuestionSlider
        keyId={`${session.currentSection}-${session.currentStep}-${currentQ?._id}`}
        dir={direction}
        onDragEnd={(dirStr) => {
          if (dirStr === "next") {
            setDirection(1);
            handleNext(null);
          } else if (dirStr === "back") {
            setDirection(-1);
            handleBack();
          }
        }}
      >
        <StepRenderer
          question={currentQ}
          onNext={goNext}
          fieldKey={currentFieldKey}
          currValue={currentFieldKey && user ? user[currentFieldKey] || "" : ""}
          actionError={actionError}
          actionLoading={actionLoading}
          goal={session.currentSection}
          canGoBack={canGoBackRenderer}
        />
      </QuestionSlider>

      {/* Back Button */}
      {showBackButton && (
        <button
          onClick={() => {
            setDirection(-1);
            handleBack();
          }}
          className="absolute bottom-6 left-6 flex items-center gap-1 text-primary font-semibold text-sm hover:underline cursor-pointer"
        >
          ← Back
        </button>
      )}
    </div>
  );
};

export default Quiz;
