import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

const StatusSnackbar = (props) => {
  return (
    <Snackbar
      anchorOrigin={props.anchorOrigin}
      open={props.open}
      autoHideDuration={props.duration}
      onClose={props.onClose}
    >
      <Alert onClose={props.onClose} severity={props.variant}>
        {props.children}
      </Alert>
    </Snackbar>
  );
};

export default React.memo(StatusSnackbar);
