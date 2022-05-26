import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import axios from 'axios';

import { connect } from 'react-redux';
import { alertHidden, loginRequest, logoutRequest } from '../redux/actions/authentication'; 

import { LayoutHeader, LayoutMain } from './layout/index';
import { AlimPopup } from './modal/index'

class App extends Component {
  constructor(props) {
    super(props) ;
    
    this.state = {
      menuList : [],
      result : {
        open : false,
        error : false,
        message : '자동 로그아웃 되었습니다. '
      }
    }

    axios.get('/api/menu/list').then((response) => {
      this.setState({
        menuList : response.data
      });
    });
    
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin = () => {
    this.props.loginRequest();
  }

  componentDidMount() {
    if(this.props.status.login.status === "INIT") {
      this.props.loginRequest();
    } else if(this.props.status.login.statue === "FAILURE") {
      window.location.href = '/auth/login/google'
    }
  }

  handleLogout = () => {
    this.props.logoutRequest().then(() => {
      this.setState({
        result : {
          ...this.state.result,
          open : true,
        }
      })
    }) 
  }

  handleClose = () => {
    if(this.props.status.login.status === "INIT") {
      window.location.href = '/auth/login/google';
    }
  }

  handleClosePopup = () => {
    this.props.alertHidden();
  }

  render() {
    return (
      <React.Fragment>
        <AlimPopup open={this.state.result.open} handleClose={this.handleClose} msg={this.state.result.message} error={this.state.result.error}/>
        <Router>
            <Switch>
              { this.state.menuList ? this.state.menuList.map((menu, index) => {
                return (
                  <Route exact path={menu.MENU_URL} component = {() => 
                    <LayoutMain onLogin={this.handleLogin} url={menu.MENU_URL} loginStatus={this.props.status} onLogout={this.handleLogout}  >
                      <LayoutHeader menuList={this.state.menuList} onClose={this.handleClosePopup} />
                    </LayoutMain>
                    }/>)
                  } 
                  ) : <LayoutMain onLogin={this.handleLogin} url='' loginStatus={this.props.status} onLogout={this.handleLogout} ></LayoutMain> }
                {/* <Route path={"*"} component={ErrorLayout}/> */}
              </Switch>
              </Router>
      </React.Fragment>
    );    
  }
}

const mapStateToProps = (state) => {
  return {
    status : state.authentication,
    currentUser : state.authentication.status,
    login : state.authentication.login,
    auth : state.authentication.status,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginRequest : () => {
      return dispatch(loginRequest());
    },
    logoutRequest : () => {
      return dispatch(logoutRequest());
    },
    alertHidden : () =>  {
      return dispatch(alertHidden());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);