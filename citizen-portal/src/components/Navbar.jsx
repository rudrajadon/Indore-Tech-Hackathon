import React from "react";
import { AppBar, Toolbar, Typography, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";

export default function Navbar({ isAuthenticated, onGoHome, onLogout, isAdmin, onAdminDashboard, selectedLogin, onLoginToggle }) {
  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={onGoHome}
        >
          Indore Smart Encroachment – Citizen Portal
        </Typography>
        {!isAuthenticated && (
          <ToggleButtonGroup
            value={selectedLogin}
            exclusive
            onChange={(e, val) => onLoginToggle(val)}
            sx={{
              bgcolor: "#1565c0",
              borderRadius: "30px",
              p: "4px",
              '& .MuiToggleButton-root': {
                border: 0,
                borderRadius: "20px !important",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "14px",
                color: "#fff",
                px: 2,
                mx: 0.5,
                transition: "all 0.3s ease",
                '&:hover': {
                  backgroundColor: "#1e88e5",
                  color: "#fff",
                },
                '&.Mui-selected': {
                  backgroundColor: "#fff",
                  color: "#1565c0",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  '&:hover': {
                    backgroundColor: "#f0f0f0",
                  },
                },
              },
            }}
          >
            <ToggleButton value="userLogin">User Login</ToggleButton>
            <ToggleButton value="adminLogin">Admin Login</ToggleButton>
          </ToggleButtonGroup>
        )}
        {isAuthenticated && (
          <>
            {isAdmin && (
              <Button color="inherit" onClick={onAdminDashboard}>
                Admin Dashboard
              </Button>
            )}
            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}