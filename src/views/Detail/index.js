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
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import RemoveRedEyeTwoToneIcon from '@material-ui/icons/RemoveRedEyeTwoTone';
import PeopleAltTwoToneIcon from '@material-ui/icons/PeopleAltTwoTone';
import DescriptionTwoToneIcon from '@material-ui/icons/DescriptionTwoTone';
import AssignmentReturnedTwoToneIcon from '@material-ui/icons/AssignmentReturnedTwoTone';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import StarIcon from '@material-ui/icons/Star';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { gridSpacing, view } from '../../store/constant.js';
import { FLOATING_MENU_CHANGE } from '../../store/actions.js';
import useView from './../../hooks/useView';
import useBooking from './../../hooks/useBooking';
import ConfirmSaveDialog from './ConfirmSaveDialog';
import EditModal from './EditModal';
import { style } from './style';
import useStyles from './classes'

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

const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const labelDay = {
  Monday: 'Thứ 2',
  Tuesday: 'Thứ 3',
  Wednesday: 'Thứ 4',
  Thursday: 'Thứ 5',
  Friday: 'Thứ 6',
  Saturday: 'Thứ 7',
  Sunday: 'Chủ nhật',
};

const DetailDocumentDialog = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [editProfile, setEditProfile] = useState(null);
  const [editMentor, setEditMentor] = useState(null);

  const [tabIndex, setTabIndex] = React.useState(0);
  const [isOpenConfirmSaveDialog, setIsOpenConfirmSaveDialog] = React.useState(false);
  const initNoteSelectionList = {
    1: {
      id: 1,
      label: 'Khách quen'
    },
    2: {
      id: 2,
      label: 'Phụ huynh tham gia'
    },
    3: {
      id: 3,
      label: 'Tư vấn nhóm'
    },
    4: {
      id: 4,
      label: 'Khách VIP'
    },
    5: {
      id: 5,
      label: 'Khách mời đặc biệt'
    }
  }
  const [noteSelectionList, setNoteSelectionList] = useState(initNoteSelectionList);
  const [selectedNote, setSelectedNote] = useState("");
  const [selectedNoteList, setSelectedNoteList] = useState([]);

  const { form_buttons: formButtons, name, tabs, disabled_fields } = useView();

  const tabDisplayOptions = {
    mentee: tabs.includes('mentee'),
    mentor: tabs.includes('mentor'),
    meeting: tabs.includes('meeting'),
    feedback: tabs.includes('feedback'),
  };

  const buttonSaveBooking = formButtons.find((button) => button.name === view.booking.detail.save);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const { updateBooking, getMentorDetail, getFeedback } = useBooking();

  const { detailDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { projects } = useSelector((state) => state.project);
  const { selectedDocument } = useSelector((state) => state.document);
  const [enableSaveButton, setEnableSaveButton] = React.useState(false);
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
    }
  }, [selectedDocument]);

  const getFeedbackDetail = async (id) => {
    const data = await getFeedback(id);
    setFeedback({ ...feedback, ...data });
  };

  const getConsultantDetail = async (id) => {
    const cons = await getMentorDetail(id);
    setMentor({ ...mentor, ...cons });
  };

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: false });
  };

  const handleSaveBooking = async (is_send_email) => {
    try {
      const { email_address, number_phone, ...rest } = document;
      await updateBooking({
        ...rest,
        is_send_email,
        outputtype: 'RawJson',
        email: email_address,
        phone: number_phone,
      });
    } catch (error) {
      console.log('error update booking', error)
    } finally {
      setIsOpenConfirmSaveDialog(false);
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value || document.email_address;
    setEnableSaveButton(newEmail !== selectedDocument.email_address);
    setDocument({ ...document, email_address: newEmail });
  };

  const handleChangeNoteSelection = (e) => {
    setSelectedNoteList([...selectedNoteList, e.target.value]);
    const newSelectionList = JSON.parse(JSON.stringify(noteSelectionList));
    delete newSelectionList[e.target.value];
    setNoteSelectionList(newSelectionList);
    setSelectedNote("");
  }

  const handleRemoveSelectedNote = (id) => {
    const newSelectedNoteList = selectedNoteList.filter(item => item !== id);
    setSelectedNoteList(newSelectedNoteList);
    setNoteSelectionList({ ...noteSelectionList, [id]: initNoteSelectionList[id] })
  }

  const setDocumentToDefault = async () => {
    setTabIndex(0);
    setMentor({});
  };

  const convertDateTime = (date, time) => {
    if (!date && !time) return { date: '', time: '' };
    const hour = time.split('-');
    return { date: labelDay[date], time: hour[0] + 'h - ' + hour[1] + 'h' };
  };

  const getDayOfWeek = (date) => {
    if (!date) return '';
    const dateArr = date.split('/');
    const newDate = new Date(dateArr[2], dateArr[1], dateArr[0]);
    return labelDay[weekday[newDate.getDay()]];
  }

  const handleCloseEditModal = () => {
    setEditProfile(null);
    setEditMentor(null);
  }

  const handleClickEditButton = (type) => {
    if (type === 'profile') {
      setEditProfile(document);
      setEditMentor(null);
    } else if (type === 'mentor') {
      setEditProfile(null);
      setEditMentor(mentor);
    }
  }

  const handleSaveEdit = async (data) => {
    try {
      if (editProfile) {
        await updateBooking({
          ...document,
          ...data,
          phone: document.number_phone,
          is_send_email: false,
          outputtype: 'RawJson',
        });
        setDocument({ ...document, email_address: data.email })
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      handleCloseEditModal()
    }
  }

  return (
    <React.Fragment>
      {isOpenConfirmSaveDialog && (
        <ConfirmSaveDialog
          isOpen={isOpenConfirmSaveDialog}
          handleClose={() => setIsOpenConfirmSaveDialog(false)}
          handleSubmit={handleSaveBooking}
        />
      )}
      {(editProfile || editMentor) && (
        <EditModal
          isOpen={editProfile || editMentor}
          profile={editProfile}
          mentor={editMentor}
          handleClose={handleCloseEditModal}
          handleSubmit={handleSaveEdit}
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
            <Grid item xs={12} style={{ textTransform: 'uppercase' }}>
              Chi tiết đăng ký
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
                  <Tab
                    className={classes.unUpperCase}
                    label={
                      <Typography
                        className={classes.tabLabels}
                        component="span"
                        variant="subtitle1"
                      >
                        <DescriptionOutlinedIcon className={`${tabIndex === 1 ? classes.tabActiveIcon : ''}`} />
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
                          <div className={classes.tabItemEdit} onClick={() => handleClickEditButton('profile')}>
                            <EditOutlinedIcon />
                            <span>Chỉnh sửa</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4} >
                              <span className={classes.tabItemLabelField}>Mã đăng ký:</span>
                            </Grid>
                            <Grid item lg={8} md={8} xs={8}>
                              {document?.code}
                            </Grid>
                          </Grid>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4} >
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
                          <Grid container className={classes.gridItemInfo} alignItems="center">
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
                              {document.id}
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
                          <Grid container className={classes.gridItemInfo} alignItems="center">
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
                          <div className={classes.tabItemEdit} onClick={() => handleClickEditButton('mentor')}>
                            <EditOutlinedIcon />
                            <span>Chỉnh sửa</span>
                          </div>
                        </div>
                        <div className={classes.tabItemBody}>
                          <Grid container className={classes.gridItemInfo} alignItems="center">
                            <Grid item lg={4} md={4} xs={4} >
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
                            <img className={classes.tabItemAssessCup} src="https://icons-for-free.com/download-icon-champion+cup+trophy+icon-1320166580183052831_256.png" />
                          </div>
                          <Grid container spacing={gridSpacing} className={classes.tabAssessItemWrap}>
                            <Grid item lg={6} md={6} xs={12} className={classes.tabAssessItem}>
                              <RemoveRedEyeTwoToneIcon style={style.tabAssessItemIconEye} />
                              <div className={classes.tabAssessItemLabel}>
                                <div className={classes.tabAssessItemStarWrap}>
                                  {new Array(5).fill(1).map((star, index) => (
                                    index < feedback.assess_service ?
                                      <StarIcon style={style.tabAssessItemStar} key={index} /> :
                                      <StarBorderOutlinedIcon style={style.tabAssessItemStar} key={index} />
                                  ))}
                                </div>
                                <div>Đánh giá dịch vụ</div>
                              </div>
                            </Grid>
                            <Grid item lg={6} md={6} xs={12} className={classes.tabAssessItem}>
                              <PeopleAltTwoToneIcon style={style.tabAssessItemIconPeople} />
                              <div className={classes.tabAssessItemLabel}>
                                <div className={classes.tabAssessItemStarWrap}>
                                  {new Array(5).fill(1).map((star, index) => (
                                    index < feedback.assess_mentor ?
                                      <StarIcon key={index} style={style.tabAssessItemStar} /> :
                                      <StarBorderOutlinedIcon key={index} style={style.tabAssessItemStar} />
                                  ))}
                                </div>
                                <div>Đánh giá Mentor</div>
                              </div>
                            </Grid>
                            <Grid item lg={6} md={6} xs={12} className={classes.tabAssessItem}>
                              <DescriptionTwoToneIcon style={style.tabAssessItemIconDesc} />
                              <div className={classes.tabAssessItemLabel}>Ý kiến đánh giá:</div>
                            </Grid>
                            <Grid item lg={6} md={6} xs={12} className={classes.tabAssessItem}>
                              <AssignmentReturnedTwoToneIcon style={style.tabAssessItemIconAssignment} />
                              <div className={classes.tabAssessItemLabel}>{feedback.times}</div>
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
                                defaultValue={feedback.comment}
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
                            <div>{getDayOfWeek(document?.schedule?.split(' ')[0])} ngày {document?.schedule?.split(' ')[0]}</div>
                            <div>{document.status}</div>
                          </div>
                          <div className={classes.tabItemNoteHour}>
                            {document?.schedule?.split(' ')[1]}
                          </div>
                          <a href={document?.link_meeting || '#'} target="_blank">
                            <img src="https://play-lh.googleusercontent.com/GBYSf20osBl2CRHbjGOyaOG5kQ3G4xbRau-dzScU9ozuXQJtnUZPkR3IqEDOo5OiVgU" />
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
                              <CloseOutlinedIcon onClick={() => handleRemoveSelectedNote(id)} style={style.selectedItemCloseIcon} />
                            </div>
                          ))}
                        </div>
                        <div className={`${classes.tabItemNoteSelection} ${classes.tabItemNoteInputWrap}`}>
                          <div className={classes.tabItemNoteSelectionLabel}>Ghi chú: </div>
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            rowsMax={4}
                            variant="outlined"
                            name="note"
                            onChange={() => { }}
                            InputLabelProps={{ shrink: true }}
                            className={classes.tabItemNoteInput}
                          />
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
                    onClick={() => setIsOpenConfirmSaveDialog(true)}
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
