import { Container, Stack, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const AdminDashboardPage = () => {
  return (
    <Container maxWidth="md" sx={{ padding: 2 }}>
      <Stack spacing={3}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Typography>Manage tables and review received reservations from here.</Typography>
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
          <Button component={Link} to="/admin/add-table" variant="contained">Add Table</Button>
          <Button component={Link} to="/admin/received-bookings" variant="outlined">Received Bookings</Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default AdminDashboardPage;
