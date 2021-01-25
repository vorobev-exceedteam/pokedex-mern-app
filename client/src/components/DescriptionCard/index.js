import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import './styles.sass';
import SpinLoader from "../UI/SpinLoader";

const DescriptionCard = (props) => {
  return (
    <Paper className={'paper'}>
      <Box mb={2}>
        <Typography mb={2} align={'center'} variant={'h5'}>
          {props.title}
        </Typography>
        <Divider />
      </Box>
      {props.isLoading ? (
        <SpinLoader type={'desc-card'} />
      ) : (
        <Fade in={!props.isLoading}>{props.children}</Fade>
      )}
    </Paper>
  );
};

export default DescriptionCard;
