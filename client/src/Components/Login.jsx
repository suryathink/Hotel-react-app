import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {createTheme, ThemeProvider,Avatar,Button,CssBaseline,TextField,Grid,Box,Typography,Container,CircularProgress} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ctx } from "./Context/AuthContext";

const defaultTheme = createTheme();

export default function SignIn() {
  const [passwordState, setPasswordState] = useState("");
  const [emailState, setEmailState] = useState("");
  const [emailError, setEmailError] = useState(false);
  const { setIsAuth } = useContext(ctx);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (token) {
        setIsAuth(true);
        navigate("/");
      }
    }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    loginUser(emailState, passwordState);
    console.log(emailState, passwordState);
  };

  async function loginUser(email, password) {
    const apiUrl = "http://localhost:8080/login";

    try {
      setLoading(true);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email + "",
          password: password + "",
        }),
      });
      const userData = await response.json();
      if (!userData.ok) {
        toast.error(userData.error);
      }
      console.log("userData", userData);

      toast.success(userData.message);

      localStorage.setItem("token", userData.data.data.token);
      setIsAuth(true);
      navigate("/");
      return userData;
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Something Went Wrong", error);
    } finally {
      setLoading(false); // Stop loading
    }
  }

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
            Sign in
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={(e) => setPasswordState(e.target.value)}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={
                emailState === "" ||
                passwordState === "" ||
                emailError == true ||
                loading
              }
            >
              {loading ? <CircularProgress size={20} /> : "Sign In"}
            </Button>
            <Grid container>
              <Grid item>
                <p
                  style={{ color: "#0079FF", cursor: "pointer" }}
                  onClick={() => {
                    navigate("/signup");
                  }}
                  variant="body2"
                >
                  Don't have an account? Sign Up
                </p>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
