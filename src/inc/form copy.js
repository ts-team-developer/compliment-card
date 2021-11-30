import React, {Component, useEffect, useRef, useState} from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
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

// 모달창 스타일
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  boxShadow: 24,
  p: 4,
};

// 받는사람 LIST
const employeeList= [];
axios.get('http://localhost:3001/selectbody')
.then(({data}) => {
  for(var i = 0 ; i < data.emps.length; i++) {
    employeeList.push({label : data.emps[i].name_kor, value : data.emps[i].email})
  }
})



export default function Form() {
  // 페이지 이동을 위한 변수 선언
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [inputs, setInputs] = useState({
    name : '',
    nickname : ''
  });

  const {receives, contns} = React.useState('')
  
  const inputChange = (e, val) => {
    console.log('value ; ' + val)
    receives
  }
  // 저장버튼 클릭 이벤트
  const handleOpen = () => {
    //  axios.post('http://localhost:3001/register').then(function (res) {
     // }).catch(function (res, status, err) {
     // });
    setOpen(true);
  }

  return (
     <React.Fragment>
        <CssBaseline />
        <CardMedia  sx={{borderBottom : '1px solid #eee'}}>
        <div>
      <Typography variant="h5" component="div" sx={{fontFamily: 'NanumSquare', fontWeight: 'bold', ml:2}}>작성 유의사항</Typography>
      <Typography variant="body2" sx={{ mt : 4 , fontFamily: 'NanumSquare', ml:2}}>
         칭찬카드는 무엇 때문에 칭찬을 받는지 미담 사례를 구체적으로 작성해주세요. <br/>
         분기별로 가장 많이 칭찬을 받은 카드를 상단 "우수 칭찬카드" 메뉴에서 확인할 수 있으니 작성 시 참조해주세요
       </Typography>
       <Typography sx={{ mb: 1.5, mt:3, fontFamily: 'NanumGothic', ml:2 }} color="text.secondary">
         <p>※ 미담 (美談) : 사람을 감동시킬 만큼 아름다운 내용을 가진 이야기 </p>
       </Typography>
    </div>
        </CardMedia>
        <CardContent>
        <Box  component="form" noValidate autoComplete="off">
          <Typography sx={{ mr: 3, mt:-1, mb:1, fontSize: '0.8em', float:'right', fontFamily: 'NanumSquare' }} color="error">
            * 타 팀을 먼저 칭찬해주세요.
          </Typography>
          <Autocomplete disablePortal id="combo-box-demo" sx={{ m :2, fontFamily: 'Nanum Gothic' }} options={employeeList} onInputChange={inputChange} name="receiver" 
            renderInput={(params) => {
            //  console.log(params.inputProps.value)
             
              return (<TextField {...params} label="받는사람" onLoad={e => {
                console.log("DATE")
              }}   />)
              }
            } />
            <input type="hidden" name="receiver" onChange="" />
          <TextField multiline id="outlined-multiline-static" label="칭찬내용" placeholder="칭찬내용" rows={10} name="content" 
                     onChange={(event, value) => {
                      console.log("value ; "+event.target.value)
                    }} sx={{ m : 2, mt : 0, width : '97%', fontFamily: 'Nanum Gothic' }} />
          <Typography sx={{ mr: 3, mt:-1, mb:1, fontSize: '0.8em', float:'right', fontFamily: 'NanumSquare' }} color="error">자</Typography>
        </Box>
        
        </CardContent>

        <CardActions sx={{m : 2, mr: -5, float:'right'}}>
          <Button size="small" variant="contained" sx={{mr:1, fontFamily: 'NanumSquare'}} onClick={handleOpen}> 저장</Button>
          <Modal open={open}
               onClose={() => { history.push('/list')}}
               aria-labelledby="modal-modal-title"
               aria-describedby="modal-modal-description">
            <Alert severity='success'  sx={style}  onClose={() => {   history.push('/list') }}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
              <AlertTitle>성공</AlertTitle>
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                제출되었습니다.
              </Typography>
              </Alert>
          </Modal>
          <Link to="/list" style={{ textDecoration: 'none', color: 'white', fontFamily: 'NanumSquare' }}  >
              <Button size="small" variant="outlined" to="/list" >목록</Button>
          </Link>
        </CardActions>
      </React.Fragment>
  );
}
