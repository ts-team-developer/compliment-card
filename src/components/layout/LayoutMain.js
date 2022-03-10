import React, {Component} from 'react';
import axios from 'axios';

import { Box, Container } from '@mui/material';

import { AlimPopup, ConfirmPopup } from '../modal/index';
import { FormLayout, ListLayout, GradeListLayout, Status, Statistics, Setting  } from '../card/index'

import { refreshRequest, logoutRequest } from '../../redux/actions/authentication'; 
import { connect } from 'react-redux';

class LayoutMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open :false,
            message : '',
            result : {
                open :false,
                error : false,
                message : ''
            }
        }

        this.handleClose = this.handleClose.bind(this)
        this.handleCallback = this.handleCallback.bind(this);

        if(this.props.loginStatus.status.currentUser != null) {
            if(this.props.loginStatus.login.status === "SUCCESS") {
                axios.get('/auth/isAuthenticated', {params: {'token' : this.props.loginStatus.status.currentUser.ACCESS_TOKEN }})
                .then(async (response) => {
                    // 자동 로그아웃 연장 유무
                    if(!this.props.login.isAutoLogout) {
                        if(response.data.result == true && response.data.message != null) {
                            this.setState({
                                open : true,
                                message : response.data.message,
                                error : false
                            })
                        }
                    } 
                
                    // 로그아웃 처리하기
                    if(response.data.result == false) {
                        this.props.onLogout();
                    }
                }).catch((err) => {
                    this.setState({
                        open : true,
                        message : `${err}`,
                        error : false
                    })
                });
            }
        } 
    }

    // 취소 버튼을 누르면 리덕스 를 호출하려
    handleClose = () => {
        // refresh가 true이면, 로그인 연장 안하고, 결국 로그아웃 창이 떴을거임..
        if(this.props.login.isAutoLogout) {
            // 로그아웃 처리하기 (REDUX)
            this.props.onLogout();
        } else {
            // refresh가 false이면 로그인 연장여부 물어본 상태이고, 취소 상태임.
            this.props.refreshRequest(false);
        }
    }

    handleCallback = () => {
        this.props.refreshRequest(true);
    }

    render() {
        const layoutMain = () => {
            if(this.props.loginStatus.login.status==="SUCCESS") {
                if(this.props.url == '/view/form') {
                    return (<FormLayout/>);
                } else if(this.props.url == '/view/list') {
                    return (<ListLayout/>);
                } else if(this.props.url =='/view/gradelist'){
                    return (<GradeListLayout/>)
                }else if(this.props.url == '/view/status') {
                    return (<Status/>)
                } else if(this.props.url=='/view/statistics') {
                    return (<Statistics/>)
                } else if(this.props.url=='/view/setting') {
                    return (<Setting/>)
                }
            } 
        }

        return (
            <React.Fragment>
            <ConfirmPopup open={this.state.open}  msg = {this.state.message}  handleClose={this.handleClose} handleCallback={this.handleCallback} />
            <AlimPopup open={this.state.result.open} handleClose={this.handleClose} msg={this.state.result.message} error={this.state.result.error}/>
            {this.props.loginStatus.login.status === "SUCCESS" ? this.props.children : null}
            
            <Container fixed >
                <Box sx={{ bgcolor: 'none', height: '100vh' }} sx={{ mt: 10 }} >
                    <Box component="form" noValidate  autoComplete="off"  > 
                        {layoutMain()} 
                    </Box>
                </Box>
            </Container>
        </React.Fragment>
        );
    }
}
const mapStateToProps = (state) => {
   return {
     status : state.authentication.status,
     login : state.authentication.login
   }
}
const mapDispatchToProps = (dispatch) => {
    return {
      refreshRequest : (request) => {
        return dispatch(refreshRequest(request));
      },
      logoutRequest : () => {
        return dispatch(logoutRequest());
      }
    }
  }
export default connect(mapStateToProps, mapDispatchToProps)(LayoutMain);