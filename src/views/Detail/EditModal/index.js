import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, Grid, TextField } from '@material-ui/core';
import { gridSpacing } from '../../../store/constant.js';
import useStyles from '../classes';

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
  }
};

export default function EditModal({ profile, mentor, isOpen, handleClose, handleSubmit }) {
  const classes = useStyles();
  const [disableSaving, setDisableSaving] = useState(true);
  const [email, setEmail] = useState('');

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setDisableSaving(e.target.value === profile.email_address || !e.target.value);
  }

  const convertDateTime = (date, time) => {
    if (!date && !time) return '';
    const hour = time.split('-');
    return labelDay[date] + ' ' + hour[0] + 'h - ' + hour[1] + 'h';
  };

  useEffect(() => {
    if(profile?.email_address) {
      setEmail(profile.email_address);
    }
    if(mentor?.email_address) {
      setEmail(mentor.email_address || '');
    }
  }, [profile, mentor])

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.editBox}>
          <div id="modal-modal-title" style={style.title} variant="h6" component="h2">
            {profile ? 'Chỉnh sửa thông tin khách hàng' : 'Chỉnh sửa thông tin Mentor'}
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
                      disabled
                      fullWidth
                      rows={1}
                      rowsMax={1}
                      variant="outlined"
                      name="fullname"
                      defaultValue={profile.fullname}
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
                      fullWidth
                      rows={1}
                      rowsMax={1}
                      variant="outlined"
                      name="email_address"
                      value={email}
                      className={classes.inputField}
                      onChange={handleChangeEmail}
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
                      defaultValue={profile.number_phone}
                      className={classes.inputField}
                    />
                  </Grid>
                </Grid>
                <Grid container className={classes.gridItem} alignItems="center">
                  <Grid item lg={4} md={4} xs={12}>
                    <span className={classes.tabItemLabelField}>Trình độ học vấn:</span>
                  </Grid>
                  <Grid item lg={8} md={8} xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      rows={1}
                      rowsMax={1}
                      variant="outlined"
                      name="education"
                      defaultValue={profile.education}
                      className={classes.inputField}
                    />
                  </Grid>
                </Grid>
                <Grid container className={classes.gridItem} alignItems="center">
                  <Grid item lg={4} md={4} xs={12}>
                    <span className={classes.tabItemLabelField}>Điểm mạnh:</span>
                  </Grid>
                  <Grid item lg={8} md={8} xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      rows={1}
                      rowsMax={1}
                      variant="outlined"
                      name="strength"
                      defaultValue={profile.strength}
                      className={classes.inputField}
                    />
                  </Grid>
                </Grid>
                <Grid container className={classes.gridItem} alignItems="center">
                  <Grid item lg={4} md={4} xs={12}>
                    <span className={classes.tabItemLabelField}>Điểm yếu:</span>
                  </Grid>
                  <Grid item lg={8} md={8} xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      rows={1}
                      rowsMax={1}
                      variant="outlined"
                      name="weakness"
                      defaultValue={profile.weakness}
                      className={classes.inputField}
                    />
                  </Grid>
                </Grid>
                <Grid container className={classes.gridItem} alignItems="center">
                  <Grid item lg={4} md={4} xs={12}>
                    <span className={classes.tabItemLabelField}>Ngành nghề:</span>
                  </Grid>
                  <Grid item lg={8} md={8} xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      rows={1}
                      rowsMax={1}
                      variant="outlined"
                      name="career"
                      defaultValue={profile.career}
                      className={classes.inputField}
                    />
                  </Grid>
                </Grid>
                <Grid container className={classes.gridItem} alignItems="center">
                  <Grid item lg={4} md={4} xs={12}>
                    <span className={classes.tabItemLabelField}>Nhu cầu tư vấn:</span>
                  </Grid>
                  <Grid item lg={8} md={8} xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      rows={1}
                      rowsMax={1}
                      variant="outlined"
                      name="demand"
                      defaultValue={profile.demand}
                      className={classes.inputField}
                    />
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
                      defaultValue={profile.university_name}
                      className={classes.inputField}
                    />
                  </Grid>
                </Grid>
                <Grid container className={classes.gridItem} alignItems="center">
                  <Grid item lg={4} md={4} xs={12}>
                    <span className={classes.tabItemLabelField}>Câu hỏi cho mentor:</span>
                  </Grid>
                  <Grid item lg={8} md={8} xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      rows={1}
                      rowsMax={1}
                      variant="outlined"
                      name="question"
                      defaultValue={profile.question}
                      className={classes.inputField}
                    />
                  </Grid>
                </Grid>
              </>
            )}
            {mentor && (
              <>
                <Grid container className={classes.gridItem} alignItems="center">
                  <Grid item lg={4} md={4} xs={12} >
                    <span className={classes.tabItemLabelField}>Họ và tên:</span>
                  </Grid>
                  <Grid item lg={8} md={8} xs={12}>
                    <TextField
                      disabled
                      fullWidth
                      rows={1}
                      rowsMax={1}
                      variant="outlined"
                      name="fullname"
                      defaultValue={mentor.fullname}
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
                      value={email}
                      className={classes.inputField}
                      onChange={handleChangeEmail}
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
                      defaultValue={mentor.number_phone}
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
                      defaultValue={mentor.career}
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
                      fullWidth
                      rows={1}
                      rowsMax={1}
                      variant="outlined"
                      name="title"
                      defaultValue={mentor.title}
                      className={classes.inputField}
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
                      defaultValue={convertDateTime(mentor.date1, mentor.time1)}
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
                      defaultValue={convertDateTime(mentor.date2, mentor.time2)}
                      className={classes.inputField}
                    />
                  </Grid>
                </Grid>
                
              </>
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
                disabled={disableSaving}
                type="button"
                variant="contained"
                style={style.buttonSubmit}
                onClick={() => handleSubmit({email})}
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