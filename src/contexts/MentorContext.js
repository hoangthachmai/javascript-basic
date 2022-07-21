import React, { createContext } from 'react';
import { vibEndpoints } from '../store/constant';
import axiosInstance from '../services/axios';
import useView from '../hooks/useView';

const MentorContext = createContext({});

export const MentorProvider = ({ children }) => {
  const { setView } = useView();

  const getMentorDetail = async (id) => {
    return axiosInstance
      .post(vibEndpoints.get_mentor_detail_by_id, {
        outputtype: 'RawJson', id
      })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { data: news, view } = response.data;
          setView({ ...view, action: 'detail' });
          return news;
        } else return {};
      });
  };

  const createMentor = async (mentor) => {
    return axiosInstance.post(vibEndpoints.create_mentor, { outputtype: 'RawJson', ...mentor }).then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      return false;
    });
  };

  const updateMentor = async (mentor) => {
    return axiosInstance.post(vibEndpoints.update_mentor, { outputtype: 'RawJson', ...mentor }).then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      return false;
    });
  };

  const toggleActiveMentor = async (data) => {
    return axiosInstance.post(vibEndpoints.set_active_mentor, { outputtype: 'RawJson', ...data }).then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      return false;
    });
  }

  return (
    <MentorContext.Provider
      value={{
        getMentorDetail,
        updateMentor,
        createMentor,
        toggleActiveMentor
      }}
    >
      {children}
    </MentorContext.Provider>
  );
};

export default MentorContext;