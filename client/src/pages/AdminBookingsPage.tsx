import { useGetAllQuery, useUpdateStatusMutation } from "../state/bookingApiSlice";
import {
  Container,
  Stack,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Box,
} from "@mui/material";

const getStatusColor = (status: string) => {
  switch (status) {
    case "accepted":
      return "success";
    case "declined":
      return "error";
    case "pending":
      return "warning";
    default:
      return "default";
  }
};

export const AdminBookingsPage = () => {
  const { data: bookings, isLoading, error } = useGetAllQuery();
  const [updateStatus] = useUpdateStatusMutation();

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
    } catch (err) {
      console.error("Failed to update booking status", err);
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ padding: 2 }}>
        <Typography color="error">Unable to load received bookings.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ padding: 2 }}>
      <Stack spacing={3}>
        <Typography variant="h4">Received Bookings</Typography>
        {bookings?.bookings?.length ? (
          bookings.bookings.map((booking: any) => (
            <Card key={booking.id}>
              <CardContent>
                <Stack spacing={1}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6">{booking.tableName}</Typography>
                    <Chip label={booking.status.toUpperCase()} color={getStatusColor(booking.status) as any} />
                  </Box>
                  <Typography>{new Date(booking.date).toLocaleDateString()} {booking.startTime} - {booking.endTime}</Typography>
                  <Typography>{booking.name} ({booking.email})</Typography>
                  <Typography>Phone: {booking.phone}</Typography>
                  <Typography>Guests: {booking.headcount ?? "N/A"}</Typography>
                  {booking.notes && <Typography>Notes: {booking.notes}</Typography>}
                  {booking.status === "pending" && (
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Button variant="contained" color="success" onClick={() => handleStatusUpdate(booking.id, "accepted")}>Accept</Button>
                      <Button variant="outlined" color="error" onClick={() => handleStatusUpdate(booking.id, "declined")}>Decline</Button>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No bookings have been received yet.</Typography>
        )}
      </Stack>
    </Container>
  );
};
