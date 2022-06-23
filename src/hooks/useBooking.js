import { useContext } from 'react';
import BookingContext from '../contexts/BookingContext.js';
const useBooking = () => useContext(BookingContext);

export default useBooking;
