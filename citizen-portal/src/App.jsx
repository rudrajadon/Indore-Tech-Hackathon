import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import ReportForm from "./components/ReportForm";
import ReportList from "./components/ReportList";
import FeedbackForm from "./components/FeedbackForm";
import axios from "axios";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AdminDashboard from "./components/AdminDashboard";
import AdminReportDetail from "./components/AdminReportDetail";
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
import AdminLogin from "./components/AdminLogin";
import {
  Routes,
  Route,
  useNavigate,
  BrowserRouter as Router,
  Navigate,
  useLocation,
} from "react-router-dom";

function App() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [selectedLogin, setSelectedLogin] = useState("userLogin");

  const navigate = useNavigate();
  const location = useLocation();

  async function fetchReports() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/reports/my",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports(res.data);
    } catch (err) {
      setError("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }

  async function submitFeedback(reportId, feedback) {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        import.meta.env.VITE_BACKEND_URL + `/api/reports/${reportId}/feedback`,
        { feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports((prev) =>
        prev.map((r) =>
          (r._id || r.id) === reportId ? { ...r, feedback } : r
        )
      );
      navigate("/reports");
    } catch (err) {
      setError("Failed to submit feedback");
    }
  }

  function handleReportSubmitted(newReport) {
    setReports((prev) => [newReport, ...prev]);
    navigate("/reports");
  }

  function handleGoHome() {
    navigate("/");
  }

  function handleFeedback(report) {
    setSelectedReport(report);
    navigate("/feedback");
  }

  function handleAuth(role) {
    setIsAuthenticated(true);
    setUserRole(role);
    if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/");
  }

  function isAdmin() {
    return userRole === "admin";
  }

  useEffect(() => {
    if (
      location.pathname === "/reports" &&
      isAuthenticated &&
      !isAdmin()
    ) {
      fetchReports();
    }
    // eslint-disable-next-line
  }, [location.pathname, isAuthenticated, userRole]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar
        isAuthenticated={isAuthenticated}
        onGoHome={handleGoHome}
        onLogout={handleLogout}
        isAdmin={isAdmin()}
        onAdminDashboard={() => navigate("/admin/dashboard")}
        selectedLogin={selectedLogin}
        onLoginToggle={(val) => {
          setSelectedLogin(val);
          navigate("/");
        }}
      />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          {/* Auth routes */}
          {!isAuthenticated && (
            <>
              <Route
                path="/"
                element={
                  selectedLogin === "userLogin" ? (
                    <AuthForm onAuth={handleAuth} />
                  ) : (
                    <AdminLogin onAuth={handleAuth} />
                  )
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}

          {/* Authenticated User Routes */}
          {isAuthenticated && !isAdmin() && (
            <>
              <Route
                path="/"
                element={
                  <Home
                    onReport={() => navigate("/report")}
                    onTrack={() => navigate("/reports")}
                  />
                }
              />
              <Route
                path="/report"
                element={
                  <ReportForm
                    onSubmit={handleReportSubmitted}
                    onCancel={handleGoHome}
                  />
                }
              />
              <Route
                path="/reports"
                element={
                  loading ? (
                    <div>Loading...</div>
                  ) : error ? (
                    <div>{error}</div>
                  ) : (
                    <ReportList
                      reports={reports}
                      onFeedback={handleFeedback}
                      onBack={handleGoHome}
                    />
                  )
                }
              />
              <Route
                path="/feedback"
                element={
                  <FeedbackForm
                    report={selectedReport}
                    onBack={() => navigate("/reports")}
                    onSubmit={submitFeedback}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}

          {/* Admin routes */}
          {isAuthenticated && isAdmin() && (
            <>
              <Route
                path="/admin/dashboard"
                element={<AdminDashboard onBack={handleGoHome} />}
              />
              <Route
                path="/admin/report/:id"
                element={<AdminReportDetail />}
              />
              {/* Redirect any other route to dashboard */}
              <Route path="*" element={<Navigate to="/admin/dashboard" />} />
            </>
          )}
        </Routes>
      </Container>
      <Box
        component="footer"
        sx={{ textAlign: "center", py: 2, color: "grey.600" }}
      >
        &copy; {new Date().getFullYear()} Indore Smart City
      </Box>
    </Box>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}