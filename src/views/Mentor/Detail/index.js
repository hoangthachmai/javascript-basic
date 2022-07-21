import {
  Switch, Snackbar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Slide, Tab, Tabs, Typography, TextField, MenuItem, Select
} from '@material-ui/core';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import TodayIcon from '@material-ui/icons/Today';
import Alert from '../../../component/Alert'
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useView from '../../../hooks/useView';
import useBooking from '../../../hooks/useBooking';
import useMentor from '../../../hooks/useMentor';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE } from '../../../store/actions.js';
import { view } from '../../../store/constant';
import { userAvatar, initMentorData, genderList } from '../../../store/constants/initial';
import { dateOfWeek, timeWorking, workingType } from '../../../store/constants/time';
import PermissionModal from '../../FloatingMenu/UploadFile/index.js';
import useStyles from './classes.js';
import ScheduleModal from '../ScheduleModal';

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

const MentorModal = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { form_buttons: formButtons } = useView();

  const workingDayButton = formButtons.find((button) => button.name === view.mentor.form.working);
  const leaveButton = formButtons.find((button) => button.name === view.mentor.form.leave);
  const saveButton = formButtons.find((button) => button.name === view.mentor.form.save);


  const [tabIndex, setTabIndex] = React.useState(0);
  const [openDialogUploadImage, setOpenDiaLogUploadImage] = React.useState(false);
  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const { getCareerDemandList } = useBooking();

  const { createMentor, updateMentor } = useMentor();

  const [scheduleModal, setScheduleModal] = useState({
    isOpen: false,
    type: ''
  });
  const [snackbarStatus, setSnackbarStatus] = useState({
    isOpen: false,
    type: '',
    text: '',
  })
  const [careerDemandList, setCareerDemandList] = useState({
    career: [],
    demand: []
  });
  const [mentorData, setMentorData] = useState(initMentorData)

  const { mentorDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);

  const handleCloseDialog = () => {
    setMentorData(initMentorData);
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, mentorDocument: false });
    dispatch({ type: DOCUMENT_CHANGE, selectedDocument: null, documentType: 'mentor' });
  };

  const handleOpenSnackbar = (isOpen, type, text) => {
    setSnackbarStatus({
      isOpen: isOpen,
      type: type,
      text: text
    })
  }

  const setDocumentToDefault = async () => {
    setTabIndex(0);
  };
  const setURL = (image) => {
    setMentorData({ ...mentorData, image_url: image });
  };

  const handleOpenDiaLog = () => {
    setOpenDiaLogUploadImage(true);
  }
  const handleCloseDiaLog = () => {
    setOpenDiaLogUploadImage(false);
  }

  const getAndSetCareerAndDemandList = async () => {
    const result = await getCareerDemandList();
    setCareerDemandList({
      career: result.career,
      demand: result.demand
    })
  }

  const handleChangeMentor = (event) => {
    const { target: { name, value } } = event;
    if (name === 'advise') {
      setMentorData({ ...mentorData, advise: typeof value === 'string' ? value.split(',') : value });
      return;
    }
    setMentorData({ ...mentorData, [name]: value });
  }

  const handleSubmitForm = async () => {
    try {
      if (selectedDocument?.id) {
        await updateMentor(mentorData);
        handleOpenSnackbar(true, 'success', 'Cập nhật Mentor thành công!')
      } else {
        await createMentor(mentorData);
        handleOpenSnackbar(true, 'success', 'Tạo mới Mentor thành công!')
      }
      handleCloseDialog();
    } catch (error) {
      handleOpenSnackbar(true, 'error', 'Có lỗi xảy ra, vui lòng thử lại sau!')
    }
  }

  const handleSubmitWorkingDay = async (data) => {
    try {
      if (selectedDocument?.id) {
        await updateMentor(data);
        handleOpenSnackbar(true, 'success', 'Cập nhật lịch làm việc thành công!')
      }
      setMentorData({ ...mentorData, ...data });
    } catch (error) {
      handleOpenSnackbar(true, 'error', 'Có lỗi xảy ra, vui lòng thử lại sau!')
    }
  }

  const handleSubmitSchedule = async (data) => {
    if (scheduleModal.type === 'working') {
      await handleSubmitWorkingDay(data);
    } else {
      console.log('data', data);
    }

    setScheduleModal({ isOpen: false, type: '' })
  }

  useEffect(() => {
    if (!selectedDocument) return;
    setMentorData({
      ...mentorData,
      ...selectedDocument,
      phone: selectedDocument?.number_phone || '',
      image_url: selectedDocument?.image_url || userAvatar,
      linkedIn_url: selectedDocument?.linkedin_url || ''
    });
    getAndSetCareerAndDemandList()
  }, [selectedDocument]);

  return (
    <React.Fragment>
      {scheduleModal.isOpen && (
        <ScheduleModal
          isOpen={scheduleModal.isOpen}
          type={scheduleModal.type}
          handleClose={() => setScheduleModal({ isOpen: false, type: '' })}
          mentor={mentorData}
          submit={handleSubmitSchedule}
        />
      )}
      {snackbarStatus.isOpen && (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={snackbarStatus.isOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarStatus({ ...snackbarStatus, isOpen: false })}>
          <Alert onClose={() => setSnackbarStatus({ ...snackbarStatus, isOpen: false })} severity={snackbarStatus.type} sx={{ width: '100%' }}>
            {snackbarStatus.text}
          </Alert>
        </Snackbar>
      )}
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
              Chi tiết Mentor
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
                        Chi tiết Mentor
                      </Typography>
                    }
                    value={0}
                    {...a11yProps(0)}
                  />
                  <Tab
                    className={classes.unUpperCase}
                    label={
                      <Typography
                        className={classes.tabLabels}
                        component="span"
                        variant="subtitle1"
                      >
                        <TodayIcon className={`${tabIndex === 1 ? classes.tabActiveIcon : ''}`} />
                        Lịch làm việc
                      </Typography>
                    }
                    value={1}
                    {...a11yProps(1)}
                  />
                  <Tab
                    className={classes.unUpperCase}
                    label={
                      <Typography
                        className={classes.tabLabels}
                        component="span"
                        variant="subtitle1"
                      >
                        <DescriptionOutlinedIcon className={`${tabIndex === 2 ? classes.tabActiveIcon : ''}`} />
                        Lịch sử thay đổi
                      </Typography>
                    }
                    value={2}
                    {...a11yProps(2)}
                  />

                </Tabs>
              </Grid>
              <Grid item xs={12}>
                <TabPanel value={tabIndex} index={0}>
                  <Grid container spacing={1}>
                    <Grid item lg={6} md={6} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <span>Ảnh đại diện</span>
                          </div>
                        </div>
                        <div className={`${classes.tabItemBody} ${classes.tabItemMentorAvatarBody}`}>
                          <img src={mentorData.image_url} alt="image_url" />
                          <div>Upload/Change Mentor's Profile Image</div>
                          <Button onClick={handleOpenDiaLog}>Chọn hình đại diện</Button>
                        </div>
                      </div>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <AccountCircleOutlinedIcon />
                            <span>Thông tin tư vấn</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4} >
                              <span className={classes.tabItemLabelField}>Ngành tư vấn:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <Select
                                name="career"
                                labelId="career-label"
                                id="career-name"
                                className={classes.multpleSelectField}
                                value={mentorData.career}
                                onChange={handleChangeMentor}
                              >
                                {careerDemandList?.career?.map((item) => (
                                  <MenuItem
                                    key={item}
                                    value={item}
                                  >
                                    {item}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Năm kinh nghiệm:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                rows={1}
                                rowsMax={1}
                                variant="outlined"
                                name="experience"
                                value={mentorData?.experience}
                                className={classes.inputField}
                                onChange={handleChangeMentor}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Lĩnh vực tư vấn:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <Select
                                name="advise"
                                labelId="advise-label-1"
                                id="advise-name-1"
                                multiple
                                className={classes.multpleSelectField}
                                value={mentorData.advise}
                                onChange={handleChangeMentor}
                              >
                                {careerDemandList.demand?.map((item) => (
                                  <MenuItem
                                    key={item}
                                    value={item}
                                  >
                                    {item}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <AccountCircleOutlinedIcon />
                            <span>Thông tin cá nhân</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4} >
                              <span className={classes.tabItemLabelField}>Họ và tên:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                rows={1}
                                rowsMax={1}
                                variant="outlined"
                                name="fullname"
                                value={mentorData.fullname}
                                className={classes.inputField}
                                onChange={handleChangeMentor}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4} >
                              <span className={classes.tabItemLabelField}>Title:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                multiline
                                rows={1}
                                rowsMax={2}
                                variant="outlined"
                                name="title"
                                value={mentorData?.title}
                                className={classes.multilineInputField}
                                onChange={handleChangeMentor}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Email:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                rows={1}
                                rowsMax={1}
                                variant="outlined"
                                name="email_address"
                                value={mentorData.email_address}
                                className={classes.inputField}
                                onChange={handleChangeMentor}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>SĐT:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                rows={1}
                                rowsMax={1}
                                variant="outlined"
                                name="phone"
                                value={mentorData.phone}
                                className={classes.inputField}
                                onChange={handleChangeMentor}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4} >
                              <span className={classes.tabItemLabelField}>Giới tính:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <Select
                                name="gender"
                                labelId="gender-label"
                                id="gender-name"
                                className={classes.multpleSelectField}
                                value={mentorData.gender}
                                onChange={handleChangeMentor}
                              >
                                {genderList?.map((item) => (
                                  <MenuItem
                                    key={item}
                                    value={item}
                                  >
                                    {item}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Link Facebook:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                rows={1}
                                rowsMax={1}
                                variant="outlined"
                                name="fb_url"
                                value={mentorData?.fb_url}
                                className={classes.inputField}
                                onChange={handleChangeMentor}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Link LinkedIn:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                rows={1}
                                rowsMax={1}
                                variant="outlined"
                                name="linkedIn_url"
                                value={mentorData?.linkedIn_url}
                                className={classes.inputField}
                                onChange={handleChangeMentor}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Địa chỉ:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                rows={1}
                                rowsMax={1}
                                variant="outlined"
                                name="short_address"
                                value={mentorData?.short_address}
                                className={classes.inputField}
                                onChange={handleChangeMentor}
                              />
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Cựu học sinh trường:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                fullWidth
                                rows={1}
                                rowsMax={1}
                                variant="outlined"
                                name="alumnus"
                                value={mentorData?.alumnus}
                                className={classes.inputField}
                                onChange={handleChangeMentor}
                              />
                            </Grid>
                          </Grid>
                        </div>
                      </div>

                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                  <Grid container spacing={1}>
                    <Grid item lg={6} md={6} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <TodayIcon />
                            <span>Lịch làm việc</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          {mentorData?.workday?.map(workingDay => (
                            <Grid spacing={1} container className={classes.gridItemInfo} alignItems="center">
                              <Grid item lg={3} md={3} xs={12}>
                                <Select
                                  disabled={true}
                                  name="day"
                                  labelId="date-label"
                                  className={classes.multpleSelectField}
                                  defaultValue={workingDay.day}
                                >
                                  {dateOfWeek?.map((item) => (
                                    <MenuItem
                                      key={item.value}
                                      value={item.value}
                                    >
                                      {item.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </Grid>
                              <Grid item lg={3} md={3} xs={12}>
                                <Select
                                  disabled={true}
                                  name="hour"
                                  labelId="time1-label"
                                  className={classes.multpleSelectField}
                                  defaultValue={workingDay.hour}
                                >
                                  {timeWorking?.map((item) => (
                                    <MenuItem
                                      key={item.value}
                                      value={item.value}
                                    >
                                      {item.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </Grid>
                              <Grid item lg={4} md={4} xs={12}>
                                <Select
                                  disabled={true}
                                  name="type"
                                  labelId="time1-label"
                                  className={classes.multpleSelectField}
                                  defaultValue={workingDay.type}
                                >
                                  {workingType?.map((item) => (
                                    <MenuItem
                                      key={item.value}
                                      value={item.value}
                                    >
                                      {item.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </Grid>
                              <Grid item lg={2} md={2} xs={12}>
                                <Switch
                                  color="primary"
                                  disabled={true}
                                  name="is_active"
                                  checked={!!workingDay.is_active}
                                  inputProps={{ 'aria-label': 'controlled' }}
                                />
                              </Grid>
                            </Grid>
                          ))}
                        </div>
                      </div>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <TodayIcon />
                            <span>Lịch nghỉ phép</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid spacing={1} container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Ngày bắt đầu:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                disabled={true}
                                id="datetime-local"
                                type="datetime-local"
                                name="vacation_start"
                                value={mentorData?.vacation_start}
                                className={classes.inputField}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            </Grid>
                          </Grid>
                          <Grid spacing={1} container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Ngày kết thúc:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              <TextField
                                disabled={true}
                                id="datetime-local"
                                type="datetime-local"
                                name="vacation_end"
                                value={mentorData?.vacation_end}
                                className={classes.inputField}
                                InputLabelProps={{
                                  shrink: true,
                                }}
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
              <Grid item className={classes.gridItemInfoButtonWrap}>
                {workingDayButton && (
                  <Button
                    className={classes.gridItemInfoButton}
                    onClick={() => setScheduleModal({ isOpen: true, type: 'working' })}
                  >
                    {workingDayButton.text}
                  </Button>
                )}
                {(leaveButton && selectedDocument?.id) && (
                  <Button
                    className={classes.gridItemInfoButton}
                    onClick={() => setScheduleModal({ isOpen: true, type: 'vacation' })}
                  >
                    {leaveButton.text}
                  </Button>
                )}
                {saveButton && (
                  <Button
                    variant="contained"
                    style={{ background: 'rgb(97, 42, 255)' }}
                    onClick={handleSubmitForm}
                  >
                    {saveButton.text}
                  </Button>
                )}
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  );
};

export default MentorModal;
