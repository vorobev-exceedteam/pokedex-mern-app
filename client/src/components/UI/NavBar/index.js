import React, { useContext, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import { MdMenu } from 'react-icons/md/index.esm';
import { GlobalContext } from '../../../context/global';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';
import Link from '@material-ui/core/Link';
import { observer } from 'mobx-react-lite';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import NavDrawer from '../NavDrawer';

const NavBar = () => {
  const { isLoading, isAuthorized, user, logout } = useContext(GlobalContext);

  const [isDrawerOpen, setDrawerState] = useState(false);

  return (
    <>
      <AppBar color={'primary'} position="sticky">
        <Toolbar>
          <NavDrawer
            isAuthorized={isAuthorized}
            user={user}
            isDrawerOpen={isDrawerOpen}
            onOpen={() => setDrawerState(true)}
            onClose={() => setDrawerState(false)}
            logout={logout}
          />
          <IconButton
            onClick={() => setDrawerState(true)}
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <MdMenu />
          </IconButton>
          <Typography variant={'h6'} style={{ marginLeft: '16px', flex: 1 }}>
            <Link
              color="inherit"
              component={RouterLink}
              to="/"
              underline="none"
            >
              Pokedex
            </Link>
          </Typography>
          <Hidden xsDown>
            {isAuthorized ? (
              <Button onClick={logout} color={'inherit'}>
                Log out
              </Button>
            ) : (
              <>
                <Button component={RouterLink} to={'/login'} color={'inherit'}>
                  Login
                </Button>
                <Button component={RouterLink} to={'/signup'} color={'inherit'}>
                  Sign Up
                </Button>
              </>
            )}
          </Hidden>
        </Toolbar>
        {isLoading ? <LinearProgress color={'secondary'} /> : null}
      </AppBar>
    </>
  );
};

export default observer(NavBar);
