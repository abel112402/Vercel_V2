import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Slider,
  Stack,
  TextField,
  FormControlLabel,
  Box,
  CircularProgress,
  MenuItem,
  Alert,
  Typography,
} from "@mui/material";
import type { TableInterface } from "../../data/Table";
import { useMemo, useState } from "react";
import { useBookMutation } from "../../state/bookingApiSlice";
import { useGetTimeslotsQuery } from "../../state/tableApiSlice";
import { useSelector } from "react-redux";
import { selectUser } from "../../state/authSlice";

interface DetailsFormProps {
  table: TableInterface;
  removeTable: (tableId: string) => void;
  updateTable: (table: TableInterface) => void;
  setSelectedTableId?: (tableId: string | null) => void;
}

const DetailsForm = ({
  table,
  removeTable,
  updateTable,
  setSelectedTableId,
}: DetailsFormProps) => {
    const [reservationOpen, setReservationOpen] = useState(false);
    const [bookingName, setBookingName] = useState("");
    const [bookingEmail, setBookingEmail] = useState("");
    const [bookingPhone, setBookingPhone] = useState("");
    const [bookingHeadcount, setBookingHeadcount] = useState(1);
    const [bookingNotes, setBookingNotes] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedStartTime, setSelectedStartTime] = useState("");

    const [book, { isLoading: isBooking, error: bookingError }] = useBookMutation();
    const loggedInUser = useSelector(selectUser);
    const isAdmin = loggedInUser?.role === "admin";
    const canReserve = loggedInUser?.role === "user" || loggedInUser?.role === "admin";

    const { data: timeslots = [], isFetching: loadingTimeslots, error: timeslotError } = useGetTimeslotsQuery(
    { id: Number(table.id), date: selectedDate },
    { skip: !selectedDate },
    );

    const availableStartSlots = useMemo(
    () => timeslots.filter((slot) => slot.isAvailable).map((slot) => slot.startTime),
    [timeslots],
    );

    const selectedTimeslot = useMemo(
        () => timeslots.find((slot) => slot.startTime === selectedStartTime),
        [timeslots, selectedStartTime],
    );

    const handleReservationOpen = () => {
        setReservationOpen(true);
    };

    const handleCloseReservation = () => {
        setReservationOpen(false);
        setBookingPhone("");
        setBookingHeadcount(1);
        setBookingNotes("");
        setSelectedDate("");
        setSelectedStartTime("");
    };

    const handleStatusChange = (_event: Event, newValue: number | number[]) => {
        updateTable({ ...table, status: newValue as number });
    };

    const handlePositionXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateTable({
            ...table,
            position: { ...table.position, x: Number(e.target.value) },
        });
    };

    const handlePositionYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateTable({
            ...table,
            position: { ...table.position, y: Number(e.target.value) },
        });
    };

    const handleReservation = async () => {
        if (!selectedDate || !selectedStartTime || !bookingPhone) {
            alert("Please fill in all required fields.");
            return;
        }

    if (!selectedTimeslot) {
        alert("Please select a valid available timeslot.");
        return;
    }

    try {
        await book({
            tableId: Number(table.id),
            date: selectedDate,
            startTime: selectedStartTime,
            endTime: selectedTimeslot.endTime,
            name: loggedInUser?.name ?? "",
            email: loggedInUser?.email ?? "",
            phone: bookingPhone,
            headcount: bookingHeadcount,
            notes: bookingNotes || null,
        }).unwrap();
        alert("Booking submitted successfully!");
        handleCloseReservation();
    } catch (error) {
        console.error("Booking failed:", error);
        alert("Failed to submit booking.");
    }
};

    return (
    <Container
      sx={{
        textAlign: "center",
        padding: "10px",
        borderRadius: "5px",
        backgroundColor: "white",
        width: "100%",
      }}
    >
      <Stack spacing={2} sx={{ width: "100%", margin: "0 auto" }}>
        <Typography variant="h5">{table.name || `Table ${table.id}`}</Typography>
        <Typography>Type: {table.type}</Typography>
        <Typography>Category: {table.category}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography>Color:</Typography>
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: table.color,
              border: "1px solid #ccc",
              marginLeft: 1,
            }}
          />
        </Box>

        {isAdmin && (
          <>
            <FormControl>
              <FormLabel sx={{ marginBottom: 1 }}>Position</FormLabel>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="X"
                  name="position.x"
                  type="number"
                  value={table.position.x}
                  onChange={handlePositionXChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Y"
                  name="position.y"
                  type="number"
                  value={table.position.y}
                  onChange={handlePositionYChange}
                  fullWidth
                  size="small"
                />
              </Stack>
            </FormControl>
            <FormControl>
              <FormLabel id="status-slider-label">Status (1-10)</FormLabel>
              <Slider
                aria-labelledby="status-slider-label"
                color="secondary"
                value={table.status}
                max={10}
                min={1}
                valueLabelDisplay="auto"
                onChange={handleStatusChange}
              />
            </FormControl>
            <FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={table.isLocked}
                    onChange={(e) => updateTable({ ...table, isLocked: e.target.checked })}
                  />
                }
                label="Locked"
              />
            </FormControl>
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                if (setSelectedTableId) setSelectedTableId(null);
                removeTable(table.id);
              }}
            >
              Remove Table
            </Button>
          </>
        )};

        {canReserve ? (
            <Button variant="contained" onClick={handleReservationOpen}>
            Reserve Table
            </Button>
        ) : (
            <Typography>Sign in as a user to reserve this table.</Typography>
        )}

        {reservationOpen && canReserve && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Reserve Table
            </Typography>
            {bookingError && (
              <Alert severity="error" sx={{ marginBottom: 2 }}>
                Booking failed. Please try again.
              </Alert>
            )}
            <Stack spacing={2}>
              <FormControl fullWidth>
                <FormLabel sx={{ marginBottom: 1 }}>Select Date *</FormLabel>
                <TextField
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedStartTime("");
                  }}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: { min: new Date().toISOString().split("T")[0] },
                  }}
                  fullWidth
                />
              </FormControl>
              <FormControl fullWidth>
                <FormLabel sx={{ marginBottom: 1 }}>Start Time *</FormLabel>
                <TextField
                  select
                  value={selectedStartTime}
                  onChange={(e) => setSelectedStartTime(e.target.value)}
                  disabled={!selectedDate || loadingTimeslots}
                >
                  {timeslotError ? (
                    <MenuItem value="">Unable to load timeslots</MenuItem>
                  ) : (
                    availableStartSlots.map((slot) => (
                      <MenuItem key={slot} value={slot}>
                        {slot}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              </FormControl>
              <TextField
                label="End Time"
                value={selectedTimeslot?.endTime ?? ""}
                fullWidth
                disabled
              />
              <TextField
                label="Name *"
                value={bookingName}
                onChange={(e) => setBookingName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Email *"
                value={bookingEmail}
                onChange={(e) => setBookingEmail(e.target.value)}
                fullWidth
              />
              <TextField
                label="Phone *"
                value={bookingPhone}
                onChange={(e) => setBookingPhone(e.target.value)}
                fullWidth
              />
              <TextField
                label="headcount"
                type="number"
                value={bookingHeadcount}
                onChange={(e) => setBookingHeadcount(Number(e.target.value))}
                fullWidth
                slotProps={{ htmlInput: { min: 1 } }}
              />
              <TextField
                label="Notes (Optional)"
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleReservation}
                  disabled={
                    isBooking ||
                    !selectedDate ||
                    !selectedStartTime ||
                    !selectedTimeslot
                  }
                  fullWidth
                >
                  {isBooking ? (
                    <>
                      <CircularProgress size={20} sx={{ marginRight: 1 }} />
                      Submitting...
                    </>
                  ) : (
                    "Submit Reservation"
                  )}
                </Button>
                <Button variant="outlined" onClick={handleCloseReservation} disabled={isBooking}>
                  Cancel
                </Button>
              </Box>
            </Stack>
          </Box>
        )}
      </Stack>
    </Container>
  );
};

export default DetailsForm;