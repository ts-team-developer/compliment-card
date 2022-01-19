import React, { Component } from 'react';

import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Rating from '@mui/material/Rating';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useHistory } from "react-router-dom";
import Grid from '@mui/material/Grid';
import CardActions from '@mui/material/CardActions';
import Link from '@mui/material/Link';

import ConfirmPopup from '../../modal/ConfirmPopup';
import AlimPopup from '../../modal/AlimPopup';
import Evaluation from '../list/Evaluation'
import axios from 'axios';

export default function PraiseCard(props) {
    const history = useHistory();
    const [result, setResult] = React.useState({ url : '/api/delete', seq : 0, message : '정말로 삭제하시겠습니까?', open : false, callback: {open : false, messge : '', error : false} });

    const handleClick = (e) => {
        const {name, value} = {name : e.currentTarget.name, value : e.currentTarget.getAttribute('value')};
        console.log(`value : ${value}`)
        
        if(name == 'update') {
            history.push({
                pathname : '/view/form',
                state : { seq : value }
            })
        } else if(name=='delete') {
            setResult({  ...result,  open : true }) 
        }
    }

    const handleClose = () => {
        setResult({  
            ...result,  
            open : false, 
            callback : {
                ...result.callback,
                open : false,
            } }) 

        props.handleReload();
    }

    const handleCallback = () => {
        axios.post('/api/deleteCard', {'seq' : props.card.seq}).then( async res => {
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

    return (
        <Grid item xs={12} md={4}>
            <ConfirmPopup open={result.open}  msg = '정말로 삭제하시겠습니까?'  handleClose={handleClose} handleCallback={handleCallback} />
            <AlimPopup open={result.callback.open} handleClose={handleClose} msg={result.callback.message} error={result.callback.error}/>

            <Card color="info"  severity="success" sx={{backgroudColor : '#dff0d8'}}>    
                <CardContent sx={{backgroudColor : '#dff0d8'}}>
                    <Typography variant="subtitle1"  sx={{fontFamily : 'NanumGothic', fontWeight : 'bold', float : 'left'}}>
                        {props.card.receiver} 
                    </Typography>
                    <Typography variant="subtitle1"  sx={{fontFamily : 'NanumGothic', fontWeight : 'bold', float : 'right'}}>
                    <React.Fragment>
                        <Link name="update" value={props.card.seq}  color="inherit"  onClick={handleClick}>
                            <EditOutlinedIcon sx={{fontSize : 'medium', mr : '5px'}}  />
                        </Link>

                        <Link name="delete" value={props.card.seq}  color="inherit" onClick={handleClick}>
                            <DeleteOutlineOutlinedIcon sx={{fontSize : 'medium'}}   />
                        </Link>
                    </React.Fragment>
                    </Typography>
                </CardContent>

                <CardContent>
                    <Typography variant="caption" color="text.secondary"  sx={{fontFamily : 'NanumGothic'}}> {props.card.sendDt}</Typography>
                </CardContent>

                <CardContent>
                    <Typography variant="body2" color="text.secondary" sx={{fontFamily : 'NanumGothic'}}>{props.card.content}</Typography>
                </CardContent>

                <CardActions disableSpacing>
                    <Evaluation evaluation={props.card.evaluation} isRecClosed={props.isRecPeriodYn} />
                </CardActions>
            </Card>
      </Grid>
    )
};

