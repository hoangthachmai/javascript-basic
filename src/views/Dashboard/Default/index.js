import React from 'react';
import { useSelector } from 'react-redux';
import { getUrlByAction } from './../../../utils/utils';
import BookingWrapper from './../../Booking/index';
import AccountWrapper from '../../Account';
import DepartmentWrapper from '../../Department';
import { Grid } from '@material-ui/core';
import { bookingActions, gridSpacing, accountActions, departmentActions, mentorActions } from './../../../store/constant';
import MentorWrapper from '../../Mentor';
import Summnary from './../Summary/index';

const Default = () => {
  const { selectedFolder } = useSelector((state) => state.folder);

  const availableBookingEndpoint = Object.values(bookingActions);
  const availableAccountEndpoint = Object.values(accountActions);
  const availableMentorEndpoint = Object.values(mentorActions);
  const availableDepartmentEndpoint = Object.values(departmentActions);

  return (
    <Grid container spacing={gridSpacing}>
      {!getUrlByAction(selectedFolder) && <Summnary />}
      {getUrlByAction(selectedFolder) && (
        <Grid item xs={12}>
          {availableBookingEndpoint.includes(selectedFolder?.action) && <BookingWrapper />}
          {availableAccountEndpoint.includes(selectedFolder?.action) && <AccountWrapper />}
          {availableDepartmentEndpoint.includes(selectedFolder?.action) && <DepartmentWrapper />}
          {availableMentorEndpoint.includes(selectedFolder?.action) && <MentorWrapper />}
        </Grid>
      )}
    </Grid>
  );
};

export default Default;
