import React, {useContext} from 'react';
import {GlobalContext} from '../../context/global';
import {observer} from "mobx-react-lite";
import Error from "../../pages/Error";

const ErrorBoundary = (props) => {
  const { state } = useContext(GlobalContext);

  const isError = state === 'error'

  return isError? <Error/> : props.children;
};

export default observer(ErrorBoundary);
