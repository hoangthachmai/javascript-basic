import React, { useRef, useEffect } from 'react';
import {
  Grid,
  Button,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Box,
  Typography,
  Tab,
  Link,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { getUrlByAction } from '../../utils/utils';
import { gridSpacing, view } from '../../store/constant.js';
import { FLOATING_MENU_CHANGE } from '../../store/actions.js';
import useView from './../../hooks/useView';
import useBooking from './../../hooks/useBooking';
import useTask from './../../hooks/useTask';

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
  const editorRef = useRef(null);
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = React.useState(0);
  const { form_buttons: formButtons, name, tabs, disabled_fields } = useView();

  const dontHaveColumnSettings = !tabs || !tabs.length;
  const tabDisplayOptions = {
    info: dontHaveColumnSettings ? true : tabs.includes('info'),
    content: dontHaveColumnSettings ? true : tabs.includes('content'),
    related_news: dontHaveColumnSettings ? true : tabs.includes('related_news'),
    seo: dontHaveColumnSettings ? true : tabs.includes('seo'),
    answers: dontHaveColumnSettings ? true : tabs.includes('answers'),
    personal_info: dontHaveColumnSettings ? true : tabs.includes('personal_info'),
    assessment_result: dontHaveColumnSettings ? true : tabs.includes('assessment_result'),
    datetime: dontHaveColumnSettings ? true : tabs.includes('datetime'),
    related_consultant: dontHaveColumnSettings ? true : tabs.includes('related_consultant'),
    booking: dontHaveColumnSettings ? true : tabs.includes('booking'),
    consultant: dontHaveColumnSettings ? true : tabs.includes('consultant'),
  };

  const buttonBackBooking = formButtons.find((button) => button.name === view.booking.detail.back);
  const buttonSaveBooking = formButtons.find((button) => button.name === view.booking.detail.save);

  const handleChangeTab = (event, newValue) => {
    // if (newValue !== 0 ) {
    //   getConsultantDetail();
    // }
    setTabIndex(newValue);
  };

  const { reloadDocuments } = useTask();
  const { updateBooking, getMentorDetail } = useBooking();

  const { detailDocument: openDialog } = useSelector((state) => state.floatingMenu);
  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);
  const { selectedDocument, documentType } = useSelector((state) => state.document);
  // const { categories } = useSelector((state) => state.category);
  const reduxDocuments = useSelector((state) => state.task);
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

  useEffect(() => {
    if (!selectedDocument) return;
    setDocument({
      ...document,
      ...selectedDocument,
      category_id: selectedDocument.category_id ? selectedDocument.category_id : '',
    });
    getConsultantDetail(selectedDocument.consultant_id);
  }, [selectedDocument]);

  const getConsultantDetail = async (id) => {
    const cons = await getMentorDetail(id);
    setMentor(cons);
  };

  const handleCloseDialog = () => {
    setDocumentToDefault();
    dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: false });
  };
  const removeFields = (document) => {
    if (!tabDisplayOptions.content) {
      delete document.content;
    }
    if (!tabDisplayOptions.related_news) {
      delete document.related_news;
      delete document.related_news_id_list;
    }
    if (!tabDisplayOptions.seo) {
      delete document.keywords;
    }
    if (!tabDisplayOptions.answers) {
      delete document.answer_id_list;
    }

    return document;
  };

  const updateDocument = async () => {
    let updatedDocument = {
      outputtype: 'RawJson',
      id: document.id,
      project_id: selectedProject.id,
      title: document.title,
      content:
        editorRef.current && editorRef.current.getContent()
          ? editorRef.current.getContent()
          : document.content,
      category_id: document.category_id,
      short_description: document.short_description,
      attachment_url_list: [],
      source_name: document.source_name,
      source_url: document.source_url,
      image_url: document.image_url,
      is_featured: document.is_featured,
      keywords: document.keywords,
    };
    updatedDocument = removeFields(updatedDocument);

    if (documentType === 'booking') {
      updatedDocument = {
        ...updatedDocument,
        consultant_id: document.consultant_id,
      };
      await updateBooking(updatedDocument);
    }
    // await axiosInstance.post(vibEndpoints.update_document, { outputtype: "RawJson", id: document.id, project_id: selectedProject.id, title: document.title, content: editorRef.current && editorRef.current.getContent() ? editorRef.current.getContent() : document.content, category_id: document.category_id, short_description: document.short_description, attachment_url_list: [], source_name: document.source_name, source_url: document.source_url, image_url: document.image_url, is_featured: true } )
    handleCloseDialog();
    const url = getUrlByAction(selectedFolder);
    // const { documents = [], total_item: count = 0, page = 1, order_by = 'created_at', order_type = 'desc', no_item_per_page = 10, category_id = '', search_text = '', folder_id, project_id } = reduxDocuments[documentType] || {}
    reloadDocuments(
      url,
      documentType,
      selectedProject.id,
      selectedFolder.id,
      reduxDocuments[documentType]
    );
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
                </Tabs>
              </Grid>
              <Grid item xs={12}>
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
                        disabled
                        fullWidth
                        label="Email"
                        variant="outlined"
                        value={document.email_address}
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
                        label="Ngảnh nghề"
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
                    <Grid item lg={12} md={12} xs={12}>
                      <TextField
                        multiline
                        rows={3}
                        disabled
                        fullWidth
                        label="Câu hỏi cho mentor"
                        variant="outlined"
                        value={document.notes}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
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
                        label="Link Meeting"
                        variant="outlined"
                        value={(
                          <Link href="#" underline="none">
                            {'underline="none"'}
                          </Link>
                        )}
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
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid container justify="space-between">
              <Grid item>
                {/* {buttonBackBooking && ( */}
                <Button variant="contained" color="secondary" onClick={handleCloseDialog}>
                  {/* {buttonBackBooking.text} */} Đóng
                </Button>
                {/* )} */}
              </Grid>
              <Grid item>
                <Grid container justify="flex-end" spacing={gridSpacing}>
                  {/* {
                                        buttonSaveBooking && <Grid item>
                                            <Button variant="contained" color="primary" onClick={updateDocument}>
                                                {buttonSaveBooking.text}
                                            </Button>
                                        </Grid>
                                    } */}
                </Grid>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  );
};

export default DetailDocumentDialog;
