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
  Tooltip,
} from '@material-ui/core';
// import Breadcrumb from './../../component/Breadcrumb';
import Modal from '../Table/Modal';
import StarIcon from '@material-ui/icons/Star';
import SearchIcon from '@material-ui/icons/Search';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import FilterListIcon from '@material-ui/icons/FilterList';
import ClearIcon from '@material-ui/icons/Clear';
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
import { customClasses, style } from './style';

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
  {
    id: 'uncomplete',
    numeric: false,
    disablePadding: false,
    label: 'Chưa hoàn thành',
    maxWidth: 100,
  },
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
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
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
  toolButton: {
    margin: '0 4px',
    padding: '12px',
    color: 'rgba(0, 0, 0, 0.54)',
    minWidth: '40px',
    borderRadius: '50%',
    '&:hover': {
      color: '#36f',
    },
  },
  toolButtonIcon: {
    fontSize: '20px',
    width: '20px',
  },
  toolSearchWrap: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    padding: '8px 12px !important',
  },
  toolSearchInput: {
    border: 'unset',
    borderBottom: '1px solid rgb(18, 23, 30)',
    color: '#12171e',
    width: '100%',
    outline: 'none',
    fontSize: '14px',
    marginLeft: '8px',
    padding: '6px 0',
    background: 'transparent',
    transform: 'translateY(-6px)',
    '&:hover': {
      borderColor: '#000',
    },
    '&:focus': {
      borderColor: '#3467FF',
      borderWidth: '2px',
    },
  },
  toolButtonSearch: {
    padding: '12px',
    color: 'rgba(0, 0, 0, 0.54)',
    minWidth: '40px',
    borderRadius: '50%',
    '&:hover': {
      color: '#FF413A',
    },
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    numSelected,
    buttonBookingCancel,
    buttonBookingReview,
    buttonBookingHandled,
    handleCancelBooking,
    handleReviewBooking,
    handlePressEnterToSearch,
  } = props;

  const [searchValue, setSearchValue] = React.useState('');
  const [isOpenSearch, setIsOpenSearch] = React.useState(true);

  const handleCloseInput = () => {
    // setIsOpenSearch(!isOpenSearch);
    handlePressEnterToSearch('');
    setSearchValue('');
  };

  const handleChangeSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleEnterSearch = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      handlePressEnterToSearch(searchValue);
    }
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <Grid container justify="flex-end" spacing={gridSpacing}>
        <Grid item lg={6} md={6} xs={12} className={classes.toolSearchWrap}>
          {numSelected > 0 ? (
            <Typography
              className={classes.title}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {numSelected} bản ghi được chọn
            </Typography>
          ) : (
            isOpenSearch && (
              <div className={classes.toolSearchWrap}>
                <SearchIcon />
                <input
                  className={classes.toolSearchInput}
                  value={searchValue}
                  onChange={handleChangeSearch}
                  onKeyUp={handleEnterSearch}
                />
                <Button className={classes.toolButtonSearch} onClick={handleCloseInput}>
                  <ClearIcon className={classes.toolButtonIcon} />
                </Button>
              </div>
            )
          )}
        </Grid>
        <Grid item lg={6} md={6} xs={12} className={classes.toolSearchWrap}>
          <Grid container justify="flex-end">
            <>
              {buttonBookingHandled && (
                <Grid item>
                  <Button
                    variant="contained"
                    color={buttonBookingHandled.style ? buttonBookingHandled.style : 'primary'}
                    style={{ background: '#FFC000', marginLeft: '8px' }}
                    onClick={() => {}}
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
                    style={{ background: '#FFC000', marginLeft: '8px' }}
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
                    style={{ background: '#FFC000', marginLeft: '8px' }}
                    onClick={handleReviewBooking}
                  >
                    {buttonBookingReview.text}
                  </Button>
                </Grid>
              )}
            </>
            {/* <Tooltip title="Search">
              <Button className={classes.toolButton} onClick={handleCloseInput} >
                <SearchIcon className={classes.toolButtonIcon} />
              </Button>
            </Tooltip>
            <Tooltip title="Download">
              <Button className={classes.toolButton}>
                <CloudDownloadIcon className={classes.toolButtonIcon} />
              </Button>
            </Tooltip>
            <Tooltip title="View Columns">
              <Button className={classes.toolButton} >
                <ViewColumnIcon className={classes.toolButtonIcon} />
              </Button>
            </Tooltip>
            <Tooltip title="Filter Table">
              <Button className={classes.toolButton} >
                <FilterListIcon className={classes.toolButtonIcon} />
              </Button>
            </Tooltip> */}
          </Grid>
        </Grid>
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
    boxShadow: 'unset',
  },
  paper: {
    width: '100%',
    backgroundColor: '#f0f2f8',
  },
  table: {
    minWidth: 750,
    borderSpacing: '0 10px',
    '& > thead': {
      background: '#FFFFFF',
    },
    '& > thead > tr > th': {
      background: 'unset',
    },
    '& > tbody > tr:hover': {
      backgroundColor: '#36f !important',
    },
    '& > tbody > tr:hover td': {
      color: '#FFF',
    },
    '& > tbody > tr:hover td span': {
      color: '#FFF',
    },
    '& > tbody > tr:hover td span': {
      color: '#FFF',
    },
    '& > tbody > tr:hover td svg': {
      fill: '#FFF',
    },
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
  tableRow: {
    background: '#fff',
    boxShadow: '0 2px 6px -1px rgb(0 0 0 / 10%)',
  },
  tableItemName: {
    fontWeight: 'bold',
    cursor: 'pointer',
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
  const buttonSelectDate =
    selectedFolder.action === bookingActions.by_date_list ||
    selectedFolder.action === bookingActions.by_men;
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
  };

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
      initListUniversity();
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

  const handlePressEnterToSearch = (text) => {
    fetchDocument({ search_text: text });
  };

  const handleDatePickerChange = (e) => {
    const { today, tomorrow } = getTodayAndTomorrow(e.target.value);
    fetchDocument({ from_date: today, to_date: tomorrow });
  };

  const handleChangeUniversity = (e) => {
    fetchDocument({ university_id: e.target.value });
  };

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
        selectedBooking={selected[0]}
      />
      <Grid container spacing={gridSpacing} style={style.tableTitleWrap}>
        <Grid item xs={6}>
          <div style={style.tableTitle}>{tableTitle}</div>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={gridSpacing} justify="flex-end" alignItems="center">
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
                <div style={style.datePickerLabel}>Chọn trường: </div>
                <select
                  id="universityList"
                  onChange={handleChangeUniversity}
                  style={style.datePickerInput}
                >
                  <option value="">Tất cả</option>
                  {university?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
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
        <Grid item xs={12}>
          <Card className={classes.root}>
            <Paper className={classes.paper}>
              <EnhancedTableToolbar
                numSelected={selected.length}
                tableTitle={tableTitle}
                handlePressEnterToSearch={handlePressEnterToSearch}
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
                            className={classes.tableRow}
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
                                    <span
                                      className={classes.tableItemName}
                                      onClick={(event) => openDetailDocument(event, row)}
                                    >
                                      {row.fullname}
                                    </span>
                                    &nbsp;&nbsp;
                                  </>
                                ) : (
                                  <>
                                    <span className={classes.tableItemName}>{row.fullname}</span>
                                    &nbsp;&nbsp;
                                  </>
                                )}
                              </TableCell>
                            )}
                            {displayOptions.university && (
                              <TableCell align="left">{row.university_name || ''}</TableCell>
                            )}
                            {displayOptions.assess && (
                              <TableCell align="left">
                                {(!isNaN(row.assess) && row.assess) > 0 && (
                                  <div style={style.assessWrap}>
                                    <span>{row.assess}</span>
                                    <StarIcon style={style.starIcon} />
                                  </div>
                                )}
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
                              <TableCell align="left">
                                <a
                                  style={style.meetingLink}
                                  href={row.link_meeting || '#'}
                                  target="_blank"
                                >
                                  {row.link_meeting || ''}
                                </a>
                              </TableCell>
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
                            {displayOptions.note && <TableCell align="left">{row.note}</TableCell>}
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
