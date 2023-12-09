import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Typography,
  Container,
  createTheme,
  ThemeProvider,
  CircularProgress,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function SignUp() {
  const [nameState, setNameState] = useState("");
  const [emailState, setEmailState] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sendDataToServer = async () => {
    try {
      // POST request
      const response = await fetch("https://lazy-lime-mackerel-veil.cyclic.app/signup", {
        method: "POST",
        body: JSON.stringify({
          name: nameState + "",
          email: emailState + "",
          password: passwordState + "",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!data.ok) {
        toast.error(data.error);
      }

      toast.success(data.data.message);

      navigate("/login");
    } catch (error) {
      console.error("Error sending data:", error);
      toast.error("Signup Failed");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Call the function to send data to the server after form submission
    await sendDataToServer();
    setLoading(false);
  };

  useEffect(() => {}, [nameState, emailState, passwordState]);

  const handleEmailChange = (e) => {
    const email = e.target.value;
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Full Name"
                  onChange={(e) => setNameState(e.target.value)}
                  autoFocus
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleEmailChange}
                  value={emailState}
                  error={emailError}
                  helperText={
                    emailError ? "Please provide valid Email address" : ""
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(e) => {
                    setPasswordState(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={
                nameState === "" ||
                emailState === "" ||
                passwordState === "" ||
                emailError === true ||
                loading
              }
            >
              {loading ? <CircularProgress size={20} /> : "Sign Up"}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <p
                  style={{ color: "#0079FF", cursor: "pointer" }}
                  onClick={() => {
                    navigate("/login");
                  }}
                  variant="body2"
                >
                  Already have an account? Sign in
                </p>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
