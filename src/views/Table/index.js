import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { Grid, Card, Button, Checkbox, Tooltip } from '@material-ui/core';
// import Breadcrumb from './../../component/Breadcrumb';
import Modal from '../Table/Modal';
import CachedIcon from '@material-ui/icons/Cached';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import StarIcon from '@material-ui/icons/Star';
import SearchIcon from '@material-ui/icons/Search';
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
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { bookingActions, gridSpacing, view } from '../../store/constant';
import { useSelector, useDispatch } from 'react-redux';
import useTask from './../../hooks/useTask';
import useConfirmPopup from './../../hooks/useConfirmPopup';
import useView from './../../hooks/useView';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import useOnClickOutSide from './../../hooks/useClickOutSide';

import { FLOATING_MENU_CHANGE, DOCUMENT_CHANGE, TASK_CHANGE } from '../../store/actions';
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
  { id: 'id', numeric: false, disablePadding: false, label: 'Mã đăng ký', maxWidth: 150 },
  { id: 'fullname', numeric: false, disablePadding: false, label: 'Khách hàng', maxWidth: 150 },
  { id: 'university_name', numeric: false, disablePadding: false, label: 'Trường', maxWidth: 100 },
  { id: 'assess', numeric: true, disablePadding: false, label: 'Đánh giá', maxWidth: 150 },
  { id: 'email_address', numeric: false, disablePadding: false, label: 'Email', maxWidth: 100 },
  { id: 'number_phone', numeric: false, disablePadding: false, label: 'SĐT', maxWidth: 100 },
  {
    id: 'schedule',
    numeric: false,
    disablePadding: false,
    label: 'Lịch tư vấn',
    maxWidth: 100,
  },
  { id: 'mentor_name', numeric: false, disablePadding: false, label: 'Mentor', maxWidth: 100 },
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
    maxWidth: 150,
  },
  { id: 'note', numeric: false, disablePadding: false, label: 'Chú thích', maxWidth: 100 },
  { id: 'menuButtons', numeric: false, disablePadding: false, label: '', maxWidth: 150 },
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
            style={{ position: 'relative !important' }}
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
                style={{ maxWidth: headCell.maxWidth, position: 'relative' }}
              >
                {headCell.id === 'menuButtons' ? (
                  <></>
                ) : (
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
                )}
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
  toolButtonWrap: {
    position: 'relative',
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
  toolButtonActive: {
    color: '#36f',
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
  toolColumn: {
    zIndex: '9999',
    position: 'absolute',
    top: '32px',
    right: 0,
    minWidth: '200px',
    background: '#FFFFFF',
    transform: 'translateX(60px)',
    padding: '4px 12px 0 24px',
    boxShadow:
      '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
    borderRadius: '10px',
  },
  toolColumnTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& > div': {
      fontWeight: 500,
    },
  },
  toolColumnBody: {
    paddingRight: '12px',
    marginLeft: '-12px',
    maxHeight: '190px',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  toolColumnNameWrap: {
    display: 'flex',
    alignItems: 'center',
  },
  toolFilter: {
    transform: 'unset',
    minWidth: '380px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  toolFilterTitle: {
    justifyCentent: 'space-between',
  },
  toolFilterTitleBlock: {
    display: 'flex',
    alignItems: 'center',
  },
  toolFilterBody: {
    maxHeight: 'unset',
    minHeight: '180px',
    marginTop: '16px',
    marginLeft: 'unset',
    flex: 1,
  },
  toolResetButton: {
    borderRadius: 'unset',
    fontSize: '12px',
    padding: '6px 8px',
    marginLeft: '16px',
    '&:hover': {
      color: '#36f',
    },
  },
  toolFilterItem: {
    width: '100%',
    padding: '16px 0',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    numSelected,
    handlePressEnterToSearch,
    handleShowColumn,
    handleFilterChange,
    displayOptions,
    getListUniversity,
    data,
  } = props;

  const filterRef = useRef(null);
  // useOnClickOutSide(filterRef, () => {
  //   setIsOpenFilter(false);
  // });

  const [columnNames, setColumnNames] = React.useState();
  const [isOpenSearch, setIsOpenSearch] = React.useState(false);
  const [isOpenShowColumn, setIsOpenShowColumn] = React.useState(false);
  const [isOpenFilter, setIsOpenFilter] = React.useState(false);
  const [universityList, setUniversityList] = React.useState([]);
  const [statusList] = React.useState([
    {
      id: 'Đang diễn ra',
      name: 'Đang diễn ra',
    },
    {
      id: 'Khách hàng chưa xác nhận',
      name: 'Khách hàng chưa xác nhận',
    },
    {
      id: 'Meeting gián đoạn',
      name: 'Meeting gián đoạn',
    },
    {
      id: 'Đã hoàn thành',
      name: 'Đã hoàn thành',
    },
    {
      id: 'Chờ khách hàng',
      name: 'Chờ khách hàng',
    },
  ]);
  const [filter, setFilter] = React.useState({
    university_id: '',
    status: '',
    search_text: '',
  });

  const handleCloseInput = () => {
    if (isOpenSearch) handleFilterChange({ ...filter, search_text: '' });
    setIsOpenSearch(!isOpenSearch);
  };

  const handleChangeSearch = (e) => {
    setFilter({ ...filter, search_text: e.target.value });
  };

  const handleEnterSearch = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      handleFilterChange(filter);
    }
  };

  const handleResetFilter = () => {
    setFilter((pre) => ({
      ...pre,
      university_id: '',
      status: '',
    }));
    handleFilterChange({
      ...filter,
      university_id: '',
      status: '',
    });
  };

  const handleChangeColumnName = (index, id) => {
    const newColumnNames = JSON.parse(JSON.stringify(columnNames));
    const newState = !newColumnNames[index].isSelected;
    newColumnNames[index].isSelected = newState;
    handleShowColumn(id, newState);
    setColumnNames((pre) => newColumnNames);
  };

  const handleChangeFilter = (event) => {
    const newFilter = { ...filter, [event.target.name]: event.target.value };
    setFilter(newFilter);
    handleFilterChange(newFilter);
  };

  const handleRefresh = () => {
    handleFilterChange({
      university_id: '',
      status: '',
      search_text: '',
    });
    setFilter({
      university_id: '',
      status: '',
      search_text: '',
    })
  }

  useEffect(() => {
    async function initUniversityList() {
      const data = await getListUniversity();
      setUniversityList(data);
    }
    initUniversityList();
  }, []);

  useEffect(() => {
    if (data.length) {
      const keysData = Object.keys(data[0]);
      const newColumnNames = headCells.reduce((pre, { id, label }) => {
        if (keysData.includes(id)) {
          return [...pre, { id, label, isSelected: displayOptions[id] }];
        } else return pre;
      }, []);
      setColumnNames(newColumnNames);
      return;
    }
    setColumnNames(
      headCells.reduce((pre, { id, label }) => {
        return id !== 'menuButtons' && displayOptions[id]
          ? [...pre, { id, label, isSelected: displayOptions[id] }]
          : pre;
      }, [])
    );
  }, [displayOptions, data]);

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
                  value={filter.search_text}
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
            <Tooltip title="Search">
              <Button
                className={`${classes.toolButton} ${isOpenSearch ? classes.toolButtonActive : ''}`}
                onClick={handleCloseInput}
              >
                <SearchIcon className={classes.toolButtonIcon} />
              </Button>
            </Tooltip>
            <ClickAwayListener onClickAway={() => setIsOpenShowColumn(false)}>
              <div className={classes.toolButtonWrap}>
                <Tooltip title="View Columns">
                  <Button
                    className={`${classes.toolButton} ${isOpenShowColumn ? classes.toolButtonActive : ''
                      }`}
                    onClick={() => setIsOpenShowColumn(!isOpenShowColumn)}
                  >
                    <ViewColumnIcon className={classes.toolButtonIcon} />
                  </Button>
                </Tooltip>
                {isOpenShowColumn && (
                  <div className={classes.toolColumn}>
                    <div className={classes.toolColumnTitle}>
                      <div>Show Columns</div>
                      <Button
                        className={classes.toolButtonSearch}
                        onClick={() => setIsOpenShowColumn(false)}
                      >
                        <ClearIcon className={classes.toolButtonIcon} />
                      </Button>
                    </div>
                    <div className={classes.toolColumnBody}>
                      {columnNames.map((columnName, index) => (
                        <div key={columnName.id} className={classes.toolColumnNameWrap}>
                          <Checkbox
                            checked={columnName.isSelected}
                            onChange={() => handleChangeColumnName(index, columnName.id)}
                            style={{ position: 'relative !important' }}
                          />
                          <span>{columnName.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ClickAwayListener>
            <div ref={filterRef} className={classes.toolButtonWrap}>
              <Tooltip title="Filter Table">
                <Button
                  className={classes.toolButton}
                  onClick={() => setIsOpenFilter(!isOpenFilter)}
                >
                  <FilterListIcon className={classes.toolButtonIcon} />
                </Button>
              </Tooltip>
              {isOpenFilter && (
                <div className={`${classes.toolColumn} ${classes.toolFilter}`}>
                  <div className={`${classes.toolColumnTitle} ${classes.toolFilterTitle}`}>
                    <div className={classes.toolFilterTitleBlock}>
                      <div>Filters</div>
                      <Button
                        className={`${classes.toolButtonSearch} ${classes.toolResetButton}`}
                        onClick={handleResetFilter}
                      >
                        Reset
                      </Button>
                    </div>
                    <Button
                      className={classes.toolButtonSearch}
                      onClick={() => setIsOpenFilter(false)}
                    >
                      <ClearIcon className={classes.toolButtonIcon} />
                    </Button>
                  </div>
                  <div className={`${classes.toolColumnBody} ${classes.toolFilterBody}`}>
                    <div className={classes.toolFilterItem}>
                      <FormControl fullWidth>
                        <InputLabel shrink id="university-label">
                          Trường
                        </InputLabel>
                        <Select
                          labelId="university-label"
                          id="univeristy_id"
                          onChange={handleChangeFilter}
                          displayEmpty
                          name="university_id"
                          value={filter.university_id}
                        >
                          <MenuItem value="">Tất cả</MenuItem>
                          {universityList?.map((university, index) => (
                            <MenuItem key={index} value={university.id}>
                              {university.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className={classes.toolFilterItem}>
                      <FormControl fullWidth>
                        <InputLabel shrink id="status-label">
                          Trạng thái
                        </InputLabel>
                        <Select
                          labelId="status-label"
                          id="status_id"
                          onChange={handleChangeFilter}
                          displayEmpty
                          name="status"
                          value={filter.status}
                        >
                          <MenuItem value="">Tất cả</MenuItem>
                          {statusList?.map((status, index) => (
                            <MenuItem key={index} value={status.id}>
                              {status.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Tooltip title="Refresh">
              <Button
                className={`${classes.toolButton} ${isOpenSearch ? classes.toolButtonActive : ''}`}
                onClick={handleRefresh}
              >
                <CachedIcon className={classes.toolButtonIcon} />
              </Button>
            </Tooltip>
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
    boxShadow: 'unset',
    height: '100%',
  },
  paper: {
    width: '100%',
    backgroundColor: '#f0f2f8',
    paddingBottom: '56px',
    minHeight: '320px',
  },
  table: {
    minWidth: 750,
    borderSpacing: '0 10px',
    '& > thead': {
      background: '#FFFFFF',
    },
    '& > thead > tr > th': {
      background: 'unset',
      position: 'relative !important',
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
  tableItemID: {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  },
  handleButtonWrap: {
    display: 'flex',
    alignItems: 'center',
  },
  handleButton: {
    height: '34px',
    width: '34px',
    margin: '0 4px',
    padding: '12px',
    color: '#FFFFFF',
    minWidth: '34px',
    borderRadius: '50%',
    background: '#36f',
    boxShadow:
      '0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%)',
    '&:hover': {
      background: '#0043a9',
    },
  },
  handleButtonCancel: {
    background: '#425466',
    '&:hover': {
      background: '#272f33',
    },
  },
  handleButtonIcon: {
    fontSize: '20px',
    width: '20px',
  },
  waitingStatus: {
    background: 'rgba(47, 210, 17, 0.8) !important',
  },
  handleStatus: {
    background: 'rgb(255 168 8 / 80%) !important',
    color: '#000000 !important',
  },
  cancelStatus: {
    background: 'rgb(171 0 0 / 80%) !important',
  },
  completedStatus: {
    background: '#36f',
  },
}));

export default function GeneralTable(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { setConfirmPopup } = useConfirmPopup();
  const { menu_buttons: menuButtons, columns: tableColumns, tabs } = useView();
  const [displayOptions, setDisplayOptions] = React.useState({});
  const { flattenFolders, selectedFolder } = useSelector((state) => state.folder);

  useEffect(() => {
    setDisplayOptions({
      id: selectedFolder.action !== bookingActions.by_mentor_list,
      fullname: tableColumns.includes('fullname'),
      university_name: tableColumns.includes('university'),
      assess: tableColumns.includes('assess'),
      email_address: tableColumns.includes('email'),
      number_phone: tableColumns.includes('number_phone'),
      schedule: tableColumns.includes('consultation_day'),
      link: false,
      status: tableColumns.includes('status'),
      mentor_name: tableColumns.includes('mentor'),
      rating: tableColumns.includes('rating'),
      total: tableColumns.includes('total'),
      reject: tableColumns.includes('reject'),
      uncomplete: tableColumns.includes('uncomplete'),
      note: tableColumns.includes('note'),
      menuButtons: !!menuButtons.length || false,
    });
  }, [tableColumns, selectedFolder]);

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
  const [university, setUniversity] = React.useState(null);
  const { url, documentType, tableTitle, showPreviewUrl = true } = props;

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);

  const buttonSelectUniversity = selectedFolder.action === bookingActions.all_list;
  const buttonSelectSource = selectedFolder.action === bookingActions.handle_list;
  const buttonSelectDate =
    selectedFolder.action === bookingActions.by_date_list ||
    selectedFolder.action === bookingActions.by_mentor_list;
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
    status = '',
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
    status: '',
  };

  const { getDocuments } = useTask();

  const {
    getBookingDetail,
    cancelBooking,
    reviewBooking,
    setCompletedBooking,
    getListUniversity,
  } = useBooking();

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

  const handleOpenModal = (type, booking) => {
    setSelected((pre) => [...new Set([booking, ...pre])]);
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

  const handleSetCompletedBooking = async (id) => {
    try {
      await setCompletedBooking(id);
    } catch (e) {
    } finally {
      setIsOpenModal(false);
      setModalType('');
      reloadCurrentDocuments();
    }
  };

  const handleShowColumn = (id, newState) => {
    setDisplayOptions((pre) => ({ ...pre, [id]: newState }));
  };

  const handleFilterChange = (data) => {
    fetchDocument(data);
  };

  const getStatusType = () => {
    switch (selectedFolder.action) {
      case bookingActions.all_list:
        return 'waitingStatus';
      case bookingActions.handle_list:
        return 'handleStatus';
      case bookingActions.cancel_list:
        return 'cancelStatus';
      case bookingActions.completed_list:
        return 'completedStatus';
      default:
        return 'completedStatus';
    }
  };

  const formatDateTime = (datetime) => {
    if(datetime) {
      const date = new Date(datetime);
      return date.getDate() 
      +  "/" + (date.getMonth() + 1) 
      + "/"+ date.getFullYear() 
      + " " +  (date.getHours() < 10 ? "0" + date.getHours() : date.getHours())
      + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
    }
    return ""
  }

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
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} style={style.tableTitleWrap}>
          <Grid item xs={6}>
            <div style={style.tableTitle}>{tableTitle}</div>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Card className={classes.root}>
            <Paper className={classes.paper}>
              <EnhancedTableToolbar
                numSelected={selected.length}
                tableTitle={tableTitle}
                handlePressEnterToSearch={handlePressEnterToSearch}
                handleFilterChange={handleFilterChange}
                handleShowColumn={handleShowColumn}
                displayOptions={displayOptions}
                data={stableSort(documents || [], getComparator(order, orderBy))}
                getListUniversity={getListUniversity}
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
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.id}
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                onClick={(event) => handleClick(event, row.id)}
                                checked={isItemSelected}
                                inputProps={{ 'aria-labelledby': labelId }}
                              />
                            </TableCell>
                            {displayOptions.id && (
                              <TableCell align="left">
                                <div
                                  className={classes.tableItemID}
                                  onClick={(event) => openDetailDocument(event, row)}
                                >
                                  <div>{row.id}</div>
                                  <div>{formatDateTime(row.created_date)}</div>
                                </div>
                              </TableCell>
                            )}
                            {displayOptions.fullname && (
                              <TableCell align="left">
                                <>
                                  <span
                                    className={classes.tableItemName}
                                    onClick={(event) => openDetailDocument(event, row)}
                                  >
                                    {row.fullname}
                                  </span>
                                  &nbsp;&nbsp;
                                </>
                              </TableCell>
                            )}
                            {displayOptions.university_name && (
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
                            {displayOptions.email_address && (
                              <TableCell align="left">{row.email_address || ''}</TableCell>
                            )}
                            {displayOptions.number_phone && (
                              <TableCell align="left">{row.number_phone || ''}</TableCell>
                            )}
                            {displayOptions.schedule && (
                              <TableCell align="left">{row.schedule || ''}</TableCell>
                            )}
                            {displayOptions.mentor_name && (
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
                              <TableCell align="left">
                                <span style={style.statusWrap} className={classes[getStatusType()]}>
                                  {row.status}
                                </span>
                              </TableCell>
                            )}
                            {displayOptions.rating && (
                              <TableCell align="left">
                                {(!isNaN(row.rating) && row.rating) > 0 && (
                                  <div style={style.ratingWrap}>
                                    <span>{row.rating}</span>
                                    <StarIcon style={style.starIcon} />
                                  </div>
                                )}
                              </TableCell>
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
                            {displayOptions.menuButtons && (
                              <TableCell align="left">
                                <div className={classes.handleButtonWrap}>
                                  {(buttonBookingHandled && row.is_can_completed) && (
                                    <Tooltip title={buttonBookingHandled.text}>
                                      <Button
                                        className={classes.handleButton}
                                        onClick={() => handleSetCompletedBooking(row.id)}
                                      >
                                        <DoneAllIcon className={classes.handleButtonIcon} />
                                      </Button>
                                    </Tooltip>
                                  )}
                                  {buttonBookingReview && (
                                    <Tooltip title={buttonBookingReview.text}>
                                      <Button
                                        className={classes.handleButton}
                                        onClick={() => handleOpenModal('review', row.id)}
                                      >
                                        <DoneAllIcon className={classes.handleButtonIcon} />
                                      </Button>
                                    </Tooltip>
                                  )}
                                  {(buttonBookingCancel && row.is_can_cancel) && (
                                    <Tooltip title={buttonBookingCancel.text}>
                                      <Button
                                        className={`${classes.handleButton} ${classes.handleButtonCancel}`}
                                        onClick={() => handleOpenModal('cancel', row.id)}
                                      >
                                        <DeleteOutlineIcon className={classes.handleButtonIcon} />
                                      </Button>
                                    </Tooltip>
                                  )}
                                </div>
                              </TableCell>
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
