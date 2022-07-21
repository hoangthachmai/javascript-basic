import React, { useState, useEffect } from 'react';
import { dateOfWeek, timeWorking, workingType } from '../../../store/constants/time';
import { initMentorData, initWorkingDay } from '../../../store/constants/initial';
import {
  Switch, Modal, Snackbar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Slide, Tab, Tabs, Typography, TextField, MenuItem, Select
} from '@material-ui/core';
import { style } from './style';
import useStyles from '../Detail/classes';
import { convertArrayToObject } from '../../../utils/convertArrayToObject';
import { v4 as uuidv4 } from 'uuid';
import cloneDeep from 'lodash/cloneDeep';
import uniqBy from 'lodash/uniqBy';

export default function ScheduleModal({ isOpen, handleClose, submit, type, mentor }) {
  const classes = useStyles();
  const [errorWorking, setErrorWorking] = useState({
    isError: false,
    text: ''
  });
  const [mentorData, setMentorData] = useState(initMentorData);

  const [workingDay, setWorkingDay] = useState(convertArrayToObject([
    { ...initWorkingDay, id: uuidv4() }
  ]))

  const isDisableSubmit = () => {
    if (type === 'working') {
      return false;
    } else {
      return !mentorData.vacation_start || !mentorData.vacation_end;
    }
  }

  const validateWorkingDay = (name, value, id) => {
    const newWorkingDay = cloneDeep(workingDay);
    newWorkingDay[id][name] = value;
    const arrayWorkingDay = Object.values(newWorkingDay).map(item => ({ ...item, time: item.hour + item.day }));
    if (uniqBy(arrayWorkingDay, 'time').length === arrayWorkingDay.length) {
      setErrorWorking({
        isError: false,
        text: ''
      });
    } else {
      setErrorWorking({
        isError: true,
        text: 'Các buổi làm việc không được trùng nhau'
      });
    }
  }

  const handleChangeMentor = (event) => {
    const { target: { name, value } } = event;
    setMentorData({ ...mentorData, [name]: value });
  }

  const handleChangeWorkingDay = (event, id) => {
    const { target: { name, value, checked } } = event;
    if (name === 'day' || name === 'hour') validateWorkingDay(name, value, id);
    const newWorkingDay = cloneDeep(workingDay);
    newWorkingDay[id][name] = value || checked;
    setWorkingDay(newWorkingDay)
  }

  const handleAddWorkingDay = () => {
    const newId = uuidv4();
    setWorkingDay({
      ...workingDay,
      [newId]: {
        ...initWorkingDay,
        id: newId,
      }
    })
  }

  const handleSubmitModal = () => {
    submit({ ...mentorData, workday: Object.values(workingDay) });
  }

  useEffect(() => {
    setMentorData({ ...mentorData, ...mentor });
    console.log(convertArrayToObject(mentor?.workday))
    setWorkingDay(convertArrayToObject(mentor?.workday))
  }, [mentor]);

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={style.box}>
          <div id="modal-modal-title" style={style.title} variant="h6" component="h2">
            {type === 'working' ? 'Lịch làm việc' : 'Lịch nghỉ phép'}
          </div>
          <div id="modal-modal-description" sx={{ mt: 2 }}>
            {type === 'working' ? (
              <div>
                <Grid container spacing={1} className={classes.gridItemInfo} justify="space-between" alignItems="center">
                  <div><b>Lịch làm việc</b></div>
                  <Button className={classes.gridItemInfoButton} onClick={handleAddWorkingDay}>Thêm</Button>
                </Grid>
                {Object.keys(workingDay).map(day => (
                  <Grid key={day} spacing={1} container className={classes.gridItemInfo} alignItems="center">
                    <Grid item lg={3} md={3} xs={12}>
                      <Select
                        name="day"
                        labelId="date-label"
                        className={classes.multpleSelectField}
                        value={workingDay[day].day}
                        onChange={(e) => handleChangeWorkingDay(e, day)}
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
                        name="hour"
                        labelId="time1-label"
                        className={classes.multpleSelectField}
                        value={workingDay[day].hour}
                        onChange={(e) => handleChangeWorkingDay(e, day)}
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
                        name="type"
                        labelId="time1-label"
                        className={classes.multpleSelectField}
                        value={workingDay[day].type}
                        onChange={(e) => handleChangeWorkingDay(e, day)}
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
                        name="is_active"
                        checked={!!workingDay[day].is_active}
                        onChange={(e) => handleChangeWorkingDay(e, day)}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Grid>

                  </Grid>
                ))}
              </div>
            ) : (
              <>
                <Grid container className={classes.gridItemInfo} alignItems="center">
                  <Grid item lg={4} md={4} xs={4}>
                    <span className={classes.tabItemLabelField}>Ngày bắt đầu:</span>
                  </Grid>
                  <Grid item lg={8} md={8} xs={8}>
                    <TextField
                      id="datetime-local"
                      type="datetime-local"
                      name="vacation_start"
                      value={mentorData?.vacation_start}
                      className={classes.inputField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={handleChangeMentor}
                    />
                  </Grid>
                </Grid>
                <Grid container className={classes.gridItemInfo} alignItems="center">
                  <Grid item lg={4} md={4} xs={4}>
                    <span className={classes.tabItemLabelField}>Ngày kết thúc:</span>
                  </Grid>
                  <Grid item lg={8} md={8} xs={8}>
                    <TextField
                      id="datetime-local"
                      type="datetime-local"
                      name="vacation_end"
                      value={mentorData?.vacation_end}
                      className={classes.inputField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={handleChangeMentor}
                    />
                  </Grid>
                </Grid>
              </>
            )}
            {errorWorking.isError && (
              <Grid container className={classes.gridItemInfo} alignItems="center">
                <Grid item lg={12} md={12} xs={12} className={classes.errorLabel}>
                  {errorWorking.text}
                </Grid>
              </Grid>
            )}
          </div>
          <div id="modal-modal-footer">
            <div style={style.buttonWrap}>
              <Button
                type="button"
                variant="contained"
                style={style.buttonCancel}
                onClick={handleClose}
              >
                Huỷ bỏ
              </Button>
              <Button
                disabled={errorWorking.isError || isDisableSubmit()}
                type="button"
                variant="contained"
                style={style.buttonSubmit}
                onClick={handleSubmitModal}
              >
                {type === 'working' ? 'Lưu' : 'Cập nhật'}
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}