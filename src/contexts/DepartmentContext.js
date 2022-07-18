import React, { createContext } from 'react';
import { vibEndpoints } from '../store/constant';
import axiosInstance from '../services/axios';
import useView from '../hooks/useView';

const DepartmentContext = createContext({});

export const DepartmentProvider = ({ children }) => {
  const { setView } = useView();

  const getDepartmentDetail = async (id) => {
    return axiosInstance
      .post(vibEndpoints.get_account_detail, {
         outputtype: 'RawJson' ,id})
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { data: news, view } = response.data;
          setView({ ...view, action: 'detail' });
          return news;
        } else return {};
      });
  };

  const createDepartment = async (department) => {
    return axiosInstance.post(vibEndpoints.create_account, department).then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      return false;
    });
  };
 

  return (
    <DepartmentContext.Provider
      value={{
        getDepartmentDetail,
        createDepartment,
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
};

export default DepartmentContext;
