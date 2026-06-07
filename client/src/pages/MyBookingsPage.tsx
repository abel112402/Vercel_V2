import { useGetMineQuery } from "../state/bookingApiSlice";
import { useState } from "react";
import type { BookingInfo } from "../state/bookingSlice";
import {
  Container,
  Stack,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  CircularProgress,
} from "@mui/material";

export const MyBookingsPage = () => {
  const { data: bookings, isLoading, error } = useGetMineQuery();
  const [selectedBooking, setSelectedBooking] = useState<BookingInfo | null>(null);

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
        <Typography color="error">Error loading bookings</Typography>
      </Container>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Container sx={{ padding: 2 }}>
        <Typography>No bookings yet. Start by reserving a table!</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ padding: 2 }}>
      <Stack spacing={3}>
        <Typography variant="h4">My Bookings</Typography>

        {selectedBooking ? (
          <Box>
            <Button variant="outlined" onClick={() => setSelectedBooking(null)} sx={{ marginBottom: 2 }}>
              Back to List
            </Button>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6">Booking Details</Typography>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Table: {selectedBooking.tableName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Date: {new Date(selectedBooking.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Time: {selectedBooking.startTime} - {selectedBooking.endTime}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Name: {selectedBooking.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Email: {selectedBooking.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Phone: {selectedBooking.phone}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Headcount: {selectedBooking.headcount || "Not specified"}
                    </Typography>
                    {selectedBooking.notes && (
                      <Typography variant="body2" color="textSecondary">
                        Notes: {selectedBooking.notes}
                      </Typography>
                    )}
                  </Box>
                  <Chip
                    label={selectedBooking.status.toUpperCase()}
                    color={getStatusColor(selectedBooking.status) as any}
                    variant="filled"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <Stack spacing={2}>
            {bookings.map((booking) => (
              <Card key={booking.id} sx={{ cursor: "pointer", "&:hover": { boxShadow: 3 } }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="h6">{booking.tableName}</Typography>
                      <Chip
                        label={booking.status.toUpperCase()}
                        color={getStatusColor(booking.status) as any}
                        variant="filled"
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(booking.date).toLocaleDateString()} at {booking.startTime}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Name: {booking.name}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      View Details
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
};
