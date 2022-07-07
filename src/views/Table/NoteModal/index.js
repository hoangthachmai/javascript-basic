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

export default function NoteModal({
  isOpen,
  handleClose,
  handleSubmit,
  selectedBooking,
  children,
  ...props
}) {
  const [note, setNote] = useState('');

  const handleChange = (e) => {
    setNote(e.target.value)
  };

  const handleSubmitForm = (event) => {
    event.preventDefault();
    handleSubmit(note);
  };

  const handleCloseModal = () => {
    handleClose();
  };


  useEffect(() => {
    if (selectedBooking) {
      setNote(selectedBooking.note || '');
    }
  }, [isOpen, selectedBooking]);
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
            Ghi chú
          </div>
          <div id="modal-modal-description" style={style.body}>
            <FormControl style={style.form}>
              <div style={style.noteLabel}>Ghi chú:</div>
              <TextField
                fullWidth
                multiline
                rowsMax={5}
                variant="outlined"
                value={note}
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
                style={style.closeButton}
                onClick={handleCloseModal}
              >
                Đóng
              </Button>
              <Button
                type="submit"
                variant="contained"
                style={style.submitButton}
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
