import React, { useEffect } from 'react';
import { Typography } from '@material-ui/core';

import NavGroup from './NavGroup';
import { useSelector } from 'react-redux';
import { showRootFolder } from '../../../../store/constant';
import useFolder from '../../../../hooks/useFolder';

const MenuList = (props) => {
  const { drawerToggle } = props;
  const { getFolders } = useFolder();
  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  useEffect(() => {
    if (selectedProject) {
      getFolders(selectedProject);
    }
  }, [selectedProject]);

  const { folder } = useSelector((state) => state.folder);
  let childFolders = [{ ...folder, type: 'group' }];
  if (!showRootFolder) {
    childFolders =
      folder && folder.children.length
        ? folder.children.map((folder) => {
            return {
              ...folder,
              type: 'group',
            };
          })
        : [];
  }
  const fakeFolder = [
    {
      title: 'Thư mục',
      type: 'group',
      action: 'reload',
      children: childFolders,
    },
  ];
  const navItems = fakeFolder.map((item, index) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={index} item={item} drawerToggle={drawerToggle} />;
      default:
        return (
          <Typography key={index} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return navItems;
};

export default MenuList;
