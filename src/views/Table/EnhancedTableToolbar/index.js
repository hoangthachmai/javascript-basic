import { Button, Checkbox, Grid, Tooltip } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CachedIcon from '@material-ui/icons/Cached';
import ClearIcon from '@material-ui/icons/Clear';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { gridSpacing } from '../../../store/constant';
import useToolbarStyles from './classes';
import { headCells, bookingStatusList } from '../data';
import { useSelector } from 'react-redux';

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
    btnCreateNewAccount,
    createNewAccount,
    btnCreateNewDept,
    createNewDept,
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
  const [statusList] = React.useState(bookingStatusList);
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
  const { documentType } = useSelector((state) => state.document);
  
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
        {btnCreateNewAccount && (
        <Grid item>
            <Button 
              variant="contained"
              color={ "primary" }
              onClick={createNewAccount}
              >
         {btnCreateNewAccount.text}
            </Button>
        </Grid>
        )}
        {btnCreateNewDept && (
        <Grid item>
            <Button 
              variant="contained"
              color={ "primary" }
              onClick={createNewDept}
              >
         {btnCreateNewDept.text}
            </Button>
        </Grid>
        )}
     
      
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
          {documentType !='account' && documentType !='department' ? (
            <Tooltip title="Search">
            <Button
              className={`${classes.toolButton} ${isOpenSearch ? classes.toolButtonActive : ''}`}
              onClick={handleCloseInput}
            >
              <SearchIcon className={classes.toolButtonIcon} />
            </Button>
          </Tooltip>
          ) :
          (
            <div className={classes.toolSearchWrap}>
            <SearchIcon />
            <input
              className={classes.toolSearchInput}
              value={filter.search_text}
              onChange={handleChangeSearch}
              onKeyUp={handleEnterSearch}
            />
        
          </div>
          )}
            
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
                            <MenuItem key={index} value={status}>
                              {status}
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

export default EnhancedTableToolbar;