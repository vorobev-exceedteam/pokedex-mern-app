import React, {useContext, useEffect} from 'react';
import NavBar from './components/UI/NavBar';
import {GlobalContext} from './context/global';
import {observer} from 'mobx-react-lite';
import './constants/textStyles.sass';
import {SnackbarProvider} from './context/snackbar';
import config from './config';
import routes from './config/routes';
import RouteWithStore from './components/RouteWithStore';

const App = () => {
  const globalStore = useContext(GlobalContext);
  const isGettingUser = globalStore.state === 'startup'
  useEffect(() => {
    if (isGettingUser) {
      globalStore.getUser()
    }
  }, [isGettingUser, globalStore.getUser, globalStore]);

  const pages = routes.map((route) => (
      <RouteWithStore key={route.path} {...route}/>
    ))

  return (
    <SnackbarProvider duration={config.snackbarDuration}>
      <NavBar />
      {isGettingUser? null
        : pages
      }
    </SnackbarProvider>
  );
};

export default observer(App);
