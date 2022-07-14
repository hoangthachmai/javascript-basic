import React, { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Box,
  Typography,
  Tab,
  Select,
  FormControl,
  MenuItem,
  TextField
} from '@material-ui/core';

import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';

import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { gridSpacing, view } from '../../store/constant.js';
import useView from '../../hooks/useView';
import { style } from './style.js';
import useStyles from './classes.js';
import PermissionModal from '../FloatingMenu/UploadFile/index.js';
import { FLOATING_MENU_CHANGE } from '../../store/actions.js';
import useAccount from '../../hooks/useAccount.js';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={0}>{children}</Box>}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const AccountModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = React.useState(0);
  const [openDialogUploadImage, setOpenDiaLogUploadImage] = React.useState(false);
  const { form_buttons: formButtons, name, tabs, disabled_fields } = useView();
  const buttonSave = formButtons.find((button) => button.name === view.user.detail.save);
  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const { createAccount, updateAccount, } = useAccount();
  const { accountDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);

  const [account, setAccount] = React.useState({
    company_code: 'HNN',
    job_title: '',
    password: 'Tv@123456',
    first_name: '',
    last_name: '',
    job_title: '',
    image_url: 'https://firebasestorage.googleapis.com/v0/b/huongnghiepnhanh.appspot.com/o/Avatar%20Nam.jpg?alt=media&token=8208326e-faa9-4bdf-b811-a48481839cb5',
    email_address: '',
    is_active: true,
    employee_id: '',
  });

  useEffect(() => {
    if (!selectedDocument) return;
    setAccount({

      ...selectedDocument,

    });

  }, [selectedDocument]);



  const handleCloseDialog = () => {
    setDocumentToDefault();
    setAccount({
      company_code: 'HNN',
      job_title: '',
      password: 'Tv@123456',
      first_name: '',
      last_name: '',
      job_title: '',
      image_url: 'https://firebasestorage.googleapis.com/v0/b/huongnghiepnhanh.appspot.com/o/Avatar%20Nam.jpg?alt=media&token=8208326e-faa9-4bdf-b811-a48481839cb5',
      email_address: '',
      is_active: '',
      employee_id: '',
    });
    dispatch({ type: FLOATING_MENU_CHANGE, accountDocument: false });
  };


  const handleSaveAccount = async () => {
    try {
      await createAccount({
        ...account,
        outputtype: 'RawJson',
      });

    } catch (error) {
      console.log('error update booking', error)
    } finally {

    }
  };
  const handleUpdateAccount = async () => {
    try {

      await updateAccount({
        ...account,
        outputtype: 'RawJson',
        company_code: 'HNN'
      });
      handleCloseDialog();
    } catch (error) {
      console.log('error update booking', error)
    } finally {

    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setAccount({
      ...account,
      [e.target.name]: value
    });
  }


  const setDocumentToDefault = async () => {
    setTabIndex(0);

  };
  const setURL = (image) => {
    setAccount({
      ...account,
      image_url: image,
    });
  };

  const handleOpenDiaLog = () => {
    setOpenDiaLogUploadImage(true);
  }
  const handleCloseDiaLog = () => {
    setOpenDiaLogUploadImage(false);
  }
  return (

    <React.Fragment>
      <PermissionModal
        open={openDialogUploadImage || false}
        onSuccess={setURL}
        onClose={handleCloseDiaLog}
      />

      <Grid container>
        <Dialog
          open={openDialog || false}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDialog}
          className={classes.useradddialog}

        >

          <DialogTitle className={classes.dialogTitle}>
            <Grid item xs={12} style={{ textTransform: 'uppercase' }}>
              Tạo mới người dùng
            </Grid>
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Tabs
                  value={tabIndex}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={handleChangeTab}
                  aria-label="simple tabs example"
                  variant="scrollable"
                >
                  <Tab
                    className={classes.unUpperCase}
                    label={
                      <Typography
                        className={classes.tabLabels}
                        component="span"
                        variant="subtitle1"
                      >
                        <AccountCircleOutlinedIcon className={`${tabIndex === 0 ? classes.tabActiveIcon : ''}`} />
                        Chi tiết đăng ký
                      </Typography>
                    }
                    value={0}
                    {...a11yProps(0)}
                  />

                </Tabs>
              </Grid>
              <Grid item xs={12}>
                <TabPanel value={tabIndex} index={0}>
                  <Grid container spacing={1}>
                    <Grid item lg={12} md={12} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <AccountCircleOutlinedIcon />
                            <span>Thông tin khách hàng</span>
                          </div>

                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container spacing={3} className={classes.gridItemInfo} alignItems="center">
                            <Grid className={classes.gridItemCenter} item lg={12} md={12} xs={12}>
                              <img
                                src={account.image_url}
                                className={classes.imageaccount}
                              />
                            </Grid>
                            <Grid className={classes.gridItemCenter} item lg={12} md={12} xs={12}>
                              <Button
                                variant="contained"
                                style={{ background: 'rgb(97, 42, 255)' }}
                                onClick={handleOpenDiaLog}
                              >
                                Tải lên hình đại diện
                              </Button>
                            </Grid>
                          </Grid>
                          <Grid container spacing={3} className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={6} md={6} xs={12} >
                              <TextField
                                fullWidth
                                autoFocus
                                label="Họ"
                                margin="normal"
                                name="first_name"
                                size="medium"
                                type="text"
                                variant="outlined"
                                onChange={handleChange}
                                value={account.first_name}
                              />
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}>
                              <TextField
                                fullWidth
                                autoFocus
                                label="Tên"
                                margin="normal"
                                name="last_name"
                                size="medium"
                                type="text"
                                variant="outlined"
                                onChange={handleChange}
                                value={account.last_name}
                              />
                            </Grid>
                          </Grid>
                          <Grid container spacing={3} className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={6} md={6} xs={12} >
                              <TextField
                                fullWidth
                                autoFocus
                                label="Email"
                                margin="normal"
                                name="email_address"
                                size="medium"
                                type="email"
                                variant="outlined"
                                onChange={handleChange}
                                value={account.email_address}
                              />
                            </Grid>
                            <Grid item lg={6} md={6} xs={6}>
                              <TextField
                                fullWidth
                                autoFocus
                                label="Ngành nghề"
                                margin="normal"
                                name="job_title"
                                size="medium"
                                type="text"
                                variant="outlined"
                                onChange={handleChange}
                                value={account.job_title}
                              />
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </TabPanel>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid container justify="space-between">
              <Grid item>
                <Button
                  variant="contained"
                  style={{ background: 'rgb(70, 81, 105)', }}
                  onClick={() => handleCloseDialog()}
                >
                  Đóng
                </Button>
              </Grid>
              {buttonSave && (
                <Grid item>
                  <Button
                    variant="contained"
                    style={{ background: 'rgb(97, 42, 255)' }}
                    onClick={() => handleUpdateAccount()}
                  >
                    {buttonSave.text}
                  </Button>
                </Grid>
              )}
              {!buttonSave && (
                <Grid item>
                  <Button
                    variant="contained"
                    style={{ background: 'rgb(97, 42, 255)' }}
                    onClick={() => handleUpdateAccount()}
                  >
                    Lưu
                  </Button>
                </Grid>
              )}
            </Grid>
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  );
};

export default AccountModal;
