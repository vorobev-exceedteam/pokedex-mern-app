import React from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper'
import Image from 'material-ui-image';
import Typography from '@material-ui/core/Typography';
import SpinLoader from '../UI/SpinLoader';

const AvatarCard = (props) => {
  return (
    <Paper>
      <Box p={'16px'}>
        {props.isLoading ? (
          <SpinLoader type={'avatar'} />
        ) : (
          <>
            <Image src={props.src} />
            <Typography className={'uppercase'} align={'center'} variant={'h4'}>
              {props.name}
            </Typography>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default AvatarCard;
