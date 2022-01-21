import React from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Store, { NameContext } from '../context/Store';

export default function LayoutHeader() {
  const { userInfo, quarterInfo, menuList } = React.useContext(NameContext);

  return (
    <React.Fragment>
    <Box sx={{ flexGrow: 1 }} >
      <AppBar position="static" >
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" component="div" sx={{ mr: 4, fontFamily: 'NanumGothic' }}>칭찬카드</Typography>
          <Stack direction="row" spacing={2}  color="inherit" sx={{ flexGrow : 1 }}>
            {menuList.map((menu, i) => {
              return (
                <Link to={menu.MENU_URL} style={{ textDecoration: 'none', color: 'white'}}  > 
                  <Button color="inherit" style={{  fontFamily: 'NanumGothic'  }}> {menu.MENU_NM}</Button>
                </Link>
              );
            })}
          </Stack>
          <Stack direction="row" spacing={1} color="inherit" > 
            <Typography variant="body1" style={{fontFamily : 'NanumGothic'}}  gutterBottom>
                {userInfo.name}
            </Typography>
            <Typography variant="caption" gutterBottom style={{fontFamily : 'NanumGothic', lineHeight: '25px'}}>
              [{quarterInfo.ISCLOSED == 'N' ? `${quarterInfo.QUARTER} 카드 작성기간` : quarterInfo.ISRECCLOSED == 'N' ? `${quarterInfo.QUARTER} 추천 진행중` : '종료'}] 
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>
               
    </Box>
    
    </React.Fragment>
    
  )
}
