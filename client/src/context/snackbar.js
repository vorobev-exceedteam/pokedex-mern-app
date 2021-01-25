import React, {createContext, memo, useContext, useState} from 'react';
import StatusSnackbar from '../components/UI/StatusSnackbar';
import SnackbarService from "../services/SnackbarService";

const SnackbarContext = createContext(null);

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = memo((props) => {
  const [state, setState] = useState({
    isOpen: false,
    message: '',
    variant: 'success',
    anchor: { vertical: 'bottom', horizontal: 'center' }
  });

  const closeSnackbar = () => {
    setState({ ...state, isOpen: false });
  };

  return (
    <>
      <SnackbarContext.Provider value={new SnackbarService(setState)}>
        {props.children}
      </SnackbarContext.Provider>
      <StatusSnackbar
        open={state.isOpen}
        variant={state.variant}
        onClose={closeSnackbar}
        duration={props.duration}
        anchorOrigin={state.anchor}
      >
        {state.message}
      </StatusSnackbar>
    </>
  );
});
