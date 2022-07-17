import React, { useState, useEffect } from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import MonetizationOnTwoTone from '@material-ui/icons/MonetizationOnTwoTone';
import DescriptionTwoTone from '@material-ui/icons/DescriptionTwoTone';
import ThumbUpAltTwoTone from '@material-ui/icons/ThumbUpAltTwoTone';
import CalendarTodayTwoTone from '@material-ui/icons/CalendarTodayTwoTone';
import ReportCard from './../ReportCard/index';
import RevenuChartCard from './../../Chart/RevenuChartCard';
import { gridSpacing } from './../../../store/constant';
import useBooking from './../../../hooks/useBooking';

const Summnary = () => {
  const theme = useTheme();
  const [label, setLabel] = useState([]);
  const [series, setSeries] = useState([]);
  const { getStatisticData } = useBooking();

  useEffect(() => {
    getDataDonut();
  }, []);

  const getDataDonut = async () => {
    try {
      const data = await getStatisticData();
      setLabel(data.map((item) => item.label));
      setSeries(data.map((item) => item.series));
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
              primary={10}
              secondary="Đăng ký mới"
              color={theme.palette.primary.main}
              footerData="10% changes on profit"
              iconPrimary={MonetizationOnTwoTone}
              iconFooter={TrendingUpIcon}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={5}
              secondary="Đăng ký cần xử lý"
              color={theme.palette.warning.main}
              footerData="28% task performance"
              iconPrimary={CalendarTodayTwoTone}
              iconFooter={TrendingDownIcon}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={7}
              secondary="Đăng ký đã huỷ"
              color={theme.palette.error.main}
              footerData="10k daily views"
              iconPrimary={DescriptionTwoTone}
              iconFooter={TrendingUpIcon}
            />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ReportCard
              primary={100}
              secondary="Đăng ký"
              color={theme.palette.success.main}
              footerData="1k download in App store"
              iconPrimary={ThumbUpAltTwoTone}
              iconFooter={TrendingUpIcon}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={8} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={6}>
                <RevenuChartCard label={label} series={series} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Summnary;
