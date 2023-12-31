import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  createTheme,
  ThemeProvider,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ctx } from "./Context/AuthContext";

const defaultTheme = createTheme();

export default function ForgotPassword() {
  const [emailState, setEmailState] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    ForgotPass(emailState);
  };

  async function ForgotPass(email) {
    const apiUrl = "https://lazy-lime-mackerel-veil.cyclic.app/forgot-password";

    try {
      setLoading(true);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email + "",
        }),
      });
      const userData = await response.json();
      if (!userData.ok) {
        toast.error(userData.error);
      }
      console.log("userData", userData);

      toast.success(userData.message);

      navigate("/verifyOTP")

      return userData;
    } catch (error) {
      console.error("Error logging in:", error);
      //   toast.error("Something Went Wrong", error);
    } finally {
      setLoading(false); // Stop loading
    }
  }

  const handleEmailChange = (e) => {
    const email = e.target.value;
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex?.test(email);
    setEmailError(!isValidEmail);
    setEmailState(email);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              onChange={handleEmailChange}
              value={emailState}
              error={emailError}
              helperText={emailError ? "Please provide Email address only" : ""}
              autoComplete="email"
              autoFocus
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={emailState === "" || emailError == true || loading}
            >
              {loading ? <CircularProgress size={20} /> : "Submit"}
            </Button>
            <Grid container>
              <Grid item>
                <p
                  style={{ color: "#0079FF", cursor: "pointer" }}
                  onClick={() => {
                    navigate("/");
                  }}
                  variant="body2"
                >
                  Navigate to Home Page
                </p>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
