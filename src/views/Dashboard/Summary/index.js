import React, { useState, useEffect } from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import ScheduleIcon from '@material-ui/icons/Schedule';
import MonetizationOnTwoTone from '@material-ui/icons/MonetizationOnTwoTone';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ReportCard from './../ReportCard/index';
import { gridSpacing } from './../../../store/constant';
import useBooking from './../../../hooks/useBooking';

const Summnary = () => {
  const theme = useTheme();
  const { getStatisticData } = useBooking();
  const [statistic, setStatistic] = useState({})

  useEffect(() => {
    getStatistic();
  }, []);

  const getStatistic = async () => {
    try {
      const data = await getStatisticData();
      setStatistic(data)
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={statistic.total}
              secondary="Tổng số đăng ký"
              color={theme.palette.primary.main}
              iconPrimary={MonetizationOnTwoTone}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={statistic.scheduled}
              secondary="Đăng ký đã lên lịch"
              color={theme.palette.warning.main}
              iconPrimary={ScheduleIcon}
              footerData={statistic.pending+' Đăng ký đang chờ'}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={statistic.completed}
              secondary="Đăng ký đã hoàn thành"
              color={theme.palette.success.main}
              iconPrimary={CheckCircleOutlineIcon}
              footerData=''
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={statistic.cancel}
              secondary="Đăng ký đã huỷ"
              color={theme.palette.error.main}
              iconPrimary={CancelOutlinedIcon}
              footerData=''
            />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Summnary;
