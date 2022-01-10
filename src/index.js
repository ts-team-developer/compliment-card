import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Root from './Root';

// Redux
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import rootReducer from './store/reducers';

const middleware = applyMiddleware(thunkMiddleware);
const store = createStore(rootReducer, composeWithDevTools(middleware));

export { default as Main }  from './layout/LayoutMain';
export { default as Form } from './inc/form';
export { default as List } from './inc/list'
export { default as Status } from './inc/status'
export { default as GradeList } from './inc/gradelist'

ReactDOM.render(
<Provider store={store}>
  <Root />
</Provider>
  ,
  document.getElementById('root')
);



reportWebVitals();
