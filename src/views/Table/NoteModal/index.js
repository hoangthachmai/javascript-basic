import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  Checkbox,
  MenuItem,
  Grid,
  FormControl,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControlLabel,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import useBooking from './../../../hooks/useBooking';
import { format as formatDate } from 'date-fns';

const style = {
  box: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 500,
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
    marginBottom: '20px',
  },
  noteContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  noteLabel: {
    fontWeight: 'bold',
    // marginTop: 15,
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
  table: {
    maxHeight: 250,
    marginBottom: 25,
  },
};

const notesData = ['Bắt đầu', 'Hoàn thành', 'Mentor tham gia muộn', 'Khách hàng tham gia muộn'];

const StyledTableCell = withStyles((theme) => ({
  root: {
    '&:not(:first-child)': {
      padding: '10px 2px',
    },
    '&:first-child': {
      padding: '10px 2px 10px 20px',
    },
  },
}))(TableCell);

export default function NoteModal({
  isOpen,
  handleClose,
  handleSubmit,
  selectedBooking,
  children,
  ...props
}) {
  const { getLitsNote } = useBooking();
  const [note, setNote] = useState('');
  const [noteList, setNoteList] = useState([]);
  const [isSend, setIsSend] = useState(false);

  const handleChange = (e) => {
    setNote(e.target.value);
  };

  const handleSubmitForm = (event) => {
    event.preventDefault();
    handleSubmit(note, isSend);
  };

  const handleCloseModal = () => {
    handleClose();
  };

  useEffect(() => {
    if (selectedBooking) {
      setNote(selectedBooking.note || '');
    }
  }, [isOpen, selectedBooking]);

  useEffect(() => {
    getNotes(selectedBooking.id);
  }, []);

  console.log(noteList);

  const getNotes = async (id) => {
    const list = await getLitsNote(id);
    if (list.length > 0) setNoteList(list);
    else setNoteList([]);
  };

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
              <TextField
                select
                id="demo-customized-select"
                label="Mẫu ghi chú"
                variant="outlined"
                onChange={handleChange}
                size="small"
              >
                <MenuItem value="">
                  <em>Không chọn</em>
                </MenuItem>
                {notesData.map((item, i) => (
                  <MenuItem key={i} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
              <Grid container>
                <Grid item xs={6} style={style.noteContainer}>
                  <div style={style.noteLabel}>Ghi chú:</div>
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox checked={isSend} onChange={(e) => setIsSend(e.target.checked)} />
                    }
                    label="Thông báo"
                  />
                  {/* <Checkbox
                    checked={isSend}
                    onChange={(e) => setIsSend(e.target.checked)}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  /> */}
                </Grid>
              </Grid>
              <TextField
                fullWidth
                multiline
                rows={3}
                rowsMax={5}
                variant="outlined"
                value={note}
                name="note"
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                style={style.input}
              />
            </FormControl>
            <TableContainer style={style.table} component={Paper}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Thời gian</StyledTableCell>
                    <StyledTableCell align="left">Người tạo</StyledTableCell>
                    <StyledTableCell align="left">Nội dung</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {noteList?.map((row) => (
                    <TableRow key={row.created_date}>
                      <StyledTableCell align="left">
                        {formatDate(new Date(row.created_date), 'h:mm aa')}
                      </StyledTableCell>
                      <StyledTableCell align="left">{row.created_by}</StyledTableCell>
                      <StyledTableCell align="left">{row.note}</StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
