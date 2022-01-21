import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Root from './Root';

export { default as Main }  from './components/layout/LayoutMain';
export { default as Form } from './components/card/form/Form';
export { default as List } from './components/card/list/List'
export { default as Status } from './components/card/status/status'
export { default as Setting } from './components/card/setting/setting'
export { default as GradeList } from './components/card/gradelist/GradeList'

ReactDOM.render(
  <Root /> ,
  document.getElementById('root')
);



reportWebVitals();
