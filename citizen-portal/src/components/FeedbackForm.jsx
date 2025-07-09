import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import FeedbackIcon from "@mui/icons-material/Feedback";
import CancelIcon from "@mui/icons-material/Cancel";

export default function FeedbackForm({ report, onBack, onSubmit }) {
  const [feedback, setFeedback] = useState("");
  if (!report) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (feedback.trim()) {
      onSubmit(report._id || report.id, feedback.trim());
      setFeedback("");
    }
  }

  return (
    <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h5" color="primary" gutterBottom>
        Give Feedback
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        <b>Description:</b> {report.description}
        <br />
        <b>Address:</b> {report.address}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Feedback / Rating"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback or rate the resolution"
            multiline
            minRows={2}
            required
          />
          <Stack direction="row" spacing={2}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              startIcon={<FeedbackIcon />}
            >
              Submit Feedback
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              startIcon={<CancelIcon />}
              onClick={onBack}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
}