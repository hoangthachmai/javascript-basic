import React, { useEffect } from 'react';
import {
  Grid,
  Button,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  OutlinedInput,
  TextareaAutosize,
  Tabs,
  Box,
  Typography,
  Tab,
  Link,
} from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { gridSpacing, view } from '../../store/constant.js';
import { FLOATING_MENU_CHANGE } from '../../store/actions.js';
import useView from './../../hooks/useView';
import useBooking from './../../hooks/useBooking';
import ConfirmSaveDialog from './ConfirmSaveDialog';

const useStyles = makeStyles((theme) => ({
  useradddialog: {
    '&>div:nth-child(3)': {
      justifyContent: 'flex-end',
      '&>div': {
        margin: '0px',
        borderRadius: '0px',
        minWidth: '900px',
        maxWidth: '900px',
        maxHeight: '100%',
        overflowY: 'hidden',
        [theme.breakpoints.down('md')]: {
          minWidth: '100%',
          maxWidth: '100%',
        },
        [theme.breakpoints.down('xs')]: {
          minWidth: '100%',
          maxWidth: '100%',
        },
      },
    },
  },
  icon: {
    width: '80px',
    height: '80px',
    [theme.breakpoints.down('xs')]: {
      width: '40px',
      height: '40px',
    },
  },
  text: {
    minHeight: '3.2em',
    maxHeight: '3.2em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  folderContainer: {
    margin: '0 10px 20px',
    border: '1px solid gray',
    position: 'relative',
  },
  selectedIcon: {
    width: '35px',
    height: '35px',
    color: '#4295f5',
    position: 'absolute',
    top: '-15px',
    left: '-15px',
  },
  selectedIconNotselected: {
    width: '35px',
    height: '35px',
    color: '#637487',
    position: 'absolute',
    top: '-15px',
    left: '-15px',
  },
  description: {
    border: '1px rgba(0, 0, 0, 0.23) solid',
    borderRadius: '4px',
    padding: '10px',
  },
  formControl: {
    margin: theme.spacing(1),
    marginLeft: 0,
    width: '100%',
  },
  presentImage: {
    height: '80px',
    width: '110px',
  },
  button: {
    margin: theme.spacing(0.5, 0),
    background: '##FFC000',
  },
  listSelectedNews: {
    minHeight: '300px',
    maxHeight: '600px',
  },
  imageNotice: {
    margin: theme.spacing(0, 0),
  },
  tableTitle: {
    textAlign: 'center!important',
    fontSize: '1.25rem',

    marginBottom: '0.5rem',
    marginTop: '0.5rem',
    fontWeight: '500',
    lineHeight: '1.2',
  },
  table: {
    border: '1px solid #dee2e6',
    width: '100%',
    marginBottom: '1rem',
    color: '#212529',
    borderCollapse: 'collapse',
  },
  th: {
    borderBottomWidth: '2px',
    verticalAlign: 'bottom',
    borderBottom: '2px solid #dee2e6',
    border: '1px solid #dee2e6',
    padding: '0.75rem',
    verticalAlign: 'top',
    borderTop: '1px solid #dee2e6',
    textAlign: 'center',
  },
  td: {
    border: '1px solid #dee2e6',
    padding: '0.75rem',
    verticalAlign: 'top',
    borderTop: '1px solid #dee2e6',
    textAlign: 'center',
  },
  pb: {
    paddingBottom: '12px',
  },
  pl: {
    paddingLeft: '12px',
  },
  pr: {
    paddingRight: '12px',
  },
  feedbackAssess: {
    display: 'flex',
    alignItems: 'center',
    '& > div:first-child': {
      marginRight: '12px',
    },
  },
  feedbackStar: {
    transform: 'translateY(1px)',
    color: '#4472C4',
    fontSize: '20px',
  },
  timeNumberInput: {
    minWidth: '52px',
    height: '20px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  fontBold: {
    fontWeight: 'bold',
  },
  feedbackTextInput: {
    width: '100%',
    marginTop: '12px',
  },
}));

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
  const [tabIndex, setTabIndex] = React.useState(0);
  const [isOpenConfirmSaveDialog, setIsOpenConfirmSaveDialog] = React.useState(false);
  const { form_buttons: formButtons, name, tabs, disabled_fields } = useView();

  const dontHaveColumnSettings = !tabs || !tabs.length;
  const tabHeadings = [
    { id: 'mentee', label: 'Thông tin khách hàng' },
    { id: 'mentor', label: 'Thông tin mentor' },
    { id: 'meeting', label: 'Thông tin meeting' },
    { id: 'feedback', label: 'Feedback' },
  ];
  const tabDisplayOptions = {
    mentee: tabs.includes('mentee'),
    mentor: tabs.includes('mentor'),
    meeting: tabs.includes('meeting'),
    feedback: tabs.includes('feedback'),
  };

  const buttonSaveBooking = formButtons.find((button) => button.name === view.booking.detail.save);

  const handleChangeTab = (event, newValue) => {
    // if (newValue !== 0 ) {
    //   getConsultantDetail();
    // }
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
    if (tabDisplayOptions.mentor) {
      getConsultantDetail(selectedDocument.mentor_id);
    }
    if (tabDisplayOptions.feedback) {
      getFeedbackDetail(selectedDocument.id);
    }
  }, [selectedDocument]);

  const getFeedbackDetail = async (id) => {
    const data = await getFeedback(id);
    setFeedback(data);
  };

  const getConsultantDetail = async (id) => {
    const cons = await getMentorDetail(id);
    setMentor(cons);
  };

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: false });
  };

  const handleSaveBooking = async (is_send_email) => {
    const { email_address, number_phone, ...rest } = document;
    setIsOpenConfirmSaveDialog(false);
    await updateBooking({
      ...rest,
      is_send_email,
      outputtype: 'RawJson',
      email: email_address,
      phone: number_phone,
    });
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value || document.email_address;
    setEnableSaveButton(newEmail !== selectedDocument.email_address);
    setDocument({ ...document, email_address: newEmail });
  };

  const setDocumentToDefault = async () => {
    setTabIndex(0);
    setMentor({});
  };

  const convertDateTime = (date, time) => {
    if (!date && !time) return;
    const hour = time.split('-');
    return labelDay[date] + ' ' + hour[0] + 'h-' + hour[1] + 'h';
  };

  return (
    <React.Fragment>
      <ConfirmSaveDialog
        isOpen={isOpenConfirmSaveDialog}
        handleClose={() => setIsOpenConfirmSaveDialog(false)}
        handleSubmit={handleSaveBooking}
      />
      <Grid container>
        <Dialog
          open={openDialog || false}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDialog}
          className={classes.useradddialog}
        >
          <DialogTitle>
            <Grid item xs={12}>
              Chi tiết đăng ký tư vấn
            </Grid>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Tabs
                  value={tabIndex}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={handleChangeTab}
                  aria-label="simple tabs example"
                  variant="scrollable"
                >
                  {tabDisplayOptions.mentee && (
                    <Tab
                      label={
                        <Typography
                          className={classes.capitalize}
                          component="span"
                          variant="subtitle1"
                        >
                          Thông tin khách hàng
                        </Typography>
                      }
                      value={0}
                      {...a11yProps(0)}
                    />
                  )}
                  {tabDisplayOptions.mentor && (
                    <Tab
                      label={
                        <Typography
                          className={classes.capitalize}
                          component="span"
                          variant="subtitle1"
                        >
                          Thông tin mentor
                        </Typography>
                      }
                      value={1}
                      {...a11yProps(1)}
                    />
                  )}
                  {tabDisplayOptions.meeting && (
                    <Tab
                      label={
                        <Typography
                          className={classes.capitalize}
                          component="span"
                          variant="subtitle1"
                        >
                          Thông tin meeting
                        </Typography>
                      }
                      value={2}
                      {...a11yProps(2)}
                    />
                  )}
                  {tabDisplayOptions.feedback && (
                    <Tab
                      label={
                        <Typography
                          className={classes.capitalize}
                          component="span"
                          variant="subtitle1"
                        >
                          Feedback
                        </Typography>
                      }
                      value={3}
                      {...a11yProps(3)}
                    />
                  )}
                </Tabs>
              </Grid>
              <Grid item xs={12}>
                {tabDisplayOptions.mentee && (
                  <TabPanel value={tabIndex} index={0}>
                    <Grid container spacing={gridSpacing} alignItems="center">
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label="Họ và tên"
                          variant="outlined"
                          value={document.fullname}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          variant="outlined"
                          value={document.email_address}
                          onChange={handleEmailChange}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label="Họ và tên"
                          variant="outlined"
                          value={document.number_phone}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label="Trình độ học vấn"
                          variant="outlined"
                          value={document.education}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label="Điểm mạnh"
                          variant="outlined"
                          value={document.strength}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label="Điểm yếu"
                          variant="outlined"
                          value={document.weakness}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label="Ngành nghề"
                          variant="outlined"
                          value={document.career}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label="Nhu cầu tư vấn"
                          variant="outlined"
                          value={document.demand}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          multiline
                          rows={1}
                          disabled
                          fullWidth
                          label="Mã tư vân"
                          variant="outlined"
                          value={document.code}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          multiline
                          rows={1}
                          disabled
                          fullWidth
                          label="Câu hỏi cho mentor"
                          variant="outlined"
                          value={document.question}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>
                )}
                {tabDisplayOptions.mentor && (
                  <TabPanel value={tabIndex} index={1}>
                    <Grid container spacing={gridSpacing} alignItems="center">
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label="Họ và tên"
                          variant="outlined"
                          value={mentor.fullname}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label="Email"
                          variant="outlined"
                          value={mentor.email_address}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label="Số điện thoại"
                          variant="outlined"
                          value={mentor.number_phone}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}></Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label="Workday 1"
                          variant="outlined"
                          value={convertDateTime(mentor.date1, mentor.time1)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label="Workday 1"
                          variant="outlined"
                          value={convertDateTime(mentor.date2, mentor.time2)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>
                )}
                {tabDisplayOptions.meeting && (
                  <TabPanel value={tabIndex} index={2}>
                    <Grid container spacing={gridSpacing} alignItems="center">
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label="Họ và tên"
                          variant="outlined"
                          value={document.fullname}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label="Mentor"
                          variant="outlined"
                          value={mentor.fullname}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label="Lịch tư vấn"
                          variant="outlined"
                          value={document.schedule}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label="Link meeting"
                          variant="outlined"
                          value={document.link_meeting}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          disabled
                          fullWidth
                          label="Trạng thái"
                          variant="outlined"
                          value={document.status}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item lg={12} md={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Lý do chỉnh sửa"
                          variant="outlined"
                          // value={document.curent_job}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>
                )}
                {tabDisplayOptions.feedback && (
                  <TabPanel value={tabIndex} index={3}>
                    <Grid container spacing={gridSpacing} alignItems="center">
                      <Grid className={classes.feedbackAssess} item lg={12} md={12} xs={12}>
                        <div>Đánh giá dịch vụ: </div>
                        <div className={classes.feedbackStar}>
                          {new Array(feedback.assess_service).fill(1)?.map((_, index) => (
                            <StarIcon key={index} />
                          ))}
                        </div>
                      </Grid>
                      <Grid className={classes.feedbackAssess} item lg={12} md={12} xs={12}>
                        <div>Đánh giá Mentor: </div>
                        <div className={classes.feedbackStar}>
                          {new Array(feedback.assess_mentor).fill(1)?.map((_, index) => (
                            <StarIcon key={index} />
                          ))}
                        </div>
                      </Grid>
                      <Grid className={classes.feedbackAssess} item lg={12} md={12} xs={12}>
                        <div>Đây là lần thứ mấy bạn tham gia dịch vụ hướng nghiệp của trường?</div>
                        <div className={classes.timeNumberInput}>{feedback.times}</div>
                      </Grid>
                      <Grid item lg={12} md={12} xs={12}>
                        <div className={classes.fontBold}>Ý kiến đánh giá và góp ý: </div>
                        <OutlinedInput
                          fullWidth
                          className={classes.feedbackTextInput}
                          defaultValue={feedback.comment}
                          disabled
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid container justify="space-between">
              <Grid item>
                {/* {buttonBackBooking && ( */}
                <Button
                  variant="contained"
                  style={{ background: '#FFC000' }}
                  onClick={handleCloseDialog}
                >
                  {/* {buttonBackBooking.text} */} Đóng
                </Button>
                {/* )} */}
              </Grid>
              {buttonSaveBooking && (
                <Grid item>
                  <Button
                    disabled={!enableSaveButton}
                    variant="contained"
                    style={{ background: '#FFC000' }}
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
