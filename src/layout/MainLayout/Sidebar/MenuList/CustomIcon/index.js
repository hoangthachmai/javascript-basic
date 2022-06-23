import React from 'react';
import * as Icons from '@material-ui/icons';

const CustomIcon = ({ name, className }) => {
  const IconComponent = Icons[name];

  if (!name || !IconComponent) {
    return <Icons.FolderOpen className={className} />;
  }

  return <IconComponent className={className} />;
};

export default CustomIcon;
