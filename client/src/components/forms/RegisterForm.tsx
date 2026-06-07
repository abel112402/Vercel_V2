import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../state/authApiSlice";
import { setUser } from "../../state/authSlice";
import { useDispatch } from "react-redux";
import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
    

export const RegisterForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [register, { isLoading, error }] = useRegisterMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await register({ name, email, password }).unwrap();
            console.log("Registration successful:", result);
            dispatch(setUser(result.user));
            setName("");
            setEmail("");
            setPassword("");
            navigate("/tables");
        } catch (err) {
            console.error("Registration failed:", err);
        }
    };

  return (
    <Box className="ui-container">
      <Box sx={{ width: "100%", maxWidth: 420, p: 3, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Typography variant="h4" sx={{ textAlign: "center" }}>
              Register
            </Typography>
            <TextField
              id="name"
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              disabled={isLoading}
              fullWidth
            />
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
                  ? (error.data as any)?.message || "Registration failed"
                  : "Registration failed"}
              </Alert>
            )}
            <Button type="submit" variant="contained" disabled={isLoading} fullWidth>
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}