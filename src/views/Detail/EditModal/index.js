import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, Grid, TextField, MenuItem, Select } from '@material-ui/core';
import { gridSpacing } from '../../../store/constant.js';
import useStyles from '../classes';
import useBooking from '../../../hooks/useBooking';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ClearIcon from '@material-ui/icons/Clear';

const labelDay = {
  Monday: 'Thứ 2',
  Tuesday: 'Thứ 3',
  Wednesday: 'Thứ 4',
  Thursday: 'Thứ 5',
  Friday: 'Thứ 6',
  Saturday: 'Thứ 7',
  Sunday: 'Chủ nhật',
};

const style = {
  title: {
    fontSize: '18px',
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: 'bold',
    position: 'relative'
  },
  buttonWrap: {
    marginTop: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCancel: {
    margin: '0 12px',
    background: 'rgb(70, 81, 105)',
  },
  buttonSubmit: {
    margin: '0 12px',
    background: 'rgb(97, 42, 255)',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 0,
    minWidth: '20px'
  }
};

const labelSessionDate = {
  morning: 'Sáng',
  afternoon: 'Chiều',
  night: 'Tối',
  weekend: 'Cuối tuần'
}

export default function EditModal({ profile, mentor, document, isOpen, handleClose, handleSubmit, handleGoBack }) {

  const { getMentorList, getCareerDemandList, getMentorDetail } = useBooking();

  const classes = useStyles();
  const [isDisabledSaving, setIsDisabledSaving] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    career: '',
    demand: ''
  });

  const [mentorFormData, setMentorFormData] = useState({
    mentor_id: '',
    schedule_id: '',
    date: ''
  });

  const [currentMentor, setCurrentMentor] = useState({})

  const [formDemand, setFormDemand] = useState([]);

  const [selectedMentor, setSelectedMentor] = useState({});

  const [mentorList, setMentorList] = useState([]);

  const [careerDemandList, setCareerDemandList] = useState({
    career: [],
    demand: []
  });

  const [sessionDate, setSessionDate] = useState({
    morning: false,
    afternoon: false,
    night: false,
    weekend: false
  });

  const handleSubmitForm = async () => {
    if (profile) {
      handleSubmit(formData, formData.email !== formData.email_address);
    } else {
      handleSubmit(mentorFormData);
    }
  }

  const handleChangeDemand = (event) => {
    const { target: { value } } = event;
    setFormDemand(typeof value === 'string' ? value.split(',') : value);
    setFormData({ ...formData, demand: value.join(',') });
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleMentorChange = async (e) => {
    if (e.target.name === 'mentor_id') {
      const currentSelectedMentor = mentorList.find(item => item.id === e.target.value) || mentorList[0] || undefined;
      if(currentSelectedMentor) {
        setMentorFormData({ ...mentorFormData, [e.target.name]: e.target.value, schedule_id: currentSelectedMentor?.schedule[0]?.id || '' });
        setSelectedMentor(currentSelectedMentor);
      }
      const detailMentor = await getMentorDetail(e.target.value);
      setCurrentMentor(detailMentor);
      return;
    }
    setMentorFormData({ ...mentorFormData, [e.target.name]: e.target.value, schedule_id: '' });
  }

  const handleClickSchedule = (id) => {
    setMentorFormData({ ...mentorFormData, schedule_id: id, date: '' });
  }

  const convertDateTime = (date, time) => {
    if (!date && !time) return '';
    const hour = time.split('-');
    return labelDay[date] + ' ' + hour[0] + 'h - ' + hour[1] + 'h';
  };

  const handleClickButtonSession = (type) => {
    const newSessionDate = { ...sessionDate, [type]: !sessionDate[type] };
    setSessionDate(newSessionDate);
    const session = Object.keys(newSessionDate)
      .filter(item => newSessionDate[item])
      .map(item => labelSessionDate[item])
      .join(',');
    getAndSetListMentor({ session })
  }

  const getAndSetListMentor = async (data) => {
    const conditions = {
      career: document.career,
      demand: document.demand,
      ...data
    }
    const mentors = await getMentorList(conditions);
    const currentSelectedMentor = mentors.list.find(item => item.id === mentor.id) || mentors[0] || undefined;
    if(currentSelectedMentor) {
      setMentorFormData({ ...mentorFormData, mentor_id: mentor.id, schedule_id: currentSelectedMentor?.schedule[0]?.id || ''  });
      setSelectedMentor(currentSelectedMentor);
    }
    setMentorList(mentors.list);
  }

  const getAndSetCareerAndDemandList = async () => {
    const result = await getCareerDemandList();
    setCareerDemandList({
      career: result.career,
      demand: result.demand
    })
  }


  useEffect(() => {
    if (profile?.email_address) {
      getAndSetCareerAndDemandList();
      setFormDemand(profile.demand.split(','))
      setFormData({
        email: profile.email_address,
        phone: profile.number_phone,
        ...profile
      })

    }
    if (mentor && document) {
      getAndSetListMentor({
        session: ""
      });
      setCurrentMentor(mentor)
    }
  }, [profile, mentor]);

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={`${classes.editBox} ${mentor ? classes.editBoxMentor : ''}`}>
          <div id="modal-modal-title" style={style.title} variant="h6" component="h2">
            {mentor && (
              <div style={{ float: 'left' }}>
                <Button
                  className={classes.buttonClose}
                  onClick={() => handleGoBack('profile')}
                >
                  <ArrowBackIcon />
                </Button>
              </div>
            )}
            <div>
              {profile ? 'Chỉnh sửa thông tin khách hàng' : 'Chỉnh sửa thông tin Mentor'}
            </div>
            <div>
              <Button
                style={style.closeButton}
                onClick={handleClose}
              >
                <ClearIcon />
              </Button>
            </div>
          </div>
          <div id="modal-modal-description" sx={{ mt: 2 }}>
            {profile && (
              <>
                <Grid container className={classes.gridItem} alignItems="center">
                  <Grid item lg={4} md={4} xs={12} >
                    <span className={classes.tabItemLabelField}>Họ và tên:</span>
                  </Grid>
                  <Grid item lg={8} md={8} xs={12}>
                    <TextField
                      fullWidth
                      rows={1}
                      rowsMax={1}
                      variant="outlined"
                      name="fullname"
                      value={formData.fullname}
                      className={classes.inputField}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <Grid container className={classes.gridItem} alignItems="center">
                  <Grid item lg={4} md={4} xs={12}>
                    <span className={classes.tabItemLabelField}>Email:</span>
                  </Grid>
                  <Grid item lg={8} md={8} xs={12}>
                    <TextField
                      fullWidth
                      rows={1}
                      rowsMax={1}
                      variant="outlined"
                      name="email"
                      value={formData.email}
                      className={classes.inputField}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <Grid container className={classes.gridItem} alignItems="center">
                  <Grid item lg={4} md={4} xs={12}>
                    <span className={classes.tabItemLabelField}>SĐT:</span>
                  </Grid>
                  <Grid item lg={8} md={8} xs={12}>
                    <TextField
                      fullWidth
                      rows={1}
                      rowsMax={1}
                      variant="outlined"
                      name="phone"
                      value={formData?.phone}
                      className={classes.inputField}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <Grid container className={classes.gridItem} alignItems="center">
                  <Grid item lg={4} md={4} xs={12}>
                    <span className={classes.tabItemLabelField}>Trình độ học vấn:</span>
                  </Grid>
                  <Grid item lg={8} md={8} xs={12}>
                    <TextField
                      fullWidth
                      rows={1}
                      rowsMax={1}
                      variant="outlined"
                      name="education"
                      value={formData?.education}
                      className={classes.inputField}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <Grid container className={classes.gridItem} alignItems="center">
                  <Grid item lg={4} md={4} xs={12}>
                    <span className={classes.tabItemLabelField}>Điểm mạnh:</span>
                  </Grid>
                  <Grid item lg={8} md={8} xs={12}>
                    <TextField
                      fullWidth
                      rows={1}
                      rowsMax={1}
                      variant="outlined"
                      name="strength"
                      value={formData?.strength}
                      className={classes.inputField}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <Grid container className={classes.gridItem} alignItems="center">
                  <Grid item lg={4} md={4} xs={12}>
                    <span className={classes.tabItemLabelField}>Điểm yếu:</span>
                  </Grid>
                  <Grid item lg={8} md={8} xs={12}>
                    <TextField
                      fullWidth
                      rows={1}
                      rowsMax={1}
                      variant="outlined"
                      name="weakness"
                      value={formData?.weakness}
                      className={classes.inputField}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <Grid container className={classes.gridItem} alignItems="center">
                  <Grid item lg={4} md={4} xs={12}>
                    <span className={classes.tabItemLabelField}>Ngành nghề:</span>
                  </Grid>
                  <Grid item lg={8} md={8} xs={12}>
                    <Select
                      name="career"
                      labelId="demo-multiple-name-label-1"
                      id="demo-multiple-name-1"
                      className={classes.multpleSelectField}
                      value={formData.career}
                      onChange={handleChange}
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
                <Grid container className={classes.gridItem} alignItems="center">
                  <Grid item lg={4} md={4} xs={12}>
                    <span className={classes.tabItemLabelField}>Nhu cầu tư vấn:</span>
                  </Grid>
                  <Grid item lg={8} md={8} xs={12}>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      multiple
                      className={classes.multpleSelectField}
                      value={formDemand}
                      onChange={handleChangeDemand}
                    >
                      {careerDemandList.demand.map((item) => (
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
                <Grid container className={classes.gridItem} alignItems="center">
                  <Grid item lg={4} md={4} xs={12}>
                    <span className={classes.tabItemLabelField}>Mã tư vấn:</span>
                  </Grid>
                  <Grid item lg={8} md={8} xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      rows={1}
                      rowsMax={1}
                      variant="outlined"
                      name="id"
                      defaultValue={profile.id}
                      className={classes.inputField}
                    />
                  </Grid>
                </Grid>
                <Grid container className={classes.gridItem} alignItems="center">
                  <Grid item lg={4} md={4} xs={12}>
                    <span className={classes.tabItemLabelField}>Trường:</span>
                  </Grid>
                  <Grid item lg={8} md={8} xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      rows={1}
                      rowsMax={1}
                      variant="outlined"
                      name="university_name"
                      value={formData?.university_name}
                      className={classes.inputField}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <Grid container className={classes.gridItem} alignItems="center">
                  <Grid item lg={12} md={12} xs={12}>
                    <span className={classes.tabItemLabelField}>Câu hỏi cho mentor:</span>
                  </Grid>
                  <Grid item lg={12} md={12} xs={12}>
                    <TextField
                      multiline
                      fullWidth
                      rows={3}
                      rowsMax={3}
                      variant="outlined"
                      name="question"
                      value={formData?.question}
                      className={classes.inputField}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </>
            )}
            {mentor && (
              <Grid container>
                <Grid item lg={6} md={6} xs={12} style={{ paddingRight: '20px', borderRight: '1px solid #000' }} >
                  <Grid container className={classes.gridItem} alignItems="center">
                    <Grid item lg={4} md={4} xs={12} >
                      <span className={classes.tabItemLabelField}>Họ và tên:</span>
                    </Grid>
                    <Grid item lg={8} md={8} xs={12}>
                      <Select
                        name="mentor_id"
                        labelId="demo-multiple-name-label-2"
                        id="demo-multiple-name-2"
                        className={classes.multpleSelectField}
                        value={mentorFormData.mentor_id}
                        onChange={handleMentorChange}
                      >
                        {mentorList?.map(mentorInfo => (
                          <MenuItem key={mentorInfo.id} value={mentorInfo.id} >{mentorInfo.fullname}</MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </Grid>
                  <Grid container className={classes.gridItem} alignItems="center">
                    <Grid item lg={4} md={4} xs={12} >
                      <span className={classes.tabItemLabelField}>Lịch cố định:</span>
                    </Grid>
                    <Grid item lg={8} md={8} xs={12} className={classes.buttonScheduleWrap}>
                      <button className={`${classes.buttonSchedule} ${sessionDate.morning ? 'active' : ''}`} onClick={() => handleClickButtonSession('morning')}>
                        Sáng
                      </button>
                      <button className={`${classes.buttonSchedule} ${sessionDate.afternoon ? 'active' : ''}`} onClick={() => handleClickButtonSession('afternoon')}>
                        Chiều
                      </button>
                      <button className={`${classes.buttonSchedule} ${sessionDate.night ? 'active' : ''}`} onClick={() => handleClickButtonSession('night')}>
                        Tối
                      </button>
                      <button className={`${classes.buttonSchedule} ${sessionDate.weekend ? 'active' : ''}`} onClick={() => handleClickButtonSession('weekend')}>
                        Cuối tuần
                      </button>
                    </Grid>
                  </Grid>
                  <Grid container className={classes.gridItem} style={{ justifyContent: 'center' }} alignItems="center">
                    {selectedMentor?.schedule?.map(item => (
                      <div
                        key={item.id}
                        onClick={() => handleClickSchedule(item.id)}
                        className={`${classes.mentorSchedule} ${mentorFormData.schedule_id === item.id ? 'active' : ''}`}
                      >
                        <div>{labelDay[item.day]}</div>
                        <div>{item.date1}</div>
                        <div>{item.hour}:00</div>
                      </div>
                    ))}
                  </Grid>
                  <Grid container className={classes.gridItem} alignItems="center">
                    <Grid item lg={4} md={4} xs={12} >
                      <span className={classes.tabItemLabelField}>Lịch linh động:</span>
                    </Grid>
                    <Grid item lg={8} md={8} xs={12}>
                      <TextField
                        id="datetime-local"
                        type="datetime-local"
                        name="date"
                        value={mentorFormData.date}
                        className={classes.inputField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={handleMentorChange}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={6} md={6} xs={12} style={{ paddingLeft: '20px' }} >
                  <Grid container className={classes.gridItem} alignItems="center">
                    <Grid item lg={4} md={4} xs={12}>
                      <span className={classes.tabItemLabelField}>Họ và tên</span>
                    </Grid>
                    <Grid item lg={8} md={8} xs={12}>
                      <TextField
                        disabled
                        fullWidth
                        rows={1}
                        rowsMax={1}
                        variant="outlined"
                        name="fullname"
                        value={currentMentor?.fullname}
                        className={classes.inputField}
                      />
                    </Grid>
                  </Grid>
                  <Grid container className={classes.gridItem} alignItems="center">
                    <Grid item lg={4} md={4} xs={12}>
                      <span className={classes.tabItemLabelField}>Email:</span>
                    </Grid>
                    <Grid item lg={8} md={8} xs={12}>
                      <TextField
                        disabled
                        fullWidth
                        rows={1}
                        rowsMax={1}
                        variant="outlined"
                        name="email_address"
                        value={currentMentor?.email_address}
                        className={classes.inputField}
                      />
                    </Grid>
                  </Grid>
                  <Grid container className={classes.gridItem} alignItems="center">
                    <Grid item lg={4} md={4} xs={12}>
                      <span className={classes.tabItemLabelField}>SĐT:</span>
                    </Grid>
                    <Grid item lg={8} md={8} xs={12}>
                      <TextField
                        disabled
                        fullWidth
                        rows={1}
                        rowsMax={1}
                        variant="outlined"
                        name="number_phone"
                        value={currentMentor?.number_phone}
                        className={classes.inputField}
                      />
                    </Grid>
                  </Grid>
                  <Grid container className={classes.gridItem} alignItems="center">
                    <Grid item lg={4} md={4} xs={12}>
                      <span className={classes.tabItemLabelField}>Chuyên ngành:</span>
                    </Grid>
                    <Grid item lg={8} md={8} xs={12}>
                      <TextField
                        disabled
                        fullWidth
                        rows={1}
                        rowsMax={1}
                        variant="outlined"
                        name="career"
                        value={currentMentor?.career}
                        className={classes.inputField}
                      />
                    </Grid>
                  </Grid>
                  <Grid container className={classes.gridItem} alignItems="center">
                    <Grid item lg={4} md={4} xs={12}>
                      <span className={classes.tabItemLabelField}>Title:</span>
                    </Grid>
                    <Grid item lg={8} md={8} xs={12}>
                      <TextField
                        disabled
                        multiline
                        fullWidth
                        rows={1}
                        rowsMax={2}
                        variant="outlined"
                        name="title"
                        value={currentMentor?.title}
                        className={`${classes.inputField} inputFieldDisabled`}
                      />
                    </Grid>
                  </Grid>
                  <Grid container className={classes.gridItem} alignItems="center">
                    <Grid item lg={4} md={4} xs={12}>
                      <span className={classes.tabItemLabelField}>Workday 1:</span>
                    </Grid>
                    <Grid item lg={8} md={8} xs={12}>
                      <TextField
                        disabled
                        fullWidth
                        rows={1}
                        rowsMax={1}
                        variant="outlined"
                        name="weakness"
                        value={convertDateTime(currentMentor?.date1, currentMentor?.time1)}
                        className={classes.inputField}
                      />
                    </Grid>
                  </Grid>
                  <Grid container className={classes.gridItem} alignItems="center">
                    <Grid item lg={4} md={4} xs={12}>
                      <span className={classes.tabItemLabelField}>Workday 2:</span>
                    </Grid>
                    <Grid item lg={8} md={8} xs={12}>
                      <TextField
                        disabled
                        fullWidth
                        rows={1}
                        rowsMax={1}
                        variant="outlined"
                        name="career"
                        value={convertDateTime(currentMentor?.date2, currentMentor?.time2)}
                        className={classes.inputField}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </div>
          <div id="modal-modal-footer" sx={{ mt: 2 }}>
            <div style={style.buttonWrap}>
              <Button
                type="button"
                variant="contained"
                style={style.buttonCancel}
                onClick={() => handleClose(true)}
              >
                Huỷ bỏ
              </Button>
              <Button
                disabled={isDisabledSaving}
                type="button"
                variant="contained"
                style={style.buttonSubmit}
                onClick={handleSubmitForm}
              >
                Lưu
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}