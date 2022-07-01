import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
} from '@material-ui/core';

const style = {
  box: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 400,
    boxShadow: 24,
    background: '#FFFFFF',
    padding: '16px 32px',
    borderRadius: '15px',
  },
  title: {
    fontSize: '18px',
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    width: '100%',
  },
  input: {
    marginTop: '20px',
  },
  buttonWrap: {
    marginTop: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: '0 12px',
    background: '#FFC000',
  },
  error: {
    color: 'red',
  },
};

export default function BasicModal({
  isOpen,
  handleClose,
  type,
  handleCancel,
  handleReview,
  selectedBooking,
  children,
  ...props
}) {
  const [formData, setFormData] = useState({
    status: '',
    note: '',
  });
  const [helperText, setHelperText] = useState('');

  const getTitle = () => {
    switch (type) {
      case 'cancel':
        return 'Lý do huỷ đăng ký';
      case 'review':
        return 'Kết quả buổI đăng ký';
    }
  };

  const getRadioButton = (() => {
    switch (type) {
      case 'cancel':
        return [
          {
            value: 'mentee',
            label: 'Khách yêu cầu hủy',
          },
          {
            value: 'mentor',
            label: 'Mentor yêu cầu hủy',
          },
        ];
      case 'review':
        return [
          {
            value: 'completed',
            label: 'Hoàn thành',
          },
          {
            value: 'uncompleted',
            label: 'Chưa hoàn thành',
          },
        ];
      default:
        return [];
    }
  })();

  const buttonCancelBooking = type === 'cancel';
  const buttonReviewBooking = type === 'review';

  const handleChange = (e) => {
    if (e.target.name === 'status') {
      setFormData({ ...formData, status: e.target.value });
      setHelperText('');
    } else if (e.target.name === 'note') {
      setFormData({ ...formData, note: e.target.value });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.status) {
      setHelperText('Cần chọn ít nhất 1 trường!');
      return;
    }

    if (buttonCancelBooking) handleCancel(formData);
    if (buttonReviewBooking) handleReview(formData);
    setFormData({
      status: '',
      note: '',
    });
  };

  const handleCloseModal = () => {
    setHelperText('');
    if (selectedBooking) {
      const noteList = JSON.parse(sessionStorage.getItem('bookingNote')) || {};
      if (!noteList[selectedBooking]) noteList[selectedBooking] = {};
      noteList[selectedBooking][type] = formData.note;
      sessionStorage.setItem('bookingNote', JSON.stringify(noteList));
    }
    setFormData({
      status: '',
      note: '',
    });
    handleClose();
  };

  useEffect(() => {
    const noteList = JSON.parse(sessionStorage.getItem('bookingNote')) || {};
    if (selectedBooking) {
      if (noteList[selectedBooking])
        setFormData({ ...formData, note: noteList[selectedBooking][type] || '' });
      else setFormData({ ...formData, note: '' });
    }
  }, [isOpen]);

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={style.box}>
          <div id="modal-modal-title" style={style.title} variant="h6" component="h2">
            {getTitle()}
          </div>
          <div id="modal-modal-description" sx={{ mt: 2 }}>
            <FormControl style={style.form}>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {getRadioButton?.map((button, index) => (
                  <FormControlLabel
                    key={index}
                    value={button.value}
                    control={<Radio />}
                    label={button.label}
                  />
                ))}
              </RadioGroup>
              {helperText && <div style={style.error}>{helperText}</div>}
              <TextField
                fullWidth
                multiline
                rowsMax={5}
                label="Ghi chú"
                variant="outlined"
                value={formData.note}
                name="note"
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                style={style.input}
              />
            </FormControl>
            <div style={style.buttonWrap}>
              <Button
                type="button"
                variant="contained"
                style={style.button}
                onClick={handleCloseModal}
              >
                Đóng
              </Button>
              {buttonCancelBooking && (
                <Button
                  type="submit"
                  variant="contained"
                  style={style.button}
                  onClick={handleSubmit}
                >
                  Huỷ
                </Button>
              )}
              {buttonReviewBooking && (
                <Button
                  type="submit"
                  variant="contained"
                  style={style.button}
                  onClick={handleSubmit}
                >
                  Chọn
                </Button>
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
