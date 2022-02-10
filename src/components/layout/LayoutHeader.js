import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { AppBar, Box, Toolbar, Typography, Button, Alert, AlertTitle, IconButton, CloseIcon, Collapse } from '@mui/material'
import { connect } from 'react-redux';
import { alertHidden } from '../../redux/actions/authentication'

class LayoutHeader extends Component {
  constructor (props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose = (e) => {
    e.preventDefault();
    this.props.alertHidden();
  }

  render() {
    return (
      <React.Fragment>
        <Box sx={{ flexGrow: 1 }} >
          <Stack sx={{ width: '100%' }} spacing={4}>
            <Collapse in={this.props.info.show}>
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
 