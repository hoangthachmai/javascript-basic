import React from 'react';
import { makeStyles, Typography, Divider, Grid, useMediaQuery, useTheme } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { gridSpacing } from '../../store/constant';
import { CONFIRM_CHANGE } from '../../store/actions';
import useConfirmPopup from '../../hooks/useConfirmPopup';

function getModalStyle() {
  return {
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  dropzone: {
    textAlign: 'center',
    padding: '30px',
    border: '3px dashed #eeeeee',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    cursor: 'pointer',
    marginBottom: '20px',
  },
}));

export default function ConfirmPupup() {
  const classes = useStyles();
  const theme = useTheme();
  const matchDownXs = useMediaQuery(theme.breakpoints.down('xs'));
  const [modalStyle] = React.useState(getModalStyle);
  const { open, message, title, action, payload, setConfirmPopup, onSuccess } = useConfirmPopup();

  const closeConfirmPopup = () => setConfirmPopup({ type: CONFIRM_CHANGE, open: false });

  const doAction = async () => {
    await action(payload);
    onSuccess();
    setConfirmPopup({ type: CONFIRM_CHANGE, open: false });
  };

  return (
    <Modal
      open={open}
      onClose={closeConfirmPopup}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div
        style={{ ...modalStyle, width: matchDownXs ? '100%' : '500px' }}
        className={classes.paper}
      >
        <Typography variant="subtitle1">{title}</Typography>
        <Divider className={classes.divider} />
        <Typography variant="subtitle2">{message}</Typography>
        <Grid container justify="flex-end" spacing={gridSpacing}>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={closeConfirmPopup}>
              Đóng
            </Button>
          </Grid>
          {!!action && (
            <Grid item>
              <Button variant="contained" color="primary" onClick={doAction}>
                Xác nhận
              </Button>
            </Grid>
          )}
        </Grid>
      </div>
    </Modal>
  );
}
