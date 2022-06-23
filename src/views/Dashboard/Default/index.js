import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUrlByAction } from './../../../utils/utils';
import BookingWrapper from './../../Booking/index';
import { Grid } from '@material-ui/core';
import { bookingActions, gridSpacing } from './../../../store/constant';

const Default = () => {
  const dispatch = useDispatch();

  const { selectedFolder } = useSelector((state) => state.folder);

  const availableBookingEndpoint = [
    bookingActions.draft_list,
    bookingActions.reviewed_list,
    bookingActions.completed_list,
  ];
  
  return (
    <Grid container spacing={gridSpacing}>
      {getUrlByAction(selectedFolder) && (
        <Grid item xs={12}>
          {availableBookingEndpoint.includes(selectedFolder?.action) && <BookingWrapper />}
        </Grid>
      )}
    </Grid>
  );
};

export default Default;
