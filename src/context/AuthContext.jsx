import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { currentUser, logoutUser, userSignIn, userSignUp } from "../api/user-auth.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user")),
  );

  console.log("curr User:", user);
  
  
  const [authLoading, setAuthLoading] = useState(false);

  const setUserAndPersist = (userData) => {
    if (!userData) {
      localStorage.removeItem("user");
      setUser(null);
      return;
    }
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const refresh = async () => {
    try {
      setAuthLoading(true);
      const res = await currentUser();
      setUserAndPersist(res?.data?.data || null);
    } catch {
      // Not logged in / cookie missing
      setUserAndPersist(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    // If localStorage says logged-in, verify with server (cookie-based)
    // If localStorage empty, still attempt (safe) to support cookie-only sessions.
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (userData) => setUserAndPersist(userData);

  const signIn = async (data) => {
    setAuthLoading(true);
    try {
      const res = await userSignIn(data);
      const userData = res?.data?.data?.user || res?.data?.data;
      if (userData) setUserAndPersist(userData);
      return res;
    } finally {
      setAuthLoading(false);
    }
  };

  const signUp = async (data) => {
    setAuthLoading(true);
    try {
      const res = await userSignUp(data);
      const userData = res?.data?.data?.user || res?.data?.data;
      if (userData) setUserAndPersist(userData);
      return res;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    try {
      await logoutUser();
    } catch {
      // ignore
    } finally {
      setUserAndPersist(null);
      setAuthLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      authLoading,
      login,
      signIn,
      signUp,
      logout,
      refresh,
    }),
    [user, authLoading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
