import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import GlobalStore from "../../stores/GlobalStore";

const RouteWithStore = (route) => {

  const Provider = route.storeProvider;

  const Component = route.component;

  const getRenderAllowance = () => {
      switch (route.protected) {
        case 'authorized':
          return GlobalStore.isAuthorized;
        case 'unauthorized':
          return !GlobalStore.isAuthorized;
        default:
          return true;
      }
  };

  const shouldRender = getRenderAllowance();

  return (
    <Route
      path={route.path}
      exact
      render={() => (
        <>
          {shouldRender ? (
            <Provider>
              <Component />
            </Provider>
          ) : (
            <Redirect to={route.redirect} />
          )}
        </>
      )}
    />
  );
};

export default observer(RouteWithStore);
