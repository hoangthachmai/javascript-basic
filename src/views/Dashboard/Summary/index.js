import React, { useState, useEffect } from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import ScheduleIcon from '@material-ui/icons/Schedule';
import MonetizationOnTwoTone from '@material-ui/icons/MonetizationOnTwoTone';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ReportCard from './../ReportCard/index';
import { gridSpacing } from './../../../store/constant';
import useBooking from './../../../hooks/useBooking';

const Summnary = () => {
  const theme = useTheme();
  const { getStatisticData } = useBooking();
  const [statistic, setStatistic] = useState({});

  useEffect(() => {
    getStatistic();
  }, []);

  const getStatistic = async () => {
    try {
      const data = await getStatisticData();
      setStatistic(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={5} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item lg={6} sm={6} xs={12}>
                <ReportCard
                  primary={statistic.total}
                  secondary="Tổng đăng ký"
                  color={theme.palette.info.main}
                  iconPrimary={MonetizationOnTwoTone}
                />
              </Grid>
              <Grid item lg={6} sm={6} xs={12}>
                <ReportCard
                  primary={statistic.handle}
                  secondary="Cần xử lý"
                  color={theme.palette.warning.main}
                  iconPrimary={InfoOutlinedIcon}
                  footerData=""
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={7} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item lg={4} sm={6} xs={12}>
                <ReportCard
                  primary={statistic.scheduled}
                  secondary="Đã lên lịch"
                  color={theme.palette.success.main}
                  iconPrimary={ScheduleIcon}
                />
              </Grid>
              <Grid item lg={4} sm={6} xs={12}>
                <ReportCard
                  primary={statistic.completed}
                  secondary="Đã hoàn thành"
                  color={theme.palette.primary.main}
                  iconPrimary={CheckCircleOutlineIcon}
                  footerData=""
                />
              </Grid>
              <Grid item lg={4} sm={6} xs={12}>
                <ReportCard
                  primary={statistic.cancel}
                  secondary="Đã huỷ"
                  color={theme.palette.error.main}
                  iconPrimary={CancelOutlinedIcon}
                  footerData=""
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Summnary;
