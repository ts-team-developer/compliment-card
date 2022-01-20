import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Root from './Root';

export { default as Main }  from './components/layout/LayoutMain';
export { default as Form } from './components/board/form/Form';
export { default as List } from './components/board/list/List'
export { default as Status } from './components/board/status/status'
export { default as Setting } from './components/board/setting/setting'
export { default as GradeList } from './components/board/gradelist/GradeList'

ReactDOM.render(
  <Root /> ,
  document.getElementById('root')
);



reportWebVitals();
