import * as React from 'react';
import { Link } from 'react-router-dom';

import { AppBar, Box, Toolbar, Typography, Button, Alert, AlertTitle, IconButton, Collapse, Stack, Container, MenuItem, Menu, Avatar, Tooltip } from '@mui/material'
import { alertHidden } from '../../redux/actions/authentication'
import axios from 'axios';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';


const LayoutHeader = (props) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const info = useSelector(state => state.authentication.status);
  const status = useSelector(state => state.authentication.login) ;
  const dispatch = useDispatch();

  console.log(` info : ${JSON.stringify(info)}`)
  console.log(` status : ${JSON.stringify(info)}`)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleClose = () => {
    dispatch(alertHidden());
  }

  return (
    <AppBar position="static">
      <Box sx={{ flexGrow: 1 }} >
          <Stack sx={{ width: '100%' }} spacing={4}>
            <Collapse in={info.show}>
              <Alert severity="warning"  sx={{ border: '1px solid #eee'}}
                      action={
                        <IconButton aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={handleClose}>
                        <CloseIcon fontSize="inherit" />
                      </IconButton> }>
                <AlertTitle sx={{fontFamily : 'NanumSquare', fontSize : {xs: 'small', md:'medium'}, paddingTop : {xs : '3px', md: 'auto'}}}> 
                    <strong> {info.quarterInfo.QUARTER}</strong> 
                    {info.quarterInfo.ISCLOSED == 'N' ? 
                      ' 칭찬카드 작성기간입니다.' 
                      : info.quarterInfo.ISRECCLOSED == 'N' ?
                      ' 칭찬카드 추천기간입니다.'
                      : ''
                    }
                </AlertTitle>
              </Alert>
            </Collapse>
          </Stack>
          </Box>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >칭찬카드
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
             
              {props.menuList.map((menu) => (   
                <MenuItem key={menu.MENU_URL} onClick={handleCloseNavMenu}>
                  <Link to={menu.MENU_URL} style={{ textDecoration: 'none', color : '#000'}}  > 
                    <Typography textAlign="center">{menu.MENU_NM}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            칭찬카드
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {props.menuList.map((menu) => (
              <Button
                key={menu}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }} >
                <Link to={menu.MENU_URL} style={{ textDecoration: 'none', color : '#fff'}}  > 
                  <Typography textAlign="center">{menu.MENU_NM}</Typography>
                </Link>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={info.currentUser.NAME_KOR}>
              <IconButton sx={{ p: 0 }}>
                <Avatar alt={info.currentUser.EMAIL} src={info.currentUser.PHOTO} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default LayoutHeader;