import React, { useState } from "react";
import Home from "./components/Home";
import ReportForm from "./components/ReportForm";
import ReportList from "./components/ReportList";
import FeedbackForm from "./components/FeedbackForm";
import axios from 'axios';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AdminDashboard from './components/AdminDashboard';
import AuthForm from './components/AuthForm';

export default function App() {
  const [view, setView] = useState("home");
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  async function fetchReports() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/reports/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
    } catch (err) {
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  }

  function handleReportSubmitted(newReport) {
    setReports([newReport, ...reports]);
    setView("reports");
  }

  function handleGoHome() {
    setView("home");
  }

  function handleFeedback(report) {
    setSelectedReport(report);
    setView("feedback");
  }

  function handleFeedbackSubmit(reportId, feedback) {
    setReports(
      reports.map((r) =>
        r.id === reportId ? { ...r, feedback, status: "closed" } : r
      )
    );
    setView("reports");
  }

  function handleAuth(role) {
    setIsAuthenticated(true);
    setUserRole(role);
    setView(role === 'admin' ? 'admin' : 'reports');
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserRole(null);
    setView('home');
  }

  // Add a function to check if user is admin
  function isAdmin() {
    return userRole === 'admin';
  }

  React.useEffect(() => {
    if (view === 'reports') {
      fetchReports();
    }
  }, [view]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={handleGoHome}
          >
            Indore Smart Encroachment – Citizen Portal
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        {!isAuthenticated ? (
          <AuthForm onAuth={handleAuth} />
        ) : (
          <>
            <Button variant="outlined" color="error" sx={{ mb: 2 }} onClick={handleLogout}>Logout</Button>
            {view === "home" && (
              <>
                {isAdmin() ? (
                  <div style={{ textAlign: "center", marginTop: 40 }}>
                    <h2>Welcome, Admin!</h2>
                    <p>
                      Use the dashboard to review, verify, and manage all citizen reports of illegal construction.
                    </p>
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ mt: 2 }}
                      onClick={() => setView('admin')}
                    >
                      Admin Dashboard
                    </Button>
                  </div>
                ) : (
                  <Home
                    onReport={() => setView("report")}
                    onTrack={() => setView("reports")}
                  />
                )}
              </>
            )}
            {view === "report" && (
              <ReportForm
                onSubmit={handleReportSubmitted}
                onCancel={handleGoHome}
              />
            )}
            {view === "reports" && (
              loading ? <div>Loading...</div> : error ? <div>{error}</div> :
              <ReportList
                reports={reports}
                onFeedback={handleFeedback}
                onBack={handleGoHome}
              />
            )}
            {view === "feedback" && (
              <FeedbackForm
                report={selectedReport}
                onBack={() => setView("reports")}
                onSubmit={handleFeedbackSubmit}
              />
            )}
            {view === "admin" && (
              <AdminDashboard onBack={handleGoHome} />
            )}
          </>
        )}
      </Container>
      <Box component="footer" sx={{ textAlign: "center", py: 2, color: "grey.600", bgcolor: "background.default" }}>
        &copy; {new Date().getFullYear()} Indore Smart City
      </Box>
    </Box>
  );
}