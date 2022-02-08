import React, { Component } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';

import { alertHidden } from '../../redux/actions/authentication'


class LayoutHeader extends Component {
  constructor (props) {
    super(props);
    this.state = {
      open : window.localStorage.getItem("alert")
    }
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose = (e) => {
    e.preventDefault();
    window.localStorage.setItem('alert', false);
    this.setState({
      open : false
    })
  }

  render() {
    return (
      <React.Fragment>
        <Box sx={{ flexGrow: 1 }} >
          <Stack sx={{ width: '100%' }} spacing={4}>
            <Collapse in={this.state.open}>
              <Alert severity="warning"  sx={{ border: '1px solid #eee'}}
                      action={
                        <IconButton aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={this.handleClose}>
                        <CloseIcon fontSize="inherit" />
                      </IconButton> }>
                <AlertTitle sx={{fontFamily : 'NanumSquare'}}> 
                    <strong> {this.props.info.quarterInfo.QUARTER}</strong> 
                    {this.props.info.quarterInfo.ISCLOSED == 'N' ? 
                      ' 칭찬카드 작성기간입니다.' 
                      : this.props.info.quarterInfo.ISRECCLOSED == 'N' ?
                      ' 칭찬카드 추천기간입니다.'
                      : ''
                    }
                </AlertTitle>
              </Alert>
            </Collapse>
          </Stack>

          <AppBar position="static" >
            <Toolbar variant="dense">
              <Typography variant="h6" color="inherit" component="div" sx={{ mr: 4, fontFamily: 'NanumGothic' }}>칭찬카드</Typography>
              <Stack direction="row" spacing={2}  color="inherit" sx={{ flexGrow : 1 }}>
                {this.props.menuList.map((menu, i) => {
                  return (
                    <Link to={menu.MENU_URL} style={{ textDecoration: 'none', color: 'white'}}  > 
                      <Button color="inherit" style={{  fontFamily: 'NanumGothic'  }}> {menu.MENU_NM}</Button>
                    </Link>
                  );
                })}
              </Stack>

              <Stack direction="row" spacing={1} color="inherit" > 
                <Typography variant="body1" style={{fontFamily : 'NanumGothic'}}  gutterBottom>
                  {this.props.info.currentUser.NAME_KOR}
                </Typography>
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>
    </React.Fragment>
    )
  };
}
const mapStateToProps = (state) => {
  return {
      info : state.authentication.status,
      status : state.authentication.login
  };
};

const mapStateToDispatch = (dispatch) => {
  return {
    alertHidden : () => {
      return dispatch(alertHidden());
    }
  }
}

export default  connect(mapStateToProps,mapStateToDispatch)(LayoutHeader);
 