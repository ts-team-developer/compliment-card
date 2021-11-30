import axios from 'axios';
import React, { Component } from 'react';
import LayoutHeader from './layout/LayoutHeader';
import LayoutMain from './layout/LayoutMain';

class App extends Component {
  state= {
    loading: false,
    itemList : []
  };



  constructor(props) {
    super(props) 
  }




  render() {
    const {itemList}=this.state
    return (
      <div>
        <LayoutHeader/>
        <LayoutMain />
      </div>
    );
  }
}

export default App;
// data => this.setState({itemList:data})