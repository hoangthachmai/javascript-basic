import * as React from 'react';
import { Box, Button, Modal } from '@material-ui/core';

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

export default function ConfirmSaveDialog({ isOpen, handleClose, handleSubmit }) {
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
            Bạn có muốn gửi email xác nhận?
          </div>
          <div id="modal-modal-description" sx={{ mt: 2 }}>
            <div style={style.buttonWrap}>
              <Button
                type="button"
                variant="contained"
                style={style.buttonSubmit}
                onClick={() => handleSubmit(true)}
              >
                Có
              </Button>
              <Button
                type="button"
                variant="contained"
                style={style.buttonCancel}
                onClick={() => handleSubmit(true)}
              >
                Không
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
