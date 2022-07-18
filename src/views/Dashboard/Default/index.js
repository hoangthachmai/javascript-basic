import React from 'react';
import { useSelector } from 'react-redux';
import { getUrlByAction } from './../../../utils/utils';
import BookingWrapper from './../../Booking/index';
import AccountWrapper from '../../Account';
import DepartmentWrapper from '../../Department';
import { Grid } from '@material-ui/core';
import { bookingActions, gridSpacing, accountActions, departmentActions } from './../../../store/constant';

const Default = () => {
  const { selectedFolder } = useSelector((state) => state.folder);

  const availableBookingEndpoint = [
    bookingActions.all_list,
    bookingActions.handle_list,
    bookingActions.cancel_list,
    bookingActions.completed_list,
    bookingActions.by_date_list,
    bookingActions.by_mentor_list,
  ];
  const availableAccountEndpoint = [
    accountActions.list_active_user,
    accountActions.list_inactive_user,
   
  ];
  const availableDepartmentEndpoint = [
    departmentActions.list_active_department,
    departmentActions.list_inactive_department,
   
  ];
  return (
    <Grid container spacing={gridSpacing}>
      {getUrlByAction(selectedFolder) && (
        <Grid item xs={12}>
          {availableBookingEndpoint.includes(selectedFolder?.action) && <BookingWrapper />}
          {availableAccountEndpoint.includes(selectedFolder?.action) && <AccountWrapper />}
          {availableDepartmentEndpoint.includes(selectedFolder?.action) && <DepartmentWrapper />}
        </Grid>
      )}
    </Grid>
  );
};

export default Default;
