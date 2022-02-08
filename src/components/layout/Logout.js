import React, { Component } from 'react';
import ConfirmPopup from '../modal/ConfirmPopup';
import AlimPopup from '../modal/AlimPopup';
// 자동 로그인 ==> /auth/login

class Logout extends Component {
    constructor(props) {
      super(props) ;

      this.state = {
          open: true,
          message : '세션이 만료되어 로그아웃 되었습니다. \n재로그인 하시겠습니까?',
      }

      if(this.props.loginStatus === "SUCCESS") {
        this.setState({
            open : true
        })
      }

      this.handleClose = this.handleClose.bind(this);
      this.handleCallback = this.handleCallback.bind(this);
      console.log(`login ${this.props.loginStatus}`)
      //this.props.onLogin();
    }

    handleClose = () => {
        this.setState({
            open:false
        })
    }

    handleCallback = () => {
        window.location.href="/";
    }
    // 권한이 없거나 로그아웃 된거 처림
    render() {
        console.log(`render() : ${JSON.stringify(this.props.loginStatus)}`)
        return (
            <React.Fragment>
                <h1>로그아웃</h1>
                <ConfirmPopup open={this.state.open} msg = {this.state.message}  handleClose={this.handleClose} handleCallback={this.handleCallback} />
            </React.Fragment>
        );
    }
}

export default Logout;