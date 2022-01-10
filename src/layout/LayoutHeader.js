import React, {Component, useEffect, useRef, useState} from "react";
import axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const menuList = [
  {
    name : '조회',
    url : '/view/list',
    auth : 'EMP'
  },
  {
    name : '우수칭찬카드',
    url : '/view/gradelist',
    auth : 'EMP'
  },
  {
    name : '진행현황',
    url : '/view/status',
    auth : 'ADM'
  },  
  {
    name : '통계',
    url : '/view/static',
    auth : 'ADM'
  },
  {
    name : '관리',
    url : '/view/setting',
    auth : 'ADM'
  }
];

export default function DenseAppBar(users) {
    return (
      <Box sx={{ flexGrow: 1 }} >
        <AppBar position="static" >
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit" component="div" sx={{ mr: 4, fontFamily: 'NanumGothic' }}>
              칭찬카드
            </Typography>
            <Stack direction="row" spacing={2}  color="inherit" sx={{ flexGrow : 1 }}>
              {menuList.map((menu, index) => (
                <Link to={menu.url} style={{ textDecoration: 'none', color: 'white'}}  > 
                    <Button color="inherit" style={{  fontFamily: 'NanumGothic'  }}> {menu.name}</Button>
                 </Link>
              ))}
            </Stack>
            <Stack direction="row" spacing={10} color="inherit" > 
              {users.userLogin.name.familyName + ' ' +users.userLogin.name.givenName}
              <span style={{ fontSize : '12px', padding : '4px 0px 0px 5px' }}>{users.userLogin.quarter == '[마감]' ? '' : ' [' + users.userLogin.quarter + ']' }</span>
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }