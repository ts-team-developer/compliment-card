import React from 'react';
import ReactDOM from 'react-dom';
import './styles/font.css';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Root from './Root';

// REDUX 
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './redux/reducer/index';
import thunk from 'redux-thunk';
import { createTheme, ThemeProvider } from '@mui/material';

const store = createStore(reducers, applyMiddleware(thunk));
const theme = createTheme({
  typography: {
    fontFamily: 'NanumGothic',
  },
  
});
ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Root />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);



reportWebVitals();
