import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import {MdHelpOutline} from 'react-icons/all';
import './styles.sass'

const DescriptionButton = (props) => {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <IconButton className={'description-icon'} onClick={handleOpen}>
        <MdHelpOutline/>
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>
            {props.desc}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DescriptionButton;
