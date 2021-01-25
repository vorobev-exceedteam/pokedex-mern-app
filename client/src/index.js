import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './constants/textStyles.sass';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {GlobalProvider} from './context/global';

import {BrowserRouter as Router, Route} from 'react-router-dom';

import {QueryParamProvider} from 'use-query-params';

import {createMuiTheme, CssBaseline, MuiThemeProvider} from '@material-ui/core';
import ErrorBoundary from "./hoc/ErrorBoundary";

const theme = createMuiTheme({
  palette: {
    primary: {
      dark: '#B3A125',
      main: '#FFDE00',
      light: '#FFF06A'
    },
    secondary: {
      light: '#7682DA',
      main: '#3B4CCA',
      dark: '#29358D'
    }
  }
});

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Router>
      <GlobalProvider>
        <ErrorBoundary>
          <QueryParamProvider ReactRouterRoute={Route}>
            <MuiThemeProvider theme={theme}>
              <App />
            </MuiThemeProvider>
          </QueryParamProvider>
        </ErrorBoundary>
      </GlobalProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
