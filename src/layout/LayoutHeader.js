import React, { Component } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';




// const options = ['년도 분기별 점수', '년도별', '직원별', '전체'];
const options = [
  {
    name: '년도 분기별 점수',
    value : '/static-quarter'
  },
  {
    name: '년도별',
    value : '/static-year'
  },
  {
    name : '직원별',
    value:'/static-people'
  },
  {
    name : '전체',
    value : '/static-all'
  }
];

export default function DenseAppBar() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

    return (
      <Box sx={{ flexGrow: 1 }} >
        <AppBar position="static" >
          <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" component="div" sx={{ mr: 4 }}>
              칭찬카드
            </Typography>
                <Stack direction="row" spacing={2}  color="inherit" sx={{ flexGrow : 1 }}>
                  <Link to="/form" style={{ textDecoration: 'none', color: 'white' }}  > <Button color="inherit"> 메시지작성</Button></Link>
                  <Link to="/list" style={{ textDecoration: 'none', color: 'white' }}  > <Button color="inherit"> 조회</Button></Link>
                  <Link to="/gradelist" style={{ textDecoration: 'none', color: 'white' }}  > <Button color="inherit"> 우수칭찬카드</Button></Link>
                  <Link to="/status" style={{ textDecoration: 'none', color: 'white' }}  > <Button color="inherit"> 진행현황</Button></Link>
                  
                  <ButtonGroup variant="outlined" color="inherit" ref={anchorRef} aria-label="split button">
                    <Button
                      aria-controls={open ? 'split-button-menu' : undefined}
                      aria-expanded={open ? 'true' : undefined}
                      aria-label="통계"
                      aria-haspopup="menu"
                      onClick={handleToggle}
                      sx={{border:'0px'}}
                    > 통계
                    </Button>
                  </ButtonGroup>
                    <Popper
                      open={open}
                      anchorEl={anchorRef.current}
                      role={undefined}
                      transition
                      disablePortal
                    >
                      {({ TransitionProps, placement }) => (
                        <Grow
                          {...TransitionProps}
                          style={{
                            transformOrigin:
                              placement === 'bottom' ? 'center top' : 'center bottom',
                          }}
                          >
                          <Paper >
                            <ClickAwayListener onClickAway={handleClose}>
                              <MenuList id="split-button-menu" sx={{bgcolor:'rgb(255,255,255)' , zIndex:99999}}>
                                {options.map((option, index) => (
                                  <Link to={option.value} style={{ textDecoration: 'none', color:'#000' }}  > 
                                  <MenuItem
                                    key={option}
                                    selected={index === selectedIndex}
                                    onClick={(event) => handleMenuItemClick(event, index)}
                                  >
                                    {option.name}
                                    
                                  </MenuItem>
                                  </Link>
                                ))}
                                
                              </MenuList>
                            </ClickAwayListener>
                          </Paper>
                        </Grow>
                      )}
                    </Popper>
                 
                </Stack>
                <Stack direction="row" spacing={10} color="inherit" >
                    <Button color="inherit">LOGOUT</Button>
                </Stack>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }