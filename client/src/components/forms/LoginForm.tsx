import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../state/authApiSlice";
import { setUser } from "../../state/authSlice";
import { useDispatch } from "react-redux";
import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
    

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const result = await login({ email, password }).unwrap();
          console.log("Login successful:", result);
          localStorage.setItem("token", result.token);
          dispatch(setUser(result.user));
          setEmail("");
          setPassword("");
          navigate("/tables");
      } catch (err) {
          console.error("Login failed:", err);
      }
  };

  return (
    <Box className="ui-container">
      <Box sx={{ width: "100%", maxWidth: 420, p: 3, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Typography variant="h4" sx={{ textAlign: "center" }}>
              Login
            </Typography>
            <TextField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              fullWidth
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              fullWidth
            />
            {error && (
              <Alert severity="error">
                {typeof error === "object" && "data" in error
                  ? (error.data as any)?.message || "Login failed"
                  : "Login failed"}
              </Alert>
            )}
            <Button type="submit" variant="contained" disabled={isLoading} fullWidth>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}