import React from 'react';
import { useHistory } from "react-router-dom";

import { Typography, Card, CardContent, Grid, CardActions, Link, Chip, CardHeader, Avatar, MenuItem, Menu, Box } from '@mui/material';
import { ConfirmPopup, AlimPopup } from '../../modal/index';
import { Evaluation } from '../index'
import axios from 'axios';
import { deepOrange, deepPurple,green, pink } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useSelector } from 'react-redux';
import { usePcStyles, useMobileStyles } from "../../../styles/styles"
import { useMediaQuery } from "@material-ui/core";
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function PraiseCard(props) {
    // Style 관련 CSS
    const isMobile = useMediaQuery("(max-width: 600px)");
    const classes = usePcStyles();
    const mobile = useMobileStyles();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    let color = null;

    if(props.card.category == '긍정') {
        color = pink[500] ;
    }else if(props.card.category == '열정') {
        color = deepPurple[500];
    } else if(props.card.category == '창의') {
        color = deepOrange[500]
    } else if(props.card.category == '약속') {
        color = green[500];
    }

    const history = useHistory();
    const info = useSelector(state => state.authentication.status);
    
    const [result, setResult] = React.useState({ url : '/api/delete', seq : 0, message : '정말로 삭제하시겠습니까?', open : false, callback: {open : false, messge : '', error : false} });
    const handleClick = (e) => {
        const {name, value} = {name : e.currentTarget.name, value : e.currentTarget.getAttribute('value')};
        if(name == 'update') {
            history.push({
                pathname : '/view/form',
                state : { seq : value }
            })
        } else if(name=='delete') {
            setResult({  ...result,  open : true }) 
        }
    }

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
      };
    
      const handleCloseNavMenu = () => {
        setAnchorElNav(null);
      };

    const handleClose = () => {
        setResult({  
            ...result,  
            open : false, 
            callback : {
                ...result.callback,
                open : false,
            } }) 
    }

    const handleCallback = () => {
        axios.post('/api/card/delete', {'seq' : props.card.seq}).then( async res => {
            setResult({  
                ...result,  
                open : false, 
                callback : {
                    ...result.callback,
                    open : true,
                    message : res.data.message,
                    error : res.status != 200
                } 
            }) 
          }).catch(async error => {
            setResult({  
                ...result,  
                open : false, 
                callback : {
                    ...result.callback,
                    open : true,
                    message : error.response.data.message,
                    error : true
                } 
            }) 
          });

        history.push({
            pathname : '/view/list',
              state : {
                searchForm : props.searchForm
            }
        })
    }
    React.useEffect(() => {
    }, [result]);
    return (
        <React.Fragment>
            <Grid item xs={12} md={4} >
                <ConfirmPopup open={result.open}  msg = '정말로 삭제하시겠습니까?'  handleClose={handleClose} handleCallback={handleCallback} />
                <AlimPopup open={result.callback.open} handleClose={handleClose} msg={result.callback.message} error={result.callback.error}/>
                <Card color='inherit' variant="outlined" mt={5}>
                    <CardHeader 
                        avatar={
                            <Avatar sx={{ bgcolor : color, fontSize : '1rem' }} aria-label="recipe">
                              {props.card.category == null ? '-' : props.card.category}
                            </Avatar>
                          }
                          action={ (info.currentUser.EMAIL == props.card.sender) && props.isClosed == 'N' ? 
                            <Box>
                                <IconButton aria-label="settings" onClick={handleOpenNavMenu}>
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu id="menu-appbar"
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
                                >
                                    <MenuItem key={props.card.seq} onClick={handleCloseNavMenu}>
                                        <EditOutlinedIcon/>
                                        <Link name="update" value={props.card.seq} color="inherit" onClick={handleClick} sx={{textDecoration : 'none'}}> 수정</Link>
                                    </MenuItem> 
                                    <MenuItem key={props.card.seq} onClick={handleCloseNavMenu}>
                                        <DeleteOutlineOutlinedIcon />
                                        <Link name="delete" value={props.card.seq} color="inherit" onClick={handleClick} sx={{textDecoration : 'none'}}>삭제</Link> 
                                    </MenuItem> 
                                </Menu>
                            </Box> : null }  
                        title={ props.searchForm.cards == 4 ?  
                            <div> {props.card.receiver} <Chip color="warning" label={props.card.evaluation} size="small"  /></div>
                            : props.card.receiver } 
                        subheader={(info.currentUser.email == props.card.sender) || (info.currentUser.name == props.card.sender) ? props.card.sendDt : props.card.readDt == '' ? '-' : props.card.readDt}
                    />
                    <CardContent>
                        {props.card.content.split('\n').map((line) => { 
                            return (<Typography variant="body2" color="text.secondary" sx={{ wordBreak : 'break-all'}}> {line}</Typography>)  })  
                            } 
                    </CardContent>

                    {/* <CardActions disableSpacing>
                        {props.isRecPeriodYn ? <Evaluation seq={props.card.seq} evaluation={props.card.evaluation} isRecClosed={props.isRecPeriodYn} searchForm = {props.searchForm} /> : null}
                    </CardActions> */}
                </Card>
        </Grid>
      </React.Fragment>
    )
};

