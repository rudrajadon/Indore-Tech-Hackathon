import React, { useState } from "react";
import Home from "./components/Home";
import ReportForm from "./components/ReportForm";
import ReportList from "./components/ReportList";
import FeedbackForm from "./components/FeedbackForm";
import { reports as mockReports } from "./mockData";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

export default function App() {
  const [view, setView] = useState("home");
  const [reports, setReports] = useState(mockReports);
  const [selectedReport, setSelectedReport] = useState(null);

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
        {view === "home" && (
          <Home onReport={() => setView("report")} onTrack={() => setView("reports")} />
        )}
        {view === "report" && (
          <ReportForm
            onSubmit={handleReportSubmitted}
            onCancel={handleGoHome}
          />
        )}
        {view === "reports" && (
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
      </Container>
      <Box component="footer" sx={{ textAlign: "center", py: 2, color: "grey.600", bgcolor: "background.default" }}>
        &copy; {new Date().getFullYear()} Indore Smart City
      </Box>
    </Box>
  );
}