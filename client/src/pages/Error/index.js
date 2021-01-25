import React, {useContext, useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {GlobalContext} from '../../context/global';
import './styles.sass'
import {observer} from "mobx-react-lite";

const Error = () => {
  const { error } = useContext(GlobalContext);

  useEffect(() => {
    if (document.title !== 'Error') {
      document.title = 'Error';
    }
  }, [])

  return (
    <Container maxWidth={'sm'}>
      <Paper className={'error-box'}>
        <Typography align={'center'} variant={'h3'}>Something went wrong</Typography>
        <Typography align={'center'} variant={'h2'}>{error?.statusCode}</Typography>
        <Typography variant={'h3'}>Type: {error?.type}</Typography>
        <Typography variant={'h4'}>{error?.message}</Typography>
      </Paper>
    </Container>
  );
};

export default observer(Error);
