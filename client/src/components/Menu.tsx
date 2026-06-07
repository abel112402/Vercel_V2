import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { clearUser, selectIsLoggedIn, selectUser } from "../state/authSlice";
import { useLogoutMutation } from "../state/authApiSlice";
import { AppBar, Toolbar, Typography, Button, Box, Chip } from "@mui/material";

export default function Menu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [logout, { isLoading }] = useLogoutMutation();
  const user = useSelector(selectUser);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      dispatch(clearUser());
      navigate("/tables");
    }
  };

  return (
    <AppBar 
      position="static" 
      color="transparent" 
      elevation={0} 
      sx={{ borderBottom: "1px solid #eaeaea", backgroundColor: "#fff", mb: 4 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h5"
          component={Link}
          to="/tables"
          sx={{
            textDecoration: "none",
            color: "#1a1a1a",
            fontWeight: 700,
            letterSpacing: "1px",
          }}
        >
          Roomlie
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button color="inherit" component={Link} to="/tables" sx={{ textTransform: "none" }}>
            Room
          </Button>

          {!isLoggedIn && (
            <>
              <Button color="inherit" component={Link} to="/login" sx={{ textTransform: "none" }}>
                Login
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                component={Link} 
                to="/register" 
                sx={{ textTransform: "none", borderRadius: 2, ml: 1 }}
              >
                Register
              </Button>
            </>
          )}

          {isLoggedIn && (user?.role === "user" || user?.role === "admin") && (
            <Button color="inherit" component={Link} to="/bookings" sx={{ textTransform: "none" }}>
              My Bookings
            </Button>
          )}

          {user?.role === "admin" && (
            <>
              <Button color="inherit" component={Link} to="/admin/add-table" sx={{ textTransform: "none" }}>
                Add Table
              </Button>
              <Button color="inherit" component={Link} to="/admin/received-bookings" sx={{ textTransform: "none" }}>
                Received Bookings
              </Button>
            </>
          )}

          {isLoggedIn && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 2, pl: 2, borderLeft: "1px solid #eaeaea" }}>
              <Typography variant="body2" sx={{ color: "#666", display: "flex", alignItems: "center" }}>
                {user?.name || user?.email}
                {user?.role === "admin" && (
                  <Chip label="Admin" size="small" sx={{ ml: 1, height: 20, fontSize: "0.7rem", backgroundColor: "#000", color: "#fff" }} />
                )}
              </Typography>
              
              <Button
                variant="text"
                color="error"
                onClick={handleLogout}
                disabled={isLoading}
                sx={{ textTransform: "none" }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Box>
        
      </Toolbar>
    </AppBar>
  );
}