import React from 'react';
import { useSelector } from 'react-redux';
import { getUrlByAction } from './../../../utils/utils';
import BookingWrapper from './../../Booking/index';
import AccountWrapper from '../../Account';
import { Grid } from '@material-ui/core';
import { bookingActions, gridSpacing, accountActions } from './../../../store/constant';

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
  return (
    <Grid container spacing={gridSpacing}>
      {getUrlByAction(selectedFolder) && (
        <Grid item xs={12}>
          {availableBookingEndpoint.includes(selectedFolder?.action) && <BookingWrapper />}
          {availableAccountEndpoint.includes(selectedFolder?.action) && <AccountWrapper />}
        </Grid>
      )}
    </Grid>
  );
};

export default Default;
