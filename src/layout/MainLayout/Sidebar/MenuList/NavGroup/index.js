import React from 'react';

import { makeStyles, List, Typography, Button, Grid } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';

import NavItem from './../NavItem';
import NavCollapse from './../NavCollapse';
import { useSelector } from 'react-redux';
import useFolder from '../../../../../hooks/useFolder';

const useStyles = makeStyles((theme) => ({
  menuCaption: {
    ...theme.typography.menuCaption,
  },
  subMenuCaption: {
    ...theme.typography.subMenuCaption,
  },
  menuIIcon: {
    fontSize: '1.5rem',
    color: '#3366FF',
  },
}));

const NavGroup = (props) => {
  const { item, drawerToggle } = props;
  const classes = useStyles();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { reloadFolders } = useFolder();

  const items = item.children.map((menu, index) => {
    const type = menu.children && menu.children.length ? 'collapse' : 'item';
    switch (type) {
      case 'collapse':
        return <NavCollapse key={index} menu={menu} level={1} drawerToggle={drawerToggle} />;
      case 'item':
        return <NavItem key={index} item={menu} level={1} drawerToggle={drawerToggle} />;
      default:
        return (
          <Typography key={index} variant="h6" color="error" align="center">
            Menu Items Error xxx
          </Typography>
        );
    }
  });

  return (
    <List
      subheader={
        <Grid container justify="space-between">
          <Grid item>
            <Typography
              variant="caption"
              className={classes.menuCaption}
              display="block"
              gutterBottom
            >
              {item.title}
              {item.caption && (
                <Typography
                  variant="caption"
                  className={classes.subMenuCaption}
                  display="block"
                  gutterBottom
                >
                  {item.caption}
                </Typography>
              )}
            </Typography>
          </Grid>
          <Grid item>
            {item.action === 'reload' && (
              <Button onClick={() => reloadFolders(selectedProject || '')}>
                <CachedIcon className={classes.menuIIcon} />
              </Button>
            )}
          </Grid>
        </Grid>
      }
    >
      {items}
    </List>
  );
};

export default NavGroup;
