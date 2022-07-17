import React from 'react';
import { useSelector } from 'react-redux';
import { getUrlByAction } from './../../../utils/utils';
import BookingWrapper from './../../Booking/index';
import AccountWrapper from '../../Account';
import MentorWrapper from '../../Mentor';
import { Grid } from '@material-ui/core';
import { bookingActions, gridSpacing, accountActions, mentorActions } from './../../../store/constant';

const Default = () => {
  const { selectedFolder } = useSelector((state) => state.folder);

  const availableBookingEndpoint = Object.values(bookingActions);
  const availableAccountEndpoint = Object.values(accountActions);
  const availableMentorEndpoint = Object.values(mentorActions);

  return (
    <Grid container spacing={gridSpacing}>
      {getUrlByAction(selectedFolder) && (
        <Grid item xs={12}>
          {availableBookingEndpoint.includes(selectedFolder?.action) && <BookingWrapper />}
          {availableAccountEndpoint.includes(selectedFolder?.action) && <AccountWrapper />}
          {availableMentorEndpoint.includes(selectedFolder?.action) && <MentorWrapper />}
        </Grid>
      )}
    </Grid>
  );
};

export default Default;
