import React from 'react';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import './styles.sass';
import { useHistory } from 'react-router-dom';
import {
  MdApps,
  MdExitToApp,
  MdLockOpen,
  MdLockOutline,
  MdPerson
} from 'react-icons/all';

const NavDrawer = (props) => {
  const authIcon = props.isAuthorized ? (
    <MdLockOpen size={'2rem'} />
  ) : (
    <MdLockOutline size={'2rem'} />
  );
  const history = useHistory();

  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const logout = () => {
    props.onClose();
    return props.logout();
  };

  const goTo = (path) => () => {
    history.push(path);
    props.onClose();
  };

  const authElement = (
    <div className={'drawer__auth'}>
      <div className={'drawer__auth__icon'}>{authIcon}</div>
      <div className={'drawer__auth__info'}>
        {props.isAuthorized ? (
          <>
            <Typography align={'center'} variant={'h5'}>
              Logged In
            </Typography>
            <Typography
              className={'drawer__auth__email'}
              align={'center'}
              variant={'h6'}
              noWrap
            >
              {props.user.email}
            </Typography>
          </>
        ) : (
          <>
            <Typography align={'center'} variant="h5">
              Not Authenticated
            </Typography>
            <Box mt={2} spacing={1}>
              <Button onClick={goTo('/login')}>Sign In</Button>
              <Button onClick={goTo('/signup')}>Sign Up</Button>
            </Box>
          </>
        )}
      </div>
    </div>
  );

  return (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      onOpen={props.onOpen}
      anchor={'left'}
      open={props.isDrawerOpen}
      onClose={props.onClose}
    >
      <div className={'drawer'}>
        <List>
          {authElement}
          <Divider />
          <ListItem button onClick={goTo('/')}>
            <ListItemIcon>
              <MdApps size={'1.45rem'} />
            </ListItemIcon>
            <ListItemText primary={'Pokemons'} />
          </ListItem>
          {props.isAuthorized ? (
            <>
              <ListItem button onClick={goTo('/profile')}>
                <ListItemIcon>
                  <MdPerson size={'1.45rem'} />
                </ListItemIcon>
                <ListItemText primary={'Profile'} />
              </ListItem>
              <ListItem button onClick={logout}>
                <ListItemIcon>
                  <MdExitToApp size={'1.45rem'} />
                </ListItemIcon>
                <ListItemText primary={'Log Out'} />
              </ListItem>
            </>
          ) : null}
        </List>
      </div>
    </SwipeableDrawer>
  );
};

export default NavDrawer;
