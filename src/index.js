import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Root from './Root';


// REDUX 
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './redux/reducer/index';
import thunk from 'redux-thunk';
  
  
export { default as Main }  from './components/layout/LayoutMain';
export { default as Form } from './components/card/form/Form';
export { default as List } from './components/card/list/List'
export { default as Status } from './components/card/status/status'
export { default as Setting } from './components/card/setting/setting'
export { default as GradeList } from './components/card/gradelist/GradeList'
  
const store = createStore(reducers, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById('root')
);



reportWebVitals();
