import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import LayoutMain from './layout/LayoutMain'
import LayoutHeader from './layout/LayoutHeader'
import ErrorLayout from './error/ErrorLayout'

import { connect } from 'react-redux';
import { loginRequest, logoutRequest } from '../redux/actions/authentication'; 
import AlimPopup from '../components/modal/AlimPopup';

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

  render() {
    return (
      <React.Fragment>
        <AlimPopup open={this.state.result.open} handleClose={this.handleClose} msg={this.state.result.message} error={this.state.result.error}/>
            <Switch>
              { this.state.menuList ? this.state.menuList.map((menu, index) => {
                return (
                  <Route path={menu.MENU_URL} component = {() => 
                    <LayoutMain onLogin={this.handleLogin} url={menu.MENU_URL} loginStatus={this.props.status} onLogout={this.handleLogout}  >
                      <LayoutHeader menuList={this.state.menuList} />
                    </LayoutMain>
                    }/>)
                  } 
                  ) : <LayoutMain onLogin={this.handleLogin} url='' loginStatus={this.props.status} onLogout={this.handleLogout} ></LayoutMain> }
                  {/* <Route exact={true} path="/view/logout">
                    <Logout />
                  </Route> */}
              </Switch>
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);