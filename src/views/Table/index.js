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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { gridSpacing, view } from '../../store/constant';
import { useSelector, useDispatch } from 'react-redux';
import { format as formatDate } from 'date-fns';
import useTask from './../../hooks/useTask';
import useConfirmPopup from './../../hooks/useConfirmPopup';
import useView from './../../hooks/useView';
import {
  FLOATING_MENU_CHANGE,
  DOCUMENT_CHANGE,
  TASK_CHANGE,
  SELECTED_FOLDER_CHANGE,
  CONFIRM_CHANGE,
} from '../../store/actions';
import axiosInstance from '../../services/axios';
import useBooking from './../../hooks/useBooking';

async function setFeaturedNew(setFeaturedUrl, documentId, isFeatured) {
  return await axiosInstance
    .post(setFeaturedUrl, { outputtype: 'RawJson', id: documentId, value: isFeatured })
    .then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      else return false;
    });
}

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

const headCells = [
  { id: 'fullname', numeric: false, disablePadding: false, label: 'Họ và tên', maxWidth: 150 },
  { id: 'phone', numeric: false, disablePadding: false, label: 'SĐT', maxWidth: 100 },
  { id: 'consultant', numeric: false, disablePadding: false, label: 'Mentor', maxWidth: 100 },
  {
    id: 'consultation_day',
    numeric: false,
    disablePadding: false,
    label: 'Lịch tư vấn',
    maxWidth: 100,
  },
  { id: 'created_date', numeric: false, disablePadding: false, label: 'Ngày tạo', maxWidth: 100 },
  { id: 'status', numeric: false, disablePadding: false, label: 'Trạng thái', maxWidth: 100 },
  { id: 'link', numeric: false, disablePadding: false, label: 'Link Meeting', maxWidth: 100 },
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

    buttonSetBookingDraft,
    recallBookings,
    buttonSetBookingReviewed,
    submitBookings,
    buttonSetBookingCompleted,
    approveBookings,
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
            {buttonSetBookingDraft && (
              <Grid item>
                <Button
                  variant="contained"
                  color={buttonSetBookingDraft.style ? buttonSetBookingDraft.style : 'primary'}
                  onClick={recallBookings}
                >
                  {buttonSetBookingDraft.text}
                </Button>
              </Grid>
            )}
            {buttonSetBookingReviewed && (
              <Grid item>
                <Button
                  variant="contained"
                  color={
                    buttonSetBookingReviewed.style ? buttonSetBookingReviewed.style : 'primary'
                  }
                  onClick={submitBookings}
                >
                  {buttonSetBookingReviewed.text}
                </Button>
              </Grid>
            )}
            {buttonSetBookingCompleted && (
              <Grid item>
                <Button
                  variant="contained"
                  color={
                    buttonSetBookingCompleted.style ? buttonSetBookingCompleted.style : 'primary'
                  }
                  onClick={approveBookings}
                >
                  {buttonSetBookingCompleted.text}
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
  const { menu_buttons: menuButtons, columns: tableColumns } = useView();

  const dontHaveColumnSettings = !tableColumns || !tableColumns.length;
  const displayOptions = {
    fullname: dontHaveColumnSettings ? true : tableColumns.includes('fullname'),
    start_time: dontHaveColumnSettings ? true : tableColumns.includes('start_time'),
    phone: dontHaveColumnSettings ? true : tableColumns.includes('number_phone'),
    consultant: dontHaveColumnSettings ? true : tableColumns.includes('consultant'),
    consultation_day: dontHaveColumnSettings ? true : tableColumns.includes('consultation_day'),
    link: dontHaveColumnSettings ? true : tableColumns.includes('link'),
    status: dontHaveColumnSettings ? true : tableColumns.includes('status'),
  };

  const buttonSetBookingDraft = menuButtons.find(
    (button) => button.name === view.booking.list.recall
  );
  const buttonSetBookingReviewed = menuButtons.find(
    (button) => button.name === view.booking.list.submit
  );
  const buttonSetBookingCompleted = menuButtons.find(
    (button) => button.name === view.booking.list.approve_pending
  );

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [category, setCategory] = React.useState(null);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [searchText, setSearchText] = React.useState('');
  const {
    url,
    documentType,
    categories = [],
    tableTitle,
    showPreviewUrl = true,
  } = props;

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { flattenFolders, selectedFolder } = useSelector((state) => state.folder);
  const parentFolder = flattenFolders.find((folder) => folder.id === selectedFolder.parent_id);

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
    career_id = '',
    folder_id,
    project_id,
  } = reduxDocuments[documentType] || {};

  const defaultQueries = {
    career_id,
    page: 1,
    order_by,
    order_type,
    no_item_per_page,
    category_id,
    search_text,
  };

  function handleBackToParentFolder() {
    dispatch({ type: SELECTED_FOLDER_CHANGE, selectedFolder: parentFolder });
  }

  const { getDocuments } = useTask();

  const { setBookingDraft, setBookingReviewed, setBookingCompleted, getBookingDetail } =
    useBooking();

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
      });
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

  const handleClicksort = (event) => {
    setCategory(event.currentTarget);
  };

  const handleCloseCategory = (event) => {
    setCategory(null);
    const selectedCategory = categories.find(
      (category) => category.id === event.target.getAttribute('value')
    );
    setSelectedCategory(selectedCategory);
    fetchDocument({
      page: 1,
      category_id: event.target.getAttribute('value'),
      career_id: event.target.getAttribute('value'),
    });
  };

  const handlePressEnterToSearch = (event) => {
    if (event.key === 'Enter') {
      fetchDocument({ search_text: searchText });
    }
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

  const showConfirmPopup = ({
    title = 'Thông báo',
    message = 'Yêu cầu lựa chọn ít nhất một bản ghi',
    action = null,
    payload = null,
    onSuccess = null,
  }) => {
    setConfirmPopup({
      type: CONFIRM_CHANGE,
      open: true,
      title,
      message,
      action,
      payload,
      onSuccess,
    });
  };

  const submitBooking = async () => {
    if (buttonSetBookingReviewed && buttonSetBookingReviewed.is_required_input && !selected.length)
      return showConfirmPopup({});
    showConfirmPopup({
      message: 'Bạn chắc chắn muốn gửi duyệt các đăng ký này?',
      action: setBookingReviewed,
      payload: selected,
      onSuccess: reloadCurrentDocuments,
    });
  };

  const _recallBooking = async () => {
    if (buttonSetBookingDraft && buttonSetBookingDraft.is_required_input && !selected.length)
      return showConfirmPopup({});
    showConfirmPopup({
      message: 'Bạn chắc chắn muốn thu hồi các đăng ký này?',
      action: setBookingDraft,
      payload: selected,
      onSuccess: reloadCurrentDocuments,
    });
  };

  const approveBooking = async () => {
    if (
      buttonSetBookingCompleted &&
      buttonSetBookingCompleted.is_required_input &&
      !selected.length
    )
      return showConfirmPopup({});
    showConfirmPopup({
      message: 'Bạn chắc chắn muốn duyệt các đăng ký này?',
      action: setBookingCompleted,
      payload: selected,
      onSuccess: reloadCurrentDocuments,
    });
  };

  return (
    <React.Fragment>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container justify="space-between">
            <Grid item lg={4} md={6} xs={12}>
              <Typography variant="h6">
                {/* <Breadcrumb divider={false} isCard={false} hasSpacer={false}>
                  {parentFolder && (
                    <a href="#" onClick={handleBackToParentFolder}>
                      ...
                    </a>
                  )}
                  {selectedFolder && <Typography>{selectedFolder.name}</Typography>}
                </Breadcrumb> */}
              </Typography>
            </Grid>
            <Grid item lg={8} md={6} xs={12}>
              <Grid container spacing={gridSpacing} justify="flex-end" alignItems="center">
                <Grid item xs={12} md={6} lg={8}>
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
                {!!categories.length && (
                  <Grid item xs={12} md={2} lg={4}>
                    <FormControl className={classes.formControl}>
                      <Button
                        onClick={handleClicksort}
                        endIcon={<ExpandMoreRoundedIcon />}
                        variant="text"
                        size="small"
                      >
                        {selectedCategory ? selectedCategory.title : 'Chọn danh mục'}
                      </Button>
                      <Menu
                        id="category"
                        anchorEl={category}
                        keepMounted
                        open={Boolean(category)}
                        onClose={handleCloseCategory}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                        }}
                      >
                        <MenuItem value="" onClick={handleCloseCategory}>
                          <em>Không chọn</em>
                        </MenuItem>
                        {categories.map((category) => (
                          <MenuItem
                            key={category.id}
                            value={category.id}
                            onClick={handleCloseCategory}
                          >
                            {category.title}
                          </MenuItem>
                        ))}
                      </Menu>
                    </FormControl>
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
                submitBookings={submitBooking}
                buttonSetBookingReviewed={buttonSetBookingReviewed}
                recallBookings={_recallBooking}
                buttonSetBookingDraft={buttonSetBookingDraft}
                approveBookings={approveBooking}
                buttonSetBookingCompleted={buttonSetBookingCompleted}
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
                                <a href="#" onClick={(event) => openDetailDocument(event, row)}>
                                  {row.fullname}
                                </a>
                                &nbsp;&nbsp;
                              </TableCell>
                            )}
                            {displayOptions.phone && (
                              <TableCell align="left">{row.number_phone || ''}</TableCell>
                            )}
                            {displayOptions.start_time && (
                              <TableCell align="left">
                                {row.start_time
                                  ? formatDate(new Date(row.start_time), 'dd/MM/yyyy h:mm aa')
                                  : ''}
                              </TableCell>
                            )}
                            {displayOptions.consultant && (
                              <TableCell align="left">{row.consultant_name}</TableCell>
                            )}
                            {displayOptions.consultation_day && (
                              <TableCell align="left">{row.schedule || ''}</TableCell>
                            )}
                            {displayOptions.status && (
                              <TableCell align="left">{row.status}</TableCell>
                            )}
                            {displayOptions.link && (
                              <TableCell align="left">{row.link || ''}</TableCell>
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
