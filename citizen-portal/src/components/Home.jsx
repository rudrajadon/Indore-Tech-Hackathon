import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import ListAltIcon from "@mui/icons-material/ListAlt";

export default function Home({ onReport, onTrack }) {
  return (
    <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Welcome to Indore Smart Encroachment Portal
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Help us keep Indore clean and planned!  
        Quickly report illegal construction or encroachment, track your complaints, and give feedback.
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
        <Button
          variant="contained"
          size="large"
          color="primary"
          startIcon={<LocationCityIcon />}
          onClick={onReport}
        >
          Report Illegal Construction
        </Button>
        <Button
          variant="outlined"
          size="large"
          color="secondary"
          startIcon={<ListAltIcon />}
          onClick={onTrack}
        >
          Track My Reports
        </Button>
      </Stack>
    </Paper>
  );
}