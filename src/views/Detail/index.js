import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Slide,
  Tab,
  Tabs,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import AssignmentReturnedTwoToneIcon from '@material-ui/icons/AssignmentReturnedTwoTone';
import ClearIcon from '@material-ui/icons/Clear';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import DescriptionTwoToneIcon from '@material-ui/icons/DescriptionTwoTone';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import PeopleAltTwoToneIcon from '@material-ui/icons/PeopleAltTwoTone';
import RemoveRedEyeTwoToneIcon from '@material-ui/icons/RemoveRedEyeTwoTone';
import StarIcon from '@material-ui/icons/Star';
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import CheckIcon from '@material-ui/icons/Check';
import PropTypes from 'prop-types';
import { gridSpacing, view } from '../../store/constant.js';
import useBooking from './../../hooks/useBooking';
import useView from './../../hooks/useView';
import { format as formatDate } from 'date-fns';
import EditModal from './EditModal';
import { style } from './style';
import useStyles from './classes';
import { withStyles } from '@material-ui/core/styles';
import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE, TASK_CHANGE } from '../../store/actions';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Avatar from './../../component/Avatar/index';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

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

const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const labelDay = {
  Monday: 'Thứ 2',
  Tuesday: 'Thứ 3',
  Wednesday: 'Thứ 4',
  Thursday: 'Thứ 5',
  Friday: 'Thứ 6',
  Saturday: 'Thứ 7',
  Sunday: 'Chủ nhật',
};

const StyledTableCell = withStyles((theme) => ({
  root: {
    '&:not(:first-child)': {
      padding: '16px 2px'
    },
    '&:first-child': {
      padding: '16px 2px 16px 20px'
    }
  },
}))(TableCell);

const DetailDocumentDialog = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    type: 'success',
    text: '',
  });
  const [editProfile, setEditProfile] = useState(null);
  const [editMentor, setEditMentor] = useState(null);

  const [tabIndex, setTabIndex] = React.useState(0);
  const initNoteSelectionList = {
    1: {
      id: 1,
      label: 'Khách quen',
    },
    2: {
      id: 2,
      label: 'Phụ huynh tham gia',
    },
    3: {
      id: 3,
      label: 'Tư vấn nhóm',
    },
    4: {
      id: 4,
      label: 'Khách VIP',
    },
    5: {
      id: 5,
      label: 'Khách mời đặc biệt',
    },
  };
  const [noteSelectionList, setNoteSelectionList] = useState(initNoteSelectionList);
  const [selectedNote, setSelectedNote] = useState('');
  const [selectedNoteList, setSelectedNoteList] = useState([]);

  const { form_buttons: formButtons, tabs } = useView();

  const tabDisplayOptions = {
    mentee: tabs.includes('mentee'),
    mentor: tabs.includes('mentor'),
    meeting: tabs.includes('meeting'),
    feedback: tabs.includes('feedback'),
  };

  const buttonSaveBooking = formButtons.find((button) => button.name === view.booking.detail.save);

  const handleChangeTab = (event, newValue) => {
    if (newValue === 1) {
      getLogDetail(selectedDocument.id);
    }
    setTabIndex(newValue);
  };

  const {
    updateBooking,
    getMentorDetail,
    getFeedback,
    updateBookingMentor,
    getBookingDetail,
    setNoteBooking,
    getLog,
  } = useBooking();

  const { detailDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { selectedDocument } = useSelector((state) => state.document);
  const [document, setDocument] = React.useState({
    fullname: '',
    contact: '',
    email_address: '',
    consultant_id: '',
  });
  const [mentor, setMentor] = React.useState({
    fullname: '',
    number_phone: '',
    email_address: '',
    date1: '',
    date2: '',
    time1: '',
    time2: '',
  });
  const [feedback, setFeedback] = React.useState({
    times: '',
    comment: '',
    assess_mentor: 0,
    assess_service: 0,
  });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!selectedDocument) return;
    setDocument({
      ...document,
      ...selectedDocument,
      category_id: selectedDocument.category_id ? selectedDocument.category_id : '',
    });
    getConsultantDetail(selectedDocument.mentor_id);
    if (tabDisplayOptions.feedback) {
      getFeedbackDetail(selectedDocument.id);
    } else {
      setFeedback({
        times: '',
        comment: '',
        assess_mentor: 0,
        assess_service: 0,
      });
    }
  }, [selectedDocument]);

  const getFeedbackDetail = async (id) => {
    const data = await getFeedback(id);
    if (data?.times) setFeedback({ ...data });
    else
      setFeedback({
        times: '',
        comment: '',
        assess_mentor: 0,
        assess_service: 0,
      });
  };

  const getConsultantDetail = async (id) => {
    const cons = await getMentorDetail(id);
    setMentor({ ...mentor, ...cons });
  };

  const getLogDetail = async (id) => {
    const list = await getLog(id);
    if (list.length > 0) setLogs(list);
    else setLogs([]);
  };

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: false });
  };

  const handleSaveBooking = async () => {
    try {
      const { id, note } = document;
      await setNoteBooking(id, note);
    } catch (error) {
      console.log('error update booking', error);
    }
  };

  const handleChangeNoteSelection = (e) => {
    setSelectedNoteList([...selectedNoteList, e.target.value]);
    const newSelectionList = JSON.parse(JSON.stringify(noteSelectionList));
    delete newSelectionList[e.target.value];
    setNoteSelectionList(newSelectionList);
    setSelectedNote('');
  };

  const handleRemoveSelectedNote = (id) => {
    const newSelectedNoteList = selectedNoteList.filter((item) => item !== id);
    setSelectedNoteList(newSelectedNoteList);
    setNoteSelectionList({ ...noteSelectionList, [id]: initNoteSelectionList[id] });
  };

  const setDocumentToDefault = async () => {
    setTabIndex(0);
    setMentor({});
  };

  const getDayOfWeek = (date) => {
    if (!date) return '';
    const dateArr = date.split('/');
    const newDate = new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
    return labelDay[weekday[newDate.getDay()]];
  };

  const handleCloseEditModal = () => {
    setEditProfile(null);
    setEditMentor(null);
  };

  const handleClickEditButton = (type) => {
    if (type === 'profile') {
      setEditProfile(document);
      setEditMentor(null);
    } else if (type === 'mentor') {
      setEditProfile(null);
      setEditMentor(mentor);
    }
  };

  const handleSaveEdit = async (data, is_send_email = false) => {
    try {
      if (editProfile) {
        await updateBooking({
          ...document,
          ...data,
          is_send_email,
          outputtype: 'RawJson',
        });
        if (is_send_email) {
          setIsOpenSnackbar(true);
          setSnackbarData({
            type: 'success',
            text: 'Hệ thống sẽ tự động gửi mail xác nhận tới địa chỉ email mới!',
          });
        }
      } else if (editMentor) {
        const isSuccess = await updateBookingMentor(document.id, data);
        if (!isSuccess) {
          setIsOpenSnackbar(true);
          setSnackbarData({
            type: 'warning',
            text: 'Bạn không thể thay đổi Mentor ngay lúc này!',
          });
          return;
        }
        setIsOpenSnackbar(true);
        setSnackbarData({
          type: 'success',
          text: 'Thay đổi Mentor thành công!',
        });
        // await getConsultantDetail(data.mentor_id);
      }
      const detailDocument = await getBookingDetail(document.id);
      dispatch({
        type: DOCUMENT_CHANGE,
        selectedDocument: detailDocument,
        documentType: 'booking',
      });
      dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: true });
    } catch (error) {
      setIsOpenSnackbar(true);
      setSnackbarData({
        type: 'error',
        text: 'Có lỗi xảy ra, vui lòng thử lại sau!',
      });
    } finally {
      handleCloseEditModal();
    }
  };

  const handleEditModalGoBack = (to) => {
    if (to === 'profile') {
      setEditProfile(document);
      setEditMentor(null);
    }
  };

  const handleChangeNote = (e) => {
    setDocument({ ...document, note: e.target.value });
  };

  return (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={isOpenSnackbar}
        autoHideDuration={3000}
        onClose={() => setIsOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setIsOpenSnackbar(false)}
          severity={snackbarData.type}
          sx={{ width: '100%' }}
        >
          {snackbarData.text}
        </Alert>
      </Snackbar>
      {(editProfile || editMentor) && (
        <EditModal
          isOpen={!!editProfile || !!editMentor}
          profile={editProfile}
          mentor={editMentor}
          document={document}
          handleClose={handleCloseEditModal}
          handleSubmit={handleSaveEdit}
          handleGoBack={handleEditModalGoBack}
        />
      )}
      <Grid container>
        <Dialog
          open={openDialog || false}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDialog}
          className={classes.useradddialog}
        >
          <DialogTitle className={classes.dialogTitle}>
            <Grid container>
              <Grid item xs={11} style={{ textTransform: 'uppercase' }}>
                Chi tiết đăng ký
              </Grid>
              <Grid item xs={1}>
                <Button className={classes.buttonClose} onClick={handleCloseDialog}>
                  <ClearIcon className={classes.buttonCloseIcon} />
                </Button>
              </Grid>
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
                        <AccountCircleOutlinedIcon
                          className={`${tabIndex === 0 ? classes.tabActiveIcon : ''}`}
                        />
                        Chi tiết đăng ký
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
                        <DescriptionOutlinedIcon
                          className={`${tabIndex === 1 ? classes.tabActiveIcon : ''}`}
                        />
                        Lịch sử thay đổi
                      </Typography>
                    }
                    value={1}
                    {...a11yProps(1)}
                  />
                </Tabs>
              </Grid>
              <Grid item xs={12}>
                <TabPanel value={tabIndex} index={0}>
                  <Grid container spacing={1}>
                    <Grid item lg={4} md={4} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <AccountCircleOutlinedIcon />
                            <span>Thông tin khách hàng</span>
                          </div>
                          <div
                            className={classes.tabItemEdit}
                            onClick={() => handleClickEditButton('profile')}
                          >
                            <EditOutlinedIcon />
                            <span>Chỉnh sửa</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Mã đăng ký:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              {document?.id}
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Họ và tên:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              {document.fullname}
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Email:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              {document.email_address}
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>SĐT:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              {document.number_phone}
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Trình độ học vấn:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              {document.education}
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Điểm mạnh:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              {document.strength}
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Điểm yếu:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              {document.weakness}
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Ngành nghề:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              {document.career}
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo}>
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Nhu cầu tư vấn:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              {document.demand}
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Mã tư vấn:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              {document.code}
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Trường:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              {document.university_name}
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            className={classes.gridItemInfo}
                            style={{ paddingBottom: '0' }}
                            alignItems="center"
                          >
                            <Grid item lg={12} md={12} xs={12}>
                              <span className={classes.tabItemLabelField}>Câu hỏi cho mentor:</span>
                            </Grid>
                            <Grid item lg={12} md={12} xs={12}>
                              <TextField
                                disabled
                                fullWidth
                                multiline
                                rows={3}
                                rowsMax={3}
                                variant="outlined"
                                name="note"
                                InputLabelProps={{ shrink: true }}
                                className={classes.tabItemNoteInput}
                                defaultValue={document.question}
                              />
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </Grid>
                    <Grid item lg={4} md={4} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemTitle}>
                          <div className={classes.tabItemLabel}>
                            <AccountCircleOutlinedIcon />
                            <span>Thông tin Mentor</span>
                          </div>
                          <div
                            className={classes.tabItemEdit}
                            onClick={() => handleClickEditButton('mentor')}
                          >
                            <EditOutlinedIcon />
                            <span>Chỉnh sửa</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Họ và tên:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              {mentor?.fullname}
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Email:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              {mentor.email_address}
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>SĐT:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              {mentor.number_phone}
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4}>
                              <span className={classes.tabItemLabelField}>Nghề nghiệp:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              {mentor.career}
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemAssessSection}>
                          <div className={classes.tabItemAssessTitle}>
                            Đánh giá
                            <img
                              className={classes.tabItemAssessCup}
                              src="https://icons-for-free.com/download-icon-champion+cup+trophy+icon-1320166580183052831_256.png"
                            />
                          </div>
                          <Grid
                            container
                            spacing={gridSpacing}
                            className={classes.tabAssessItemWrap}
                          >
                            <Grid item lg={6} md={6} xs={12} className={classes.tabAssessItem}>
                              <RemoveRedEyeTwoToneIcon style={style.tabAssessItemIconEye} />
                              <div className={classes.tabAssessItemLabel}>
                                <div className={classes.tabAssessItemStarWrap}>
                                  {new Array(5)
                                    .fill(1)
                                    .map((star, index) =>
                                      index < feedback.assess_service ? (
                                        <StarIcon style={style.tabAssessItemStar} key={index} />
                                      ) : (
                                        <StarBorderOutlinedIcon
                                          style={style.tabAssessItemStar}
                                          key={index}
                                        />
                                      )
                                    )}
                                </div>
                                <div>Đánh giá dịch vụ</div>
                              </div>
                            </Grid>
                            <Grid item lg={6} md={6} xs={12} className={classes.tabAssessItem}>
                              <PeopleAltTwoToneIcon style={style.tabAssessItemIconPeople} />
                              <div className={classes.tabAssessItemLabel}>
                                <div className={classes.tabAssessItemStarWrap}>
                                  {new Array(5)
                                    .fill(1)
                                    .map((star, index) =>
                                      index < feedback.assess_mentor ? (
                                        <StarIcon key={index} style={style.tabAssessItemStar} />
                                      ) : (
                                        <StarBorderOutlinedIcon
                                          key={index}
                                          style={style.tabAssessItemStar}
                                        />
                                      )
                                    )}
                                </div>
                                <div>Đánh giá Mentor</div>
                              </div>
                            </Grid>
                            <Grid item lg={6} md={6} xs={12} className={classes.tabAssessItem}>
                              <DescriptionTwoToneIcon style={style.tabAssessItemIconDesc} />
                              <div className={classes.tabAssessItemLabel}>Ý kiến đánh giá:</div>
                            </Grid>
                            <Grid item lg={6} md={6} xs={12} className={classes.tabAssessItem}>
                              <AssignmentReturnedTwoToneIcon
                                style={style.tabAssessItemIconAssignment}
                              />
                              <div className={classes.tabAssessItemLabel}>{feedback?.times}</div>
                            </Grid>
                            <Grid item lg={12} md={12} xs={12}>
                              <TextField
                                disabled
                                fullWidth
                                multiline
                                rows={4}
                                rowsMax={4}
                                variant="outlined"
                                name="note"
                                InputLabelProps={{ shrink: true }}
                                className={classes.tabItemNoteInput}
                                defaultValue={feedback?.comment}
                              />
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </Grid>
                    <Grid item lg={4} md={4} xs={12}>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemNoteSection}>
                          <div className={classes.tabItemNoteTitleWrap}>
                            <div>
                              {getDayOfWeek(document?.schedule?.split(' ')[0])} ngày{' '}
                              {document?.schedule?.split(' ')[0]} -{' '}
                              {document?.schedule?.split(' ')[1]}
                            </div>
                            <div>{document.status}</div>
                          </div>

                          <a href={document?.link_meeting || '#'} target="_blank">
                            <img src="https://play-lh.googleusercontent.com/GBYSf20osBl2CRHbjGOyaOG5kQ3G4xbRau-dzScU9ozuXQJtnUZPkR3IqEDOo5OiVgU" />
                            <div>Tham gia meeting</div>
                          </a>
                        </div>
                      </div>
                      <div className={classes.tabItem}>
                        <div className={classes.tabItemNoteSelection}>
                          <div className={classes.tabItemNoteSelectionLabel}>Lưu ý: </div>
                          <FormControl fullWidth>
                            <Select
                              id="note_id"
                              onChange={handleChangeNoteSelection}
                              displayEmpty
                              name="note"
                              value={selectedNote}
                            >
                              {Object.values(noteSelectionList)?.map((note, index) => (
                                <MenuItem key={index} value={note.id}>
                                  {note.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                        <div className={classes.selectedNoteListSection}>
                          {selectedNoteList.map((id) => (
                            <div key={id} className={classes.selectedNoteItem}>
                              <div>{initNoteSelectionList[id].label}</div>
                              <CloseOutlinedIcon
                                onClick={() => handleRemoveSelectedNote(id)}
                                style={style.selectedItemCloseIcon}
                              />
                            </div>
                          ))}
                        </div>
                        <div
                          className={`${classes.tabItemNoteSelection} ${classes.tabItemNoteInputWrap}`}
                        >
                          <div className={classes.tabItemNoteSelectionLabel}>Ghi chú: </div>
                          <TableContainer component={Paper} className={classes.tableNote}>
                            <Table stickyHeader aria-label="sticky table">
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell>Thời gian</StyledTableCell>
                                  <StyledTableCell align="left">Người tạo</StyledTableCell>
                                  <StyledTableCell align="left">Nội dung</StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {document?.notes?.map((row) => (
                                  <TableRow key={row.created_date}>
                                    <StyledTableCell align="left">{formatDate(new Date(row.created_date), 'h:mm aa')}</StyledTableCell>
                                    <StyledTableCell align="left">{row.created_by}</StyledTableCell>
                                    <StyledTableCell align="left">{row.note}</StyledTableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          {/* <TextField
                            fullWidth
                            multiline
                            rows={4}
                            rowsMax={4}
                            value={document.note || ''}
                            variant="outlined"
                            name="note"
                            onChange={handleChangeNote}
                            InputLabelProps={{ shrink: true }}
                            className={classes.tabItemNoteInput}
                          /> */}
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
                            <DescriptionTwoToneIcon />
                            <span>Chi tiết thay đổi</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid
                            container
                            spacing={gridSpacing}
                            alignItems="center"
                            className={classes.projecttablemain}
                          >
                            {logs
                              .slice(0)
                              .reverse()
                              .map((item, i, arr) => (
                                <Grid item xs={12} key={i}>
                                  <Grid container spacing={2}>
                                    <Grid item>
                                      <Avatar
                                        color="primary"
                                        size="small"
                                        className={classes.avatarIcon}
                                      >
                                        <CheckIcon
                                          className={i === 0 ? classes.avatarIcon : classes.dnone}
                                        />
                                      </Avatar>
                                    </Grid>
                                    <Grid item xs zeroMinWidth>
                                      <Grid container spacing={0}>
                                        <Grid item xs={12}>
                                          <Typography align="left" variant="subtitle2">
                                            {formatDate(new Date(item.time), 'dd/MM/yyyy h:mm aa')}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                          <Typography align="left" variant="body1">
                                            {item.action_name}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              ))}
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
                  style={{ background: 'rgb(70, 81, 105)' }}
                  onClick={handleCloseDialog}
                >
                  Đóng
                </Button>
              </Grid>
              {buttonSaveBooking && (
                <Grid item>
                  <Button
                    variant="contained"
                    style={{ background: 'rgb(97, 42, 255)' }}
                    onClick={handleSaveBooking}
                  >
                    {buttonSaveBooking.text}
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

export default DetailDocumentDialog;
