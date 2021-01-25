import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTheme} from '@material-ui/core';
import './styles.sass';

const AuthDialog = (props) => {
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const smBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const cancel = () => {
    setOpen(false);
  };

  const handleRemember = () => {
    setOpen(false);
    props.handleAuth(true, props.failureCb);
  };

  const handleDontRemember = () => {
    setOpen(false);
    props.handleAuth(false, props.failureCb);
  };

  return (
    <div>
      <Button
        className={props.buttonClassName}
        startIcon={props.icon}
        fullWidth
        variant={'outlined'}
        disabled={props.isDisabled}
        onClick={() => setOpen(true)}
      >
        {props.name}
      </Button>
      <Dialog
        onClose={cancel}
        className={'dialog'}
        maxWidth={'xs'}
        fullWidth
        fullScreen={smBreakpoint}
        open={open}
      >
        <DialogContent className={'dialog-content'}>
          <div className={'dialog-content__remember-buttons'}>
            <Button
              fullWidth
              color={props.color || 'secondary'}
              variant={'contained'}
              onClick={handleRemember}
            >
              Remember me
            </Button>
            <Button
              fullWidth
              color={props.color || 'secondary'}
              variant={'contained'}
              onClick={handleDontRemember}
            >
              Don't remember me
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button color={props.color || 'secondary'} onClick={cancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AuthDialog;
