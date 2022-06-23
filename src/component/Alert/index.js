import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = (props) => {
  const { ...rest } = props;

  return <MuiAlert {...rest} />;
};

export default Alert;
