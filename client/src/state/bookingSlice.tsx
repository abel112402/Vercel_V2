import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type BookingInfo = {
  id: number;
  tableId: number;
  tableName: string;
  userId: number;
  date: string;
  startTime: string;
  endTime: string;
  name: string;
  email: string;
  phone: string;
  headcount: number | null;
  status: "pending" | "accepted" | "declined";
  notes: string | null;
};

export interface BookingState {
    bookings: BookingInfo[] | null;
}

const initialState: BookingState = {
    bookings: [],
};

export const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        setBookings(state, action: PayloadAction<BookingInfo[] | null>) {
        state.bookings = action.payload;
        },
        addBooking(state, action: PayloadAction<BookingInfo>) {
        if (state.bookings) {
            state.bookings.push(action.payload);
        } else {
            state.bookings = [action.payload];
        }
        }
    }
});

export const selectBookings = (state: { booking: BookingState }) => state.booking.bookings;

export const { setBookings, addBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
