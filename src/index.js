import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Root from './Root';

export { default as Main }  from './layout/LayoutMain';
export { default as Form } from './inc/form';
export { default as List } from './inc/list'
export { default as Status } from './inc/status'
export { default as GradeList } from './inc/gradelist'

ReactDOM.render(<Root />,
  document.getElementById('root')
);



reportWebVitals();
