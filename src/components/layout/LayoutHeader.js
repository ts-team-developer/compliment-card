import * as React from 'react';
import CssBaseline from "@material-ui/core/CssBaseline";
import { Link } from 'react-router-dom';

import { AppBar, Box, Toolbar, Typography, Button, Alert, AlertTitle, IconButton, Collapse, Stack, Container, MenuItem, Menu, Avatar, Tooltip } from '@mui/material'
import { alertHidden } from '../../redux/actions/authentication'
import { useSelector, useDispatch } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';

import { usePcStyles, useMobileStyles  } from "../../styles/styles"
import { useMediaQuery} from "@material-ui/core";


const LayoutHeader = (props) => {
  // Style 관련 CSS
  const isMobile = useMediaQuery("(max-width: 600px)");
  const classes = usePcStyles();
  const mobile = useMobileStyles();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const info = useSelector(state => state.authentication.status);

  const bannerMsg = ((info.quarterInfo.ISCLOSED == 'N') ?  ' 칭찬카드 작성기간입니다.' : (info.quarterInfo.ISRECCLOSED == 'N') ? ' 칭찬카드 작성이 마감되었습니다.' : ' 칭찬카드 오픈 예정입니다.');

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="fixed" color="info" >
      <CssBaseline />
      {(info.show == true) && 
      <Box sx={{ flexGrow: 1 }} >
        <Stack fullWidth spacing={4}>
          {/* Top Banner 칭찬카드 작성/추천 기간 동안 뜨는 팝업*/}
          <Collapse in={info.show}>
            <Alert severity="warning" 
              action={
              <IconButton aria-label="close" color="inherit" size="small" onClick={props.onClose} >
                <CloseIcon fontSize="inherit" />
              </IconButton> }>
              
                <AlertTitle className={isMobile ? classes.mobileTopBanner : classes.pcTopBanner}> 
                  <strong> {info.quarterInfo.QUARTER}</strong> 
                  {bannerMsg}
                </AlertTitle>  
            </Alert>
          </Collapse>
        </Stack>
      </Box> }
      <Box>
        <Toolbar disableGutters>
          {/*  모바일 */}
          <Box className={isMobile ? classes.flex : classes.noShow}>
            <Box sx={{ flexGrow: 1 }} >
              <IconButton size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit" >
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
                onClose={handleCloseNavMenu} >
              
            {props.menuList.map((menu) => (   
            <MenuItem key={menu.MENU_URL} onClick={handleCloseNavMenu}>
              <Link to={menu.MENU_URL} style={{ textDecoration: 'none', color : '#000'}}  > 
                <Typography textAlign="center">{menu.MENU_NM}</Typography>
              </Link>
            </MenuItem>
            ))}
          </Menu>
          <Typography variant="h6" noWrap component="div" className={classes.logo}>칭찬카드</Typography>
        </Box>
      </Box>
          
      {/* PC */}
      <Box className={isMobile ? classes.noShow : classes.flex} fullWidth>
        <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, pl : '10px' }}
            className={classes.mobileHeader} >
            <b>칭찬카드</b>
          </Typography>
          <Box sx={{ flexGrow: 1 , ml : '20px'}} >
            {props.menuList.map((menu) => (
              <Button
                key={menu}
                onClick={handleCloseNavMenu}  >
                <Link to={menu.MENU_URL} style={{ textDecoration: 'none', color : '#fff'}}  > 
                  <Typography textAlign="center">{menu.MENU_NM}</Typography>
                </Link>
              </Button>
            ))}
          </Box>
      </Box>
      

      {/* 계정 노출 */}
        <Box sx={{ flexGrow: 0, pr: '10px' }} className={classes.profile}>
          <Tooltip title={info.currentUser.NAME_KOR}>
            <IconButton sx={{ p: 0 }}>
              <Avatar alt={info.currentUser.EMAIL} src={info.currentUser.PHOTO} />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
     </Box>
  </AppBar>
  );
};

export default LayoutHeader;