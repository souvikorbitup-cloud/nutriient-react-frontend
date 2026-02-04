import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import QuizLayout from "./layouts/QuizLayout";

import Home from "./pages/Home";
import Faq from "./pages/Faq";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
// Verify OTP page removed (OTP auth not used)
import Aboutus from "./pages/AboutUs";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import Quiz from "./pages/Quiz";
import ScrollToTop from "./Utils/ScrollToTop";
import PageNotFound from "./pages/PageNotFound";
import Cart from "./pages/Cart";
import Recommendation from "./pages/Recommendation";
import HealthRepoat from "./pages/HealthRepoat";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import ProtectedRoute from "./layouts/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { QuizProvider } from "./context/QuizContext";
import CustomToaster from "./components/CustomToaster";
import Pricing from "./pages/Pricing";
import QuizCompleted from "./layouts/QuizCompleted";
import AdminLayout from "./layouts/AdminLayout";
import AdminProtectedRoute from "./layouts/AdminProtectedRoute";
import AdminLogin from "./pages/admin_pages/AdminLogin";
import AdminDashboard from "./pages/admin_pages/AdminDashboard";
import { AdminProvider } from "./context/AdminContext";

const App = () => {
  return (
    <AuthProvider>
      <QuizProvider>
        <AdminProvider>
          <BrowserRouter>
            <CustomToaster />
            <ScrollToTop />
            <Routes>
              {/* Routes WITH Navbar & Footer */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/contact-us" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about-us" element={<Aboutus />} />
                <Route path="/terms-conditions" element={<TermsConditions />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route
                  path="/refund-return-policy"
                  element={<RefundPolicy />}
                />
                <Route path="/cart" element={<Cart />} />

                {/* Auth Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/health-reports" element={<HealthRepoat />} />
                  <Route path="/my-orders" element={<Orders />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route element={<QuizCompleted />}>
                    <Route path="/recommend" element={<Recommendation />} />
                    <Route path="/pricing" element={<Pricing />} />
                  </Route>
                </Route>
              </Route>

              {/* Routes WITHOUT Navbar & Footer */}
              <Route element={<QuizLayout />}>
                <Route path="/quiz" element={<Quiz />} />
              </Route>

              {/* Admin Routes */}

              <Route path="/admin">
                {/* Public */}
                <Route path="login" element={<AdminLogin />} />

                {/* Protected */}
                <Route element={<AdminProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                  </Route>
                </Route>
              </Route>

              <Route path="/*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
        </AdminProvider>
      </QuizProvider>
    </AuthProvider>
  );
};

export default App;
