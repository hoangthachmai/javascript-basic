import React, { createContext } from 'react';
import { vibEndpoints } from '../store/constant';
import axiosInstance from '../services/axios';
import useView from '../hooks/useView';

const AccountContext = createContext({});

export const AccountProvider = ({ children }) => {
  const { setView } = useView();

  const getAccountDetail = async (id) => {
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

  const createAccount = async (account) => {
    return axiosInstance.post(vibEndpoints.create_account, account).then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      return false;
    });
  };
  const activeAccount = async ( account ) => {
    return axiosInstance
     .post(vibEndpoints.active_account,{
      outputtype: 'RawJson',
      ...account,

    }).then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      return false;
    });
  };
  const updateAccount = async (account) => {
    return axiosInstance.post(vibEndpoints.update_account, account).then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      return false;
    });
  };

  return (
    <AccountContext.Provider
      value={{
        getAccountDetail,
        createAccount,
        updateAccount,
        activeAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContext;
