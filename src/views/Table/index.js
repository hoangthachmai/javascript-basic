import { Button, Card, Checkbox, Grid, Tooltip, FormControlLabel, TablePagination, TableRow, Paper, Switch, Table, TableBody, TableCell, TableContainer, } from '@material-ui/core';
import React, { useEffect } from 'react'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import DuoIcon from '@material-ui/icons/Duo';
import GavelSharpIcon from '@material-ui/icons/GavelSharp';
import NoteAddSharpIcon from '@material-ui/icons/NoteAddSharp';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import StarIcon from '@material-ui/icons/Star';
import { useDispatch, useSelector } from 'react-redux';
import { CONFIRM_CHANGE, DOCUMENT_CHANGE, FLOATING_MENU_CHANGE, TASK_CHANGE } from '../../store/actions';
import { bookingActions, gridSpacing, view } from '../../store/constant';
import Modal from '../Table/Modal';
import useAccount from '../../hooks/useAccount';
import useBooking from './../../hooks/useBooking';
import useMentor from '../../hooks/useMentor';
import useDepartment from '../../hooks/useDepartment';
import useConfirmPopup from './../../hooks/useConfirmPopup';
import useTask from './../../hooks/useTask';
import useView from './../../hooks/useView';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import NoteModal from './NoteModal';
import { style, useStyles } from './style';
import { bookingStatusList } from './data';
import { getComparator, stableSort, getTodayAndTomorrow } from '../../utils/table';
import SearchIcon from '@material-ui/icons/Search';
export default function GeneralTable(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { setConfirmPopup } = useConfirmPopup();
  const { menu_buttons: menuButtons, columns: tableColumns, tabs } = useView();
  const [displayOptions, setDisplayOptions] = React.useState({});
  const { selectedFolder } = useSelector((state) => state.folder);

  const { selectedDocument } = useSelector((state) => state.document);

  useEffect(() => {
    const initOptions = {
      id: tableColumns.includes('booking_id'),
      fullname: tableColumns.includes('fullname'),
      department_name: tableColumns.includes('department_name'),
      department_parent: tableColumns.includes('department_parent'),
      number_member: tableColumns.includes('number_member'),
      university_name: tableColumns.includes('university'),
      email_address: tableColumns.includes('email'),
      number_phone: tableColumns.includes('number_phone'),
      career: tableColumns.includes('career'),
      assess: tableColumns.includes('assess'),
      schedule: tableColumns.includes('consultation_day'),
      link: false,
      status: tableColumns.includes('status'),
      active: tableColumns.includes('active'),
      mentor_name: tableColumns.includes('mentor'),
      rating: tableColumns.includes('rating'),
      total: tableColumns.includes('total'),
      reject: tableColumns.includes('reject'),
      completed: tableColumns.includes('completed'),
      uncomplete: tableColumns.includes('uncomplete'),
      note: tableColumns.includes('note'),
      account_id: tableColumns.includes('account_id'),
      image_url: tableColumns.includes('image_url'),
      full_name: tableColumns.includes('full_name'),
      menuButtons: !!menuButtons.length || false,
    }
    setDisplayOptions(initOptions);
  }, [tableColumns, selectedFolder]);

  const buttonBookingCancel = menuButtons.find(
    (button) => button.name === view.booking.list.cancel
  );

  const buttonBookingReview = menuButtons.find(
    (button) => button.name === view.booking.list.review
  );

  const buttonBookingMeeting = menuButtons.find(
    (button) => button.name === view.booking.list.meeting
  );

  const buttonBookingHandled = menuButtons.find(
    (button) => button.name === view.booking.list.handled
  );

  const buttonBookingNote = menuButtons.find(
    (button) => button.name === view.booking.list.note
  );


  const buttonBookingApprove = menuButtons.find(
    (button) => button.name === view.booking.list.approve
  );
 
  const buttonAccountCreate= menuButtons.find(
    (button) => button.name === view.user.list.create
  );

  const buttonDeptCreate= menuButtons.find(
    (button) => button.name === view.department.list.create
  );
    

  const buttonCreateMentor = menuButtons.find(
    (button) => button.name === view.mentor.list.create
  )

  const [isOpenModalNote, setIsOpenModalNote] = React.useState(false);
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [modalType, setModalType] = React.useState('');
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [selectedRecord, setSelectedRecord] = React.useState({});
  const { url, documentType, tableTitle } = props;

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);

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
    career: ''
  };

  const { getDocuments } = useTask();

  const {
    getBookingDetail,
    approveBooking,
    reviewBooking,
    setNoteBooking,
    setCompletedBooking,
    getListUniversity,
  } = useBooking();

  const { 
    activeDepartment,
    getDepartmentDetail,
    } = useDepartment();

  const {
    getAccountDetail, 
    activeAccount,
  } = useAccount();

  const { getMentorDetail } = useMentor();

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
  }, [selectedFolder]);
  useEffect(() => {
    reloadCurrentDocuments()
  }, [selectedDocument])

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
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
      dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: true });
    } else if (documentType === 'account') {
      detailDocument = await getAccountDetail(selectedDocument.account_id);
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
      dispatch({ type: FLOATING_MENU_CHANGE, accountDocument: true });
    } else if (documentType === 'mentor') {
      detailDocument = await getMentorDetail(selectedDocument.id);
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
      dispatch({ type: FLOATING_MENU_CHANGE, mentorDocument: true });
    } else if (documentType === 'department') {
    detailDocument = await getDepartmentDetail(selectedDocument.department_code);
    dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
    dispatch({ type: FLOATING_MENU_CHANGE, departmentDocument: true });
  }

  };

  const openDialogCreate=()=>{
    if (documentType === 'account') {
      dispatch({ type: FLOATING_MENU_CHANGE, accountDocument: true });
    } else if (documentType === 'department') {
      dispatch({ type: FLOATING_MENU_CHANGE, departmentDocument: true });
  }
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
    onSuccess = null
  }) => {
    setConfirmPopup({ type: CONFIRM_CHANGE, open: true, title, message, action, payload, onSuccess })
  }

  const handleOpenModal = (type, booking) => {
    setSelected((pre) => [...new Set([booking.id, ...pre])]);
    setSelectedRecord(booking);
    if (type === 'note') {
      setIsOpenModalNote(true);
    } else {
      setIsOpenModal(true);
      setModalType(type);
    }
  };

  const handleCancelBooking = async (data) => {
    try {
      await reviewBooking(selected[0], data.status);
    } catch (e) {
    } finally {
      setIsOpenModal(false);
      setModalType('');
      reloadCurrentDocuments();
    }
  };

  const handleReviewBooking = async (data) => {
    try {
      await reviewBooking(selected[0], data.status);
    } catch (e) {
    } finally {
      setIsOpenModal(false);
      setModalType('');
      reloadCurrentDocuments();
    }
  };

  const handleApproveBooking = async (id) => {
    showConfirmPopup({
      message: `Bạn chắc chắn muốn xác nhận đăng ký ${id} ?`,
      action: approveBooking,
      payload: id,
      onSuccess: reloadCurrentDocuments
    })
  };

  const handleSetCompletedBooking = async (id) => {
    showConfirmPopup({
      message: `Bạn chắc chắn xử lý đăng ký ${id} ?`,
      action: setCompletedBooking,
      payload: id,
      onSuccess: reloadCurrentDocuments
    })
  };

  const toggleSetActiveAccount = async (event, email_address, is_active) => {
    event.stopPropagation()
    await activeAccount({
      email_address: email_address,
      is_active: is_active,
    });
    reloadCurrentDocuments();
  };
  
  const toggleSetDepartment = async (event, department_code, is_active) => {
    event.stopPropagation()
    await activeDepartment({
      department_code: department_code,
      is_active: is_active,
    });
    reloadCurrentDocuments();
  };
  const handleNoteBooking = async (note) => {
    try {

      await setNoteBooking(selected[0], note);
    } catch (e) {
    } finally {
      setIsOpenModalNote(false);
      reloadCurrentDocuments();
    }
  };

  const handleShowColumn = (id, newState) => {
    setDisplayOptions((pre) => ({ ...pre, [id]: newState }));
  };

  const handleFilterChange = (data) => {
    fetchDocument(data);
  };

  const getStatusType = (type) => {
    const statusListLabel = [...bookingStatusList];
    const index = statusListLabel.findIndex(item => item === type.trim());
    return `styleStatus${index + 1}`
  };

  const formatDateTime = (datetime) => {
    if (datetime) {
      const date = new Date(datetime);
      return date.getDate()
        + "/" + (date.getMonth() + 1)
        + "/" + date.getFullYear()
        + " " + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours())
        + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
    }
    return ""
  }

  const handleClickCreateMentor = () => {
    dispatch({ type: DOCUMENT_CHANGE, selectedDocument: {}, documentType });
    dispatch({ type: FLOATING_MENU_CHANGE, mentorDocument: true });
  }

  return (
    <React.Fragment>
      {isOpenModalNote && (
        <NoteModal
          isOpen={isOpenModalNote}
          handleClose={() => setIsOpenModalNote(false)}
          handleSubmit={handleNoteBooking}
          selectedBooking={selectedRecord}
        />
      )}
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
            <div style={style.tableTitle}>{tableTitle}
            </div>
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
                buttonCreateMentor={buttonCreateMentor}
                handleClickCreateMentor={handleClickCreateMentor}
                btnCreateNewAccount={buttonAccountCreate}
                createNewAccount={openDialogCreate}
                btnCreateNewDept={buttonDeptCreate}
                createNewDept={openDialogCreate}
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
                            key={row.id || row.account_id || row.department_code}
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
                            {displayOptions.account_id && (
                              <TableCell align="left">
                                <>
                                  <span
                                    className={classes.tableItemName}
                                    onClick={(event) => openDetailDocument(event, row)}
                                  >

                                    {row.account_id}
                                  </span>
                                  &nbsp;&nbsp;
                                </>
                              </TableCell>
                            )}
                            {displayOptions.image_url && (
                              <TableCell align="left">
                                <>
                                  <span
                                    className={classes.tableItemName}
                                    onClick={(event) => openDetailDocument(event, row)}
                                  >
                                    <img src={row.image_url}
                                      style={style.tableUserAvatar}
                                    />
                                  </span>
                                  &nbsp;&nbsp;
                                </>
                              </TableCell>
                            )}
                             {displayOptions.department_name && (
                              <TableCell align="left">
                                <>
                                  <span
                                    className={classes.tableItemName}
                                    onClick={(event) => openDetailDocument(event, row)}
                                  >
                                    {row.department_name}
                                  </span>
                                  &nbsp;&nbsp;
                                </>
                              </TableCell>
                            )}
                              {displayOptions.department_parent && (
                              <TableCell align="left">
                                <>
                                  <span
                                    className={classes.tableItemName}
                                    onClick={(event) => openDetailDocument(event, row)}
                                  >
                                    {row.parent_department_code}
                                  </span>
                                  &nbsp;&nbsp;
                                </>
                              </TableCell>
                            )}
                              {displayOptions.number_member && (
                              <TableCell align="left">
                                <>
                                  <span
                                    className={classes.tableItemName}
                                    onClick={(event) => openDetailDocument(event, row)}
                                  >
                                    {row.number_member}
                                  </span>
                                  &nbsp;&nbsp;
                                </>
                              </TableCell>
                            )}
                            {displayOptions.full_name && (
                              <TableCell align="left">
                                <>
                                  <span
                                    className={classes.tableItemName}
                                    onClick={(event) => openDetailDocument(event, row)}
                                  >
                                    {row.full_name}
                                  </span>
                                  &nbsp;&nbsp;
                                </>
                              </TableCell>
                            )}

                            {displayOptions.university_name && (
                              <TableCell align="left">{row.university_name || ''}</TableCell>
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
                            {displayOptions.career && (
                              <TableCell align="left">{row.career || ''}</TableCell>
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
                            {displayOptions.mentor_name && (
                              
                              <TableCell>
                                 {row.image_url && (
                                    <img src={row.image_url}
                                    style={style.tableUserAvatar}
                                  />
                                  )}
                                   <div >
                                   <span>   
                                    {row.mentor_name || ''}
                                      </span> 
                                  </div>
                                  
                                 
                                </TableCell>
                               
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
                                {row.status && (
                                  <span style={style.statusWrap} className={classes[getStatusType(row.status || 'none')]}>
                                    {row.status}
                                  </span>
                                )}
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
                            {displayOptions.completed && (
                              <TableCell align="left">{row.completed}</TableCell>
                            )}
                            {displayOptions.uncomplete && (
                              <TableCell align="left">{row.uncomplete}</TableCell>
                            )}
                            {displayOptions.note && <TableCell align="left">{row.note}</TableCell>}
                            {displayOptions.active && (
                              <TableCell align="left">
                                <>
                                
                                {documentType=='account' ?(
                                  <FormControlLabel
                                  control={<Switch color="primary" checked={row.is_active} onClick={(event) => toggleSetActiveAccount(event, row.email_address, event.target.checked)} />}
                                />
                                ):(
                                  <FormControlLabel
                                  control={<Switch color="primary" checked={row.is_active} onClick={(event) => toggleSetDepartment(event, row.department_code, event.target.checked)} />}
                                />
                                )}
                                  
                                  &nbsp;&nbsp;
                                </>
                              </TableCell>
                            )}
                            {displayOptions.menuButtons && (
                              <TableCell align="left">
                                <div className={classes.handleButtonWrap}>
                                  {(buttonBookingApprove && row.is_can_approve) && (
                                    <Tooltip title={buttonBookingApprove.text}>
                                      <Button
                                        className={`${classes.handleButton} `}
                                        onClick={() => handleApproveBooking(row.id)}
                                      >
                                        <SkipNextIcon className={classes.noteButtonIcon} />
                                      </Button>
                                    </Tooltip>
                                  )}
                                  {buttonBookingNote && (
                                    <Tooltip title={buttonBookingNote.text}>
                                      <Button
                                        className={`${classes.handleButton} ${classes.handleButtonNote}`}
                                        onClick={() => handleOpenModal('note', row)}
                                      >
                                        <NoteAddSharpIcon className={classes.noteButtonIcon} />
                                      </Button>
                                    </Tooltip>
                                  )}
                                  {buttonBookingHandled && (
                                    <Tooltip title={buttonBookingHandled.text}>
                                      <Button
                                        className={classes.handleButton}
                                        onClick={() => handleSetCompletedBooking(row.id)}
                                      >
                                        <AssignmentTurnedInIcon className={classes.handleButtonIcon} />
                                      </Button>
                                    </Tooltip>
                                  )}
                                  {(buttonBookingMeeting && row.link_meeting !== null) && (
                                    <Tooltip title={buttonBookingMeeting.text}>
                                      <Button
                                        className={`${classes.handleButton} ${classes.handleButtonMeeting}`}

                                      >
                                        <a href={row.link_meeting}
                                          className={`${classes.handleButton} ${classes.handleButtonMeeting}`}
                                          target="_blank">
                                          <DuoIcon className={classes.handleButtonIconMeeting} />
                                        </a>
                                      </Button>
                                    </Tooltip>
                                  )}
                                  {(buttonBookingCancel && row.is_can_cancel) && (
                                    <Tooltip title={buttonBookingCancel.text}>
                                      <Button
                                        className={`${classes.handleButton} ${classes.handleButtonCancel}`}
                                        onClick={() => handleOpenModal('cancel', row)}
                                      >
                                        <DeleteOutlineIcon className={classes.handleButtonIcon} />
                                      </Button>
                                    </Tooltip>
                                  )}
                                  {(buttonBookingReview && row.is_can_completed) && (
                                    <Tooltip title={buttonBookingReview.text}>
                                      <Button
                                        className={classes.handleButton}
                                        onClick={() => handleOpenModal('review', row)}
                                      >
                                        <GavelSharpIcon className={classes.handleButtonIcon} />
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
