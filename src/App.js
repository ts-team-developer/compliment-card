import React, { Component } from 'react';
import LayoutHeader from './layout/LayoutHeader';
import LayoutMain from './layout/LayoutMain';
import axios from 'axios'

class App extends Component {
  state = {
    users : {
      name : '',
      email: ''
    },
    email:''    
  };

  componentDidMount() {
    

  }

  constructor(props) {
    super(props) 
    axios.get('/auth/isAuthenticated')
      .then(async ({data}) => {
        if(data == null) {
          window.location.href="/auth/login/google"
        } else {
          let userLogin = {
            ...data
          }
          this.setState({
            name : data.name.familyName + '' + data.name.givenName,
            users : {
              ...userLogin
            }
          })
        }
      });

  }


  render() {
      return (
        <div>
          <LayoutHeader userLogin = {this.state.users}/>
          <LayoutMain userLogin = {this.state.users}/>
        </div>
      );
    }
  }

export default App;