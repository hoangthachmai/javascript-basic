import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,

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
    borderRadius: '15px',
  },
  title: {
    padding: '16px 32px 20px',
    fontSize: '18px',
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd',
  },
  body: {
    padding: '0 32px',
  },
  form: {
    width: '100%',
  },
  noteLabel: {
    marginTop: '20px',
    fontWeight: 'bold',
  },
  input: {},
  buttonWrap: {
    marginTop: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 32px 16px',
  },
  button: {
    margin: '0 12px',
    background: '#FFC000',
  },
  closeButton: {
    margin: '0 12px',
    background: '#465169',
  },
  submitButton: {
    margin: '0 12px',
    background: '#612AFF',
  },
  error: {
    color: 'red',
  },
  formlabel: {
    fontWeight: 'bold',
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
        return 'Lý do huỷ đăng ký:';
      case 'review':
        return 'Kết quả buổi đăng ký:';
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
    
    handleClose();
    
  };

  useEffect(() => {
    const noteList = JSON.parse(sessionStorage.getItem('bookingNote')) || {};
    if (selectedBooking) {
      if (noteList[selectedBooking])
        setFormData({ ...formData, note: noteList[selectedBooking][type] || '' });
      else setFormData({ ...formData, note: '' });
    }
  }, [isOpen, type, selectedBooking]);

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
            {type === 'review' ? 'Xử lý' : 'Huỷ đăng ký'}
          </div>
          <div id="modal-modal-description" style={style.body}>
            <div style={style.formlabel}>{getTitle()}</div>
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
           
            </FormControl>
            <div style={style.buttonWrap}>
              <Button
                type="button"
                variant="contained"
                style={style.closeButton}
                onClick={handleCloseModal}
              >
                Đóng
              </Button>
              {buttonCancelBooking && (
                <Button
                  type="submit"
                  variant="contained"
                  style={style.submitButton}
                  onClick={handleSubmit}
                >
                  Huỷ
                </Button>
              )}
              {buttonReviewBooking && (
                <Button
                  type="submit"
                  variant="contained"
                  style={style.submitButton}
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
