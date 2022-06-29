import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Card,
  Button,
  Divider,
  MenuItem,
  FormControl,
  Menu,
  InputBase,
  Checkbox,
} from '@material-ui/core';
// import Breadcrumb from './../../component/Breadcrumb';
import Modal from '../Table/Modal';
import StarIcon from '@material-ui/icons/Star';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { bookingActions, gridSpacing, view } from '../../store/constant';
import { useSelector, useDispatch } from 'react-redux';
import useTask from './../../hooks/useTask';
import useConfirmPopup from './../../hooks/useConfirmPopup';
import useView from './../../hooks/useView';
import {
  FLOATING_MENU_CHANGE,
  DOCUMENT_CHANGE,
  TASK_CHANGE,
  CONFIRM_CHANGE,
} from '../../store/actions';
import useBooking from './../../hooks/useBooking';

const style = {
  datePickerWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  datePickerLabel: {
    marginRight: '12px',
  },
  datePickerInput: {
    border: 'unset',
    background: 'transparent',
    outline: 'none',
  },
  starIcon: {
    color: '#4472C4',
    fontSize: '20px'
  }
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getTodayAndTomorrow(date) {
  let today = new Date(date);
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  return {
    today: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}T00:00:00`,
    tomorrow: `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}T00:00:00`,
  };
}

const headCells = [
  { id: 'fullname', numeric: false, disablePadding: false, label: 'Khách hàng', maxWidth: 150 },
  { id: 'university', numeric: false, disablePadding: false, label: 'Dự án', maxWidth: 100 },
  { id: 'assess', numeric: false, disablePadding: false, label: 'Đánh giá', maxWidth: 150 },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email', maxWidth: 100 },
  { id: 'number_phone', numeric: false, disablePadding: false, label: 'SĐT', maxWidth: 100 },
  {
    id: 'consultation_day',
    numeric: false,
    disablePadding: false,
    label: 'Lịch tư vấn',
    maxWidth: 100,
  },
  { id: 'mentor', numeric: false, disablePadding: false, label: 'Mentor', maxWidth: 100 },
  { id: 'link', numeric: false, disablePadding: false, label: 'Link', maxWidth: 100 },
  { id: 'status', numeric: false, disablePadding: false, label: 'Trạng thái', maxWidth: 100 },
  { id: 'rating', numeric: false, disablePadding: false, label: 'Đánh giá', maxWidth: 100 },
  { id: 'total', numeric: false, disablePadding: false, label: 'Tổng số', maxWidth: 100 },
  { id: 'reject', numeric: false, disablePadding: false, label: 'Từ chối', maxWidth: 100 },
  { id: 'uncomplete', numeric: false, disablePadding: false, label: 'Chưa hoàn thành', maxWidth: 100 },
  { id: 'note', numeric: false, disablePadding: false, label: 'Chú thích', maxWidth: 100 },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    displayOptions,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map(
          (headCell) =>
            displayOptions[headCell.id] && (
              <TableCell
                key={headCell.id}
                align={headCell.numeric ? 'right' : 'left'}
                padding={headCell.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === headCell.id ? order : false}
                style={{ maxWidth: headCell.maxWidth }}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <span className={classes.visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            )
        )}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 2 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    numSelected,
    tableTitle,
    buttonBookingCancel,
    buttonBookingReview,
    buttonBookingHandled,
    handleCancelBooking,
    handleReviewBooking,
  } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} bản ghi được chọn
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h3" id="tableTitle" component="div">
          {tableTitle}
        </Typography>
      )}

      <Grid container justify="flex-end" spacing={gridSpacing}>
        {
          <>
            {buttonBookingHandled && (
              <Grid item>
                <Button
                  variant="contained"
                  color={buttonBookingHandled.style ? buttonBookingHandled.style : 'primary'}
                  style={{ background: '#FFC000' }}
                  onClick={() => { }}
                >
                  {buttonBookingHandled.text}
                </Button>
              </Grid>
            )}
            {buttonBookingCancel && (
              <Grid item>
                <Button
                  variant="contained"
                  color={buttonBookingCancel.style ? buttonBookingCancel.style : 'primary'}
                  style={{ background: '#FFC000' }}
                  onClick={handleCancelBooking}
                >
                  {buttonBookingCancel.text}
                </Button>
              </Grid>
            )}
            {buttonBookingReview && (
              <Grid item>
                <Button
                  variant="contained"
                  color={buttonBookingReview.style ? buttonBookingReview.style : 'primary'}
                  style={{ background: '#FFC000' }}
                  onClick={handleReviewBooking}
                >
                  {buttonBookingReview.text}
                </Button>
              </Grid>
            )}
          </>
        }
      </Grid>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: '56px',
  },
  paper: {
    width: '100%',
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    width: '100%',
  },
  search: {
    position: 'relative',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: '200px',
    maxWidth: '400px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
  },
  rowImages: {
    height: '40px',
    width: '60px',
  },
}));

export default function GeneralTable(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { setConfirmPopup } = useConfirmPopup();
  const { menu_buttons: menuButtons, columns: tableColumns, tabs } = useView();

  const dontHaveColumnSettings = !tableColumns || !tableColumns.length;
  const displayOptions = {
    fullname: dontHaveColumnSettings ? true : tableColumns.includes('fullname'),
    university: dontHaveColumnSettings ? true : tableColumns.includes('university'),
    assess: dontHaveColumnSettings ? true : tableColumns.includes('assess'),
    email: dontHaveColumnSettings ? true : tableColumns.includes('email'),
    number_phone: dontHaveColumnSettings ? true : tableColumns.includes('number_phone'),
    consultation_day: dontHaveColumnSettings ? true : tableColumns.includes('consultation_day'),
    link: dontHaveColumnSettings ? true : tableColumns.includes('link'),
    status: dontHaveColumnSettings ? true : tableColumns.includes('status'),
    mentor: dontHaveColumnSettings ? true : tableColumns.includes('mentor'),
    rating: dontHaveColumnSettings ? true : tableColumns.includes('rating'),
    total: dontHaveColumnSettings ? true : tableColumns.includes('total'),
    reject: dontHaveColumnSettings ? true : tableColumns.includes('reject'),
    uncomplete: dontHaveColumnSettings ? true : tableColumns.includes('uncomplete'),
    note: dontHaveColumnSettings ? true : tableColumns.includes('note'),
  };

  const buttonBookingCancel = menuButtons.find(
    (button) => button.name === view.booking.list.cancel
  );

  const buttonBookingReview = menuButtons.find(
    (button) => button.name === view.booking.list.review
  );

  const buttonBookingHandled = menuButtons.find(
    (button) => button.name === view.booking.list.handled
  );

  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [modalType, setModalType] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');
  const [university, setUniversity] = React.useState(null);
  const { url, documentType, categories = [], tableTitle, showPreviewUrl = true } = props;

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { flattenFolders, selectedFolder } = useSelector((state) => state.folder);

  const buttonSelectUniversity = selectedFolder.action === bookingActions.all_list;
  const buttonSelectSource = selectedFolder.action === bookingActions.handle_list;
  const buttonSelectDate = selectedFolder.action === bookingActions.by_date_list || selectedFolder.action === bookingActions.by_men;
  const buttonSelectMentor = selectedFolder.action === bookingActions.completed_list;

  const reduxDocuments = useSelector((state) => state.task);
  const {
    documents = [],
    total_item: count = 0,
    page = 1,
    order_by = '',
    order_type = 'desc',
    no_item_per_page = 10,
    category_id = '',
    search_text = '',
    folder_id,
    project_id,
    from_date = '',
    to_date = '',
  } = reduxDocuments[documentType] || {};

  const defaultQueries = {
    page: 1,
    order_by,
    order_type,
    no_item_per_page,
    category_id,
    search_text,
    from_date: getTodayAndTomorrow(Date.now()).today,
    to_date: getTodayAndTomorrow(Date.now()).tomorrow,
    university_id: '',
  };

  const { getDocuments } = useTask();

  const { getBookingDetail, cancelBooking, reviewBooking, getListUniversity } = useBooking();

  const initListUniversity = async () => {
    const data = await getListUniversity();
    setUniversity(data);
  }

  useEffect(() => {
    if (selectedProject && selectedFolder && url) {
      fetchDocument(url, documentType, selectedProject.id, selectedFolder.id);
    } else {
      dispatch({
        type: TASK_CHANGE,
        documentType,
        documents: [],
        total_item: count,
        page,
        order_by,
        order_type,
        no_item_per_page,
        search_text,
        category_id,
        folder_id,
        project_id,
        from_date,
        to_date,
      });
    }

    if (selectedFolder.action === bookingActions.all_list) {
      initListUniversity()
    }
  }, [selectedFolder]);

  const fetchDocument = (additionalQuery) => {
    const queries = { ...defaultQueries, ...additionalQuery };
    getDocuments(url, documentType, selectedProject.id, selectedFolder.id, queries);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = order_by === property && order_type === 'asc';
    fetchDocument(url, documentType, project_id, folder_id, {
      page: 1,
      order_by: property,
      order_type: isAsc ? 'desc' : 'asc',
      no_item_per_page,
      category_id,
      search_text,
    });
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = documents.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handlePressEnterToSearch = (event) => {
    if (event.key === 'Enter') {
      fetchDocument({ search_text: searchText });
    }
  };

  const handleDatePickerChange = (e) => {
    const { today, tomorrow } = getTodayAndTomorrow(e.target.value);
    fetchDocument({ from_date: today, to_date: tomorrow });
  };

  const handleChangeUniversity = (e) => {
    fetchDocument({ university_id: e.target.value });
  }

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    fetchDocument({ page: newPage + 1 });
  };

  const handleChangeRowsPerPage = (event) => {
    fetchDocument({ page: 1, no_item_per_page: event.target.value });
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const openDetailDocument = async (event, selectedDocument) => {
    event.stopPropagation();
    let detailDocument = null;
    if (documentType === 'booking') {
      detailDocument = await getBookingDetail(selectedDocument.id);
    }
    dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
    dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: true });
  };

  const reloadCurrentDocuments = () => {
    setSelected([]);
    fetchDocument({ page: 1 });
  };

  const handleOpenModal = (type) => {
    if (selected.length === 0) return;
    setIsOpenModal(true);
    setModalType(type);
  };

  const handleCancelBooking = async (data) => {
    try {
      await cancelBooking(selected[0], data.status, data.note);
    } catch (e) {

    } finally {
      setIsOpenModal(false);
      setModalType('');
      reloadCurrentDocuments();
    }
  };

  const handleReviewBooking = async (data) => {
    try {
      await reviewBooking(selected[0], data.status, data.note);
    } catch (e) {

    } finally {
      setIsOpenModal(false);
      setModalType('');
      reloadCurrentDocuments();
    }
  };

  return (
    <React.Fragment>
      <Modal
        isOpen={isOpenModal}
        handleClose={() => setIsOpenModal(false)}
        type={modalType}
        handleCancel={handleCancelBooking}
        handleReview={handleReviewBooking}
      />
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container justify="space-between">
            <Grid item lg={12} md={6} xs={12}>
              <Grid container spacing={gridSpacing} justify="flex-end" alignItems="center">
                <Grid item xs={12} md={6} lg={6}>
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <SearchTwoToneIcon />
                    </div>
                    <InputBase
                      placeholder="Tìm kiếm từ khoá...."
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      onChange={(event) => setSearchText(event.target.value)}
                      onKeyDown={handlePressEnterToSearch}
                      inputProps={{ 'aria-label': 'search' }}
                    />
                  </div>
                </Grid>
                {buttonSelectDate && (
                  <Grid style={style.datePickerWrap} item xs={12} md={6} lg={6}>
                    <div style={style.datePickerLabel}>Chọn thời gian: </div>
                    <input
                      style={style.datePickerInput}
                      type="date"
                      name="selected_date"
                      onChange={handleDatePickerChange}
                    />
                  </Grid>
                )}
                {buttonSelectUniversity && (
                  <Grid style={style.datePickerWrap} item xs={12} md={2} lg={6}>
                    <div style={style.datePickerLabel}>Chọn dự án: </div>
                    <select id="universityList" onChange={handleChangeUniversity} style={style.datePickerInput}>
                      <option value="">Tất cả</option>
                      {university?.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </select>
                  </Grid>
                )}
                {buttonSelectMentor && (
                  <Grid style={style.datePickerWrap} item xs={12} md={2} lg={6}>
                    <div style={style.datePickerLabel}>Chọn Mentor: </div>
                    <select style={style.datePickerInput}>
                      <option>Tất cả</option>
                    </select>
                  </Grid>
                )}
                {buttonSelectSource && (
                  <Grid style={style.datePickerWrap} item xs={12} md={2} lg={6}>
                    <div style={style.datePickerLabel}>Chọn nguồn: </div>
                    <select style={style.datePickerInput}>
                      <option>Tất cả</option>
                    </select>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Card className={classes.root}>
            <Divider />
            <Paper className={classes.paper}>
              <EnhancedTableToolbar
                numSelected={selected.length}
                tableTitle={tableTitle}
                buttonBookingCancel={buttonBookingCancel}
                buttonBookingReview={buttonBookingReview}
                buttonBookingHandled={buttonBookingHandled}
                handleCancelBooking={() => handleOpenModal('cancel')}
                handleReviewBooking={() => handleOpenModal('review')}
              />
              <TableContainer>
                <Table
                  stickyHeader
                  className={classes.table}
                  aria-labelledby="tableTitle"
                  size={'medium'}
                // aria-label="enhanced table"
                >
                  <EnhancedTableHead
                    classes={classes}
                    numSelected={selected.length}
                    order={order_type}
                    orderBy={order_by}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={documents.length}
                    displayOptions={displayOptions}
                  />
                  <TableBody>
                    {stableSort(documents || [], getComparator(order, orderBy)).map(
                      (row, index) => {
                        const isItemSelected = isSelected(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, row.id)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.id}
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                inputProps={{ 'aria-labelledby': labelId }}
                              />
                            </TableCell>
                            {displayOptions.fullname && (
                              <TableCell align="left">
                                {tabs.length ? (
                                  <>
                                    <a href="#" onClick={(event) => openDetailDocument(event, row)}>
                                      {row.fullname}
                                    </a>
                                    &nbsp;&nbsp;

                                  </>
                                ) : <>
                                  {row.fullname} &nbsp;&nbsp;
                                </>
                                }
                              </TableCell>
                            )}
                            {displayOptions.university && (
                              <TableCell align="left">{row.university_name || ''}</TableCell>
                            )}
                            {displayOptions.assess && (
                              <TableCell align="left">
                                {new Array(5).fill(1)?.map((_, index) => (
                                  <StarIcon key={index} style={style.starIcon} />
                                ))}
                              </TableCell>
                            )}
                            {displayOptions.email && (
                              <TableCell align="left">{row.email_address || ''}</TableCell>
                            )}
                            {displayOptions.number_phone && (
                              <TableCell align="left">{row.number_phone || ''}</TableCell>
                            )}
                            {displayOptions.consultation_day && (
                              <TableCell align="left">{row.schedule || ''}</TableCell>
                            )}
                            {displayOptions.mentor && (
                              <TableCell align="left">{row.mentor_name || ''}</TableCell>
                            )}
                            {displayOptions.link && (
                              <TableCell align="left">{row.link_meeting || ''}</TableCell>
                            )}
                            {displayOptions.status && (
                              <TableCell align="left">{row.status}</TableCell>
                            )}
                            {displayOptions.rating && (
                              <TableCell align="left">{row.rating}</TableCell>
                            )}
                            {displayOptions.total && (
                              <TableCell align="left">{row.total}</TableCell>
                            )}
                            {displayOptions.reject && (
                              <TableCell align="left">{row.reject}</TableCell>
                            )}
                            {displayOptions.uncomplete && (
                              <TableCell align="left">{row.uncomplete}</TableCell>
                            )}
                            {displayOptions.note && (
                              <TableCell align="left">{row.status}</TableCell>
                            )}
                          </TableRow>
                        );
                      }
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 15, 20]}
                component="div"
                rowsPerPage={no_item_per_page}
                labelRowsPerPage="Số tài liệu mỗi trang"
                count={count}
                page={page - 1}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Paper>
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
