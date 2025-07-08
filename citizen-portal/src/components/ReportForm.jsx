import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import MapPicker from "./MapPicker";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import CancelIcon from "@mui/icons-material/Cancel";

export default function ReportForm({ onSubmit, onCancel }) {
  const [desc, setDesc] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");

  function handlePhotoChange(e) {
    setPhoto(e.target.files[0]);
  }

  // MapPicker should only update location (lat/lng), not address
  function handleMapPick(loc) {
    setLocation(loc);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!desc || !address || !location || !photo) {
      setError("Please fill all fields and upload a photo.");
      return;
    }
    const newReport = {
      id: Date.now().toString(),
      description: desc,
      address,
      location, // now an object: { lat, lng }
      photoUrl: URL.createObjectURL(photo),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    onSubmit(newReport);
  }

  return (
    <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h5" color="primary" gutterBottom>
        Report Illegal Construction
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit} autoComplete="off">
        <Stack spacing={2}>
          <TextField
            label="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Describe the illegal construction or encroachment"
            multiline
            minRows={2}
            required
          />
          <TextField
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
            required
          />
          <MapPicker onPick={handleMapPick} />
          {location && (
            <Typography variant="body2" color="text.secondary">
              Lat: <b>{location.lat}</b>, Lng: <b>{location.lng}</b>
            </Typography>
          )}
          <Button
            variant="outlined"
            component="label"
            startIcon={<PhotoCamera />}
          >
            Upload Photo
            <input type="file" accept="image/*" hidden onChange={handlePhotoChange} required />
          </Button>
          {photo && (
            <img
              src={URL.createObjectURL(photo)}
              alt="Preview"
              style={{
                maxWidth: "150px",
                borderRadius: 8,
                marginTop: 8,
              }}
            />
          )}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Submit Report
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              size="large"
              startIcon={<CancelIcon />}
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
}