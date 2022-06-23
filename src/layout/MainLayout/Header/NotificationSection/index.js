import React from 'react';

import {
  makeStyles,
  Button,
  Chip,
  ClickAwayListener,
  Fade,
  Grid,
  Paper,
  Popper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  ListItemSecondaryAction,
  Typography,
} from '@material-ui/core';

import PerfectScrollbar from 'react-perfect-scrollbar';
import NotificationsNoneTwoToneIcon from '@material-ui/icons/NotificationsNoneTwoTone';
import { subHours } from 'date-fns';
import QueryBuilderTwoToneIcon from '@material-ui/icons/QueryBuilderTwoTone';
import User1 from './../../../../assets/images/users/avatar-1.jpg';

const useStyles = makeStyles((theme) => ({
  grow: {
    flex: 1,
  },
  root: {
    width: '100%',
    maxWidth: '500px',
    minWidth: '500px',
    backgroundColor: theme.palette.background.paper,
    paddingBottom: 0,
    borderRadius: '10px',
    [theme.breakpoints.down('lg')]: {
      minWidth: '500px',
      maxHeight: '500px',
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: '350px',
      minWidth: '300px',
      maxHeight: '700px',
    },
  },
  popper: {
    [theme.breakpoints.down('xs')]: {
      left: '0',
      right: '0',
      top: '55px !important',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '80%',
      transform: 'none !important',
    },
  },
  inline: {
    display: 'inline',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  subHeader: {
    backgroundColor: theme.palette.grey.A400,
    color: theme.palette.common.white,
    padding: '5px 15px',
  },
  subFooter: {
    backgroundColor: theme.palette.grey.A400,
    color: theme.palette.common.white,
    padding: 0,
  },
  iconButton: {
    padding: '5px',
  },
  showIcon: {
    transform: 'rotate(90deg)',
  },
  listSection: {
    backgroundColor: 'inherit',
    display: 'block',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  listAction: {
    top: '22px',
  },
  actionIcon: {
    fontSize: '0.75rem',
    marginRight: '4px',
    color: theme.palette.grey[400],
  },
  actionColor: {
    color: theme.palette.grey[400],
  },
  ScrollHeight: {
    height: '500px',
    overflowX: 'hidden',
    [theme.breakpoints.down('lg')]: {
      // minWidth: '500px',
    },
    [theme.breakpoints.down('xs')]: {
      height: '700px',
    },
  },
  p0: {
    padding: 0,
  },
  pT0: {
    paddingTop: 0,
  },
  menuIIcon: {
    fontSize: '1.5rem',
  },
  menuButton: {
    [theme.breakpoints.down('sm')]: {
      minWidth: '50px',
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: '35px',
    },
  },
}));

const tasks = [
  {
    user: 'Lê Bích Ngọc',
    action: 'New ticker added',
    time: '2021-12-28T18:00:00.457',
  },
  {
    user: 'Thảo Cầm Viên',
    action: 'Purchase a new Product',
    time: '2021-12-24T01:14:43.457',
  },
  {
    user: 'Lê Trọng Tú',
    action: 'Currently Login',
    time: '2021-12-23T01:14:43.457',
  },
  {
    user: 'Thảo Cầm Viên',
    action: 'Purchase a new Product',
    time: '2021-12-24T01:14:43.457',
  },
  {
    user: 'Lê Trọng Tú',
    action: 'Currently Login',
    time: '2021-12-23T01:14:43.457',
  },
  {
    user: 'Thảo Cầm Viên',
    action: 'Purchase a new Product',
    time: '2021-12-24T01:14:43.457',
  },
  {
    user: 'Lê Trọng Tú',
    action: 'Currently Login',
    time: '2021-12-23T01:14:43.457',
  },
  {
    user: 'Thảo Cầm Viên',
    action: 'Purchase a new Product',
    time: '2021-12-24T01:14:43.457',
  },
  {
    user: 'Lê Trọng Tú',
    action: 'Currently Login',
    time: '2021-12-23T01:14:43.457',
  },
  {
    user: 'Thảo Cầm Viên',
    action: 'Purchase a new Product',
    time: '2021-12-24T01:14:43.457',
  },
  {
    user: 'Lê Trọng Tú',
    action: 'Currently Login',
    time: '2021-12-23T01:14:43.457',
  },
  {
    user: 'Thảo Cầm Viên',
    action: 'Purchase a new Product',
    time: '2021-12-24T01:14:43.457',
  },
  {
    user: 'Lê Trọng Tú',
    action: 'Currently Login',
    time: '2021-12-23T01:14:43.457',
  },
  {
    user: 'Thảo Cầm Viên',
    action: 'Purchase a new Product',
    time: '2021-12-24T01:14:43.457',
  },
  {
    user: 'Lê Trọng Tú',
    action: 'Currently Login',
    time: '2021-12-23T01:14:43.457',
  },
];

const NotificationSection = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const dateToday = new Date().getDate();
  const currentlyTasks = tasks.filter((task) => new Date(task.time).getDate() === dateToday);
  const laterTasks = tasks.filter((task) => new Date(task.time) < subHours(new Date(), 1));

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <React.Fragment>
      <Button
        className={classes.menuButton}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="inherit"
      >
        <NotificationsNoneTwoToneIcon className={classes.menuIIcon} />
      </Button>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        className={classes.popper}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: {
            offset: {
              enable: true,
              offset: '0px, 10px',
            },
            preventOverflow: {
              padding: 0,
            },
          },
        }}
      >
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <List className={classes.root}>
                  <PerfectScrollbar className={classes.ScrollHeight}>
                    {currentlyTasks.length && (
                      <ListSubheader disableSticky>
                        <Chip size="small" color="primary" label="New" />
                      </ListSubheader>
                    )}
                    {currentlyTasks.map(({ user, time, action }, index) => (
                      <ListItem button alignItems="flex-start" className={classes.pT0} key={index}>
                        <ListItemAvatar>
                          <Avatar alt={user} src={User1} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography variant="subtitle1">{user}</Typography>}
                          secondary={<Typography variant="subtitle2">{action}</Typography>}
                        />
                        <ListItemSecondaryAction className={classes.listAction}>
                          <Grid container justify="flex-end">
                            <Grid item>
                              <QueryBuilderTwoToneIcon className={classes.actionIcon} />
                            </Grid>
                            <Grid item>
                              <Typography variant="caption" display="block" gutterBottom className={classes.actionColor}>
                                now
                              </Typography>
                            </Grid>
                          </Grid>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                    {laterTasks.length && (
                      <ListSubheader disableSticky>
                        <Chip size="small" variant="outlined" label="EARLIER" />
                      </ListSubheader>
                    )}
                    {laterTasks.map(({ user, time, action }, index) => (
                      <ListItem button alignItems="flex-start" className={classes.pT0} key={index}>
                        <ListItemAvatar>
                          <Avatar alt={user} src={User1} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography variant="subtitle1">{user}</Typography>}
                          secondary={<Typography variant="subtitle2">{action}</Typography>}
                        />
                        <ListItemSecondaryAction className={classes.listAction}>
                          <Grid container justify="flex-end">
                            <Grid item>
                              <QueryBuilderTwoToneIcon className={classes.actionIcon} />
                            </Grid>
                            <Grid item>
                              <Typography variant="caption" display="block" gutterBottom className={classes.actionColor}>
                                now
                              </Typography>
                            </Grid>
                          </Grid>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </PerfectScrollbar>
                </List>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </React.Fragment>
  );
};

export default NotificationSection;
