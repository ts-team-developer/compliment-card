import React, {Component, useEffect, useState} from 'react';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CardMedia from '@mui/material/CardMedia';
import { Link } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import CardActions from '@mui/material/CardActions';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  boxShadow: 24,
  p: 4,
};

const employeeList = [
    { label: '남기욱', id : 'ahakuki' },
    { label: '전성진', id : 'sjJeon' },
    { label: '최석환', id: 'choish' },
    { label: '장혜진', id: 'jang314' },
    { label: '이수진', id: 'sjlee' },
    { label: "민경철", id: 'kmin1145' },
    { label: '김현송', id: 'hskim' },
    { label: '이문혁', id: 'leemh' }
  ];

const formHeader = (
  <div>
    <Typography variant="h5" component="div">작성 유의사항</Typography>
    <Typography variant="body2" sx={{ mt : 4 }}>
       칭찬카드는 무엇 때문에 칭찬을 받는지 미담 사례를 구체적으로 작성해주세요. <br/>
       분기별로 가장 많이 칭찬을 받은 카드를 상단 "우수 칭찬카드" 메뉴에서 확인할 수 있으니 작성 시 참조해주세요
     </Typography>
     <Typography sx={{ mb: 1.5, mt:3 }} color="text.secondary">
       ※ 미담 (美談) : 사람을 감동시킬 만큼 아름다운 내용을 가진 이야기
     </Typography>
  </div>
);

const formBody = (
  <Box
        component="form"
        noValidate
        autoComplete="off"
        >
        <Typography sx={{ mr: 3, mt:-1, mb:1, fontSize: '0.8em', float:'right' }} color="error">
          * 타 팀을 먼저 칭찬해주세요.
        </Typography>
            <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={employeeList}
        sx={{ m :2 }}
        renderInput={(params) => <TextField {...params} label="받는사람" />}
      />
        <TextField
        id="outlined-multiline-static"
        label="칭찬내용"
        placeholder=" 칭찬 내용을 최소 100자 이상 입력해 주세요."
        multiline
        rows={10}
        sx={{ m : 2, mt : 0, width : '97%' }}
      />
  
      </Box>
);



class form extends Component {
  constructor(props) {
      super(props)
    this.state={
      open : false,
      setOpen : false
    }
  }
  handleOpen = () => {
    this.state.setOpen(true)
  };
  
  render() {
      return (
        <React.Fragment>
        <CssBaseline />
        <CardMedia  sx={{borderBottom : '1px solid #eee'}}>
          {formHeader}
        </CardMedia>
        
        <CardContent>
          {formBody}
        </CardContent>

        <CardActions sx={{m : 2, float:'right'}}>
        <div>
          <Button size="small" variant="contained" sx={{mr:1}} onClick={()=>{
            var self = this;
            axios.post('http://localhost:3001/register', {
              id : 4,
              name : 'test'
            }).then(function () {
              self.setState({open : true})
            });
          }}> 저장</Button>
          <Modal
            open={this.state.open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Alert sx={style} severity="success">
            <AlertTitle>Success</AlertTitle>
                 <strong>저장되었습니다!</strong>
            </Alert>
        </Modal>
          <Link to="/list" style={{ textDecoration: 'none', color: 'white' }}  >
              <Button size="small" variant="outlined" to="/list" >목록</Button>
          </Link>
        </div>
        </CardActions>
      </React.Fragment>
      )
  }
}

export default form;