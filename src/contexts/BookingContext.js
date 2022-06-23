import React, { createContext } from 'react';
import { vibEndpoints } from '../store/constant';
import axiosInstance from '../services/axios';
import useView from '../hooks/useView';

const BookingContext = createContext({});

export const BookingProvider = ({ children }) => {
  const { setView } = useView();

  const getBookingDetail = async (id) => {
    return axiosInstance
      .post(vibEndpoints.get_booking_detail, { outputtype: 'RawJson', id })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { data: news, view } = response.data;
          setView({ ...view, action: 'detail' });
          return news;
        } else return {};
      });
  };

  const setBookingDraft = async (ids, status = 'Draft') => {
    return axiosInstance
      .post(vibEndpoints.set_booking_status, {
        outputtype: 'RawJson',
        id_list: ids,
        status: status,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) return true;
        return false;
      });
  };

  const setBookingReviewed = async (ids, status = 'Reviewed') => {
    return axiosInstance
      .post(vibEndpoints.set_booking_status, {
        outputtype: 'RawJson',
        id_list: ids,
        status: status,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) return true;
        return false;
      });
  };

  const setBookingCompleted = async (ids, status = 'Completed') => {
    return axiosInstance
      .post(vibEndpoints.set_booking_status, {
        outputtype: 'RawJson',
        id_list: ids,
        status: status,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) return true;
        return false;
      });
  };

  const updateBooking = async (booking) => {
    return axiosInstance.post(vibEndpoints.update_booking, booking).then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      return false;
    });
  };

  const getMentorDetail = async (id) => {
    return axiosInstance.post(vibEndpoints.get_mentor_detail, { outputtype: 'RawJson', id }).then((response) => {
        if (response.status === 200 && response.data.return === 200) {
            const { data: mentor } = response.data
            return mentor
        } else return {}
    });
}

  return (
    <BookingContext.Provider
      value={{
        getBookingDetail,
        setBookingDraft,
        setBookingReviewed,
        setBookingCompleted,
        updateBooking,
        getMentorDetail
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
