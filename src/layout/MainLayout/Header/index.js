import React from 'react';
import { Box, Grid, makeStyles, IconButton, Hidden } from '@material-ui/core';

import MenuTwoToneIcon from '@material-ui/icons/MenuTwoTone';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import CompanySelectionSection from './CompanySelectionSection';
import { drawerWidth, gridSpacing } from './../../../store/constant';
import logo from '../../../assets/svgs/logo.svg';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(1.25),
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  menuIcon: {
    fontSize: '1.5rem',
  },
  logoSize: {
    width: '80px',
    height: '100%',
  },
}));

const Header = (props) => {
  const { drawerToggle } = props;
  const classes = useStyles();

  return (
    <React.Fragment>
      <Box width={drawerWidth}>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <Grid container alignItems="center" spacing={gridSpacing}>
              <Hidden smDown>
                <Grid item>
                  <Box mt={0.5}>
                    <img src={logo} alt="Logo" />
                  </Box>
                </Grid>
              </Hidden>
            </Grid>
          </Grid>
          <Grid item>
            <IconButton edge="start" className={classes.menuButton} aria-label="open drawer" color="inherit" onClick={drawerToggle}>
              <MenuTwoToneIcon className={classes.menuIcon} />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      <CompanySelectionSection />
      <div className={classes.grow} />
      <NotificationSection />
      <ProfileSection />
    </React.Fragment>
  );
};

export default Header;
