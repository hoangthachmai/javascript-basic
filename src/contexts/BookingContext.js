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

  const updateBooking = async (booking) => {
    return axiosInstance.post(vibEndpoints.update_booking, booking).then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      return false;
    });
  };

  const cancelBooking = async (id, action, note) => {
    return axiosInstance
      .post(vibEndpoints.cancel_booking, {
        outputtype: 'RawJson',
        id: id,
        action: action,
        note: note,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) return true;
        return false;
      });
  };

  const reviewBooking = async (id, action, note) => {
    return axiosInstance
      .post(vibEndpoints.review_booking, {
        outputtype: 'RawJson',
        id: id,
        action: action,

      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) return true;
        return false;
      });
  };

  const approveBooking = async (id) => {
    return axiosInstance
      .post(vibEndpoints.approve_booking, {
        outputtype: 'RawJson',
        id: id,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) return true;
        return false;
      });
  };

  const setCompletedBooking = async (id, action = null) => {
    return axiosInstance
      .post(vibEndpoints.set_completed_state, {
        outputtype: 'RawJson',
        id: id,
        action: action,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) return true;
        return false;
      });
  };

  const setNoteBooking = async (id, note) => {
    return axiosInstance
      .post(vibEndpoints.set_note_booking, {
        outputtype: 'RawJson',
        id: id,
        note: note,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) return true;
        return false;
      });
  };

  const updateBookingMentor = async (id, data) => {
    return axiosInstance
      .post(vibEndpoints.update_booking_mentor, {
        outputtype: 'RawJson',
        id: id,
        ...data,
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) return true;
        return false;
      })
      .catch(() => false);
  }

  const getMentorDetail = async (id) => {
    return axiosInstance
      .post(vibEndpoints.get_mentor_detail, { outputtype: 'RawJson', id })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { data: mentor } = response.data;
          return mentor;
        } else return {};
      });
  };

  const getListUniversity = async () => {
    return axiosInstance
      .post(vibEndpoints.get_list_university, { outputtype: 'RawJson' })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const {
            data: { list: university },
          } = response;
          return university;
        } else return {};
      });
  };

  const getFeedback = async (booking_id) => {
    return axiosInstance
      .post(vibEndpoints.get_feedback_detail, { outputtype: 'RawJson', booking_id })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { data: feedback } = response.data;
          return feedback;
        } else return {};
      });
  };

  const getMentorList = async (conditions) => {
    return axiosInstance
      .post(vibEndpoints.get_mentor_list, { outputtype: 'RawJson', ...conditions })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { data } = response;
          return data;
        } else return {};
      });
  }

  const getCareerDemandList = async () => {
    return axiosInstance
      .post(vibEndpoints.get_career_demand, { outputtype: 'RawJson' })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { data } = response;
          return data;
        } else return {};
      });
  }

  const getStatisticData = async () => {
    return axiosInstance
      .post(vibEndpoints.get_statistic_data, { outputtype: 'RawJson' })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { data } = response.data;
          return data;
        } else return {};
      });
  }

  const getLog = async (id) => {
    return axiosInstance
      .post(vibEndpoints.get_log_data, { id: id, outputtype: 'RawJson' })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { list } = response.data;
          return list;
        } else return {};
      });
  }

  return (
    <BookingContext.Provider
      value={{
        getBookingDetail,
        updateBooking,
        cancelBooking,
        reviewBooking,
        setNoteBooking,
        setCompletedBooking,
        getMentorDetail,
        getListUniversity,
        getFeedback,
        getMentorList,
        updateBookingMentor,
        getCareerDemandList,
        approveBooking,
        getStatisticData,
        getLog
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
