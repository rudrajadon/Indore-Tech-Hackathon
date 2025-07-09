import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Paper, Button, Divider, Chip, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImageIcon from "@mui/icons-material/Image";
import MapIcon from "@mui/icons-material/Map";
import FeedbackIcon from "@mui/icons-material/Feedback";
import MapDisplay from "./MapDisplay";
import { useNavigate, useParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const statusColors = {
  pending: "#ffb300",
  verified: "#1976d2",
  resolved: "#43a047",
  closed: "#888",
};

export default function AdminReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BACKEND_URL}/api/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReport(res.data);
      } catch (e) {
        setReport(null);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!report) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Report not found.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, mb: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back to Dashboard
      </Button>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" color="primary" gutterBottom>
          Report Details
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mb: 2 }}>
          <Chip
            label={report.status?.charAt(0).toUpperCase() + report.status?.slice(1)}
            sx={{
              bgcolor: statusColors[report.status] || "#bbb",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              mr: 2,
            }}
          />
          <Typography variant="body2" sx={{ color: "#888", display: "inline" }}>
            {new Date(report.createdAt).toLocaleString()}
          </Typography>
        </Box>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          <b>User:</b> {report.user?.email || "N/A"}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          <b>Address:</b> {report.address}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          <b>Description:</b>
          <Box sx={{ mt: 1, bgcolor: "#f6f6f6", p: 2, borderRadius: 1, fontFamily: "monospace" }}>
            {report.description}
          </Box>
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {report.photo && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                <ImageIcon fontSize="small" sx={{ mr: 0.5 }} />
                Photo:
              </Typography>
              <img
                src={report.photo}
                alt="Report"
                style={{ maxWidth: 270, maxHeight: 270, borderRadius: 8, border: "1px solid #ddd" }}
              />
            </Box>
          )}
          {report.location?.lat && report.location?.lng && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                <MapIcon fontSize="small" sx={{ mr: 0.5 }} />
                Location:
              </Typography>
              <Box sx={{ width: 270, height: 200, borderRadius: 8, overflow: "hidden" }}>
                <MapDisplay lat={report.location.lat} lng={report.location.lng} />
              </Box>
            </Box>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          <b>Admin Remarks:</b> {report.adminRemarks || "-"}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          <b>Feedback:</b>
          <span style={{ marginLeft: 8 }}>
            {report.feedback ? (
              <span>
                <FeedbackIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: "middle" }} />
                {report.feedback}
              </span>
            ) : (
              "-"
            )}
          </span>
        </Typography>
      </Paper>
    </Box>
  );
}