import React from 'react';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Slide from '@material-ui/core/Slide';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core';
import './styles.sass';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction={'up'} ref={ref} {...props} />;
});

const TagModal = (props) => {
  const [open, setOpen] = React.useState(false);
  const [selectedTags, changeTags] = React.useState(new Set(props.tags));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const changeTag = (tag) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    changeTags(newTags);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onApply = () => {
    if (!eqSet(selectedTags, props.tags)) {
      props.setTags(selectedTags);
    }
    handleClose();
  };

  const onClear = () => {
    if (props.tags.size !== 0) {
      props.setTags(new Set());
    }
    changeTags(new Set());
    handleClose();
  };

  const eqSet = (as, bs) => {
    if (as.size !== bs.size) return false;
    for (let a of as) if (!bs.has(a)) return false;
    return true;
  };

  const onCancel = () => {
    changeTags(new Set(props.tags));
    handleClose();
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div className={'tag-modal-container'}>
      <Badge badgeContent={props.tags.size} color={'primary'}>
        <Button
          color={'secondary'}
          variant={'contained'}
          onClick={handleClickOpen}
          disabled={props.isDisabled}
        >
          {props.name}
        </Button>
      </Badge>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullScreen={fullScreen}
        aria-labelledby={'alert-dialog-title'}
        aria-describedby={'alert-dialog-description'}
      >
        <DialogTitle
          className={'center-text uppercase'}
          id={'alert-dialog-title'}
        >
          {props.name}
        </DialogTitle>
        <Divider />
        <DialogContent>
          {React.cloneElement(props.children, { selectedTags, changeTag })}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onApply} color={'secondary'}>
            Apply
          </Button>
          <Button autoFocus onClick={onClear} color={'secondary'}>
            Clear All
          </Button>
          <Button onClick={onCancel} color={'secondary'}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TagModal;
