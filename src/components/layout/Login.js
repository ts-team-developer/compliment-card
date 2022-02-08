import React, { Component } from 'react';

// 자동 로그인 ==> /auth/login

class Login extends Component {
    constructor(props) {
      super(props) ;
      console.log(`login ${this.props.loginStatus}`)
      this.props.onLogin();
    }
    
    render() {
        return (
            <h1>Login</h1>
        );
    }
}

export default Login;