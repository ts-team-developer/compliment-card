import * as React from 'react';
import { useLocation } from "react-router";
import { Link, useHistory } from 'react-router-dom';

import axios from 'axios';
import { useSelector } from 'react-redux';

import { Box, CardContent, Button, TextField, Autocomplete, CardActions, Grid } from '@mui/material';
import { AlimPopup } from '../../modal/index';



const employeeList= [];

export default function Form(props) {
  const style = { display : 'block', width: '100%', textAlign : 'center', borderRadius : '0' }

  const info = useSelector(state => state.authentication.status);
  const history = useHistory();
  const location = useLocation();
  const [values, setValues] = React.useState({receiver : '', content : '', seq : 0, token : ''});
  const [result, setResult] = React.useState({ url : '', error : true, message : '', open : false});

  // 저장버튼 클릭 이벤트
  const handleOpen = async () => {
      axios.post('/api/card/save', values).then( async res => {
        setResult({ ...result, open : true, error : res.status != 200, message : res.data.message, url : res.status != 200 ? '' : '/view/list' })
      }).catch(async error => {
        setResult({ ...result, open : true, error :true, message : error.response.data.message , url : '' })
      });
    } 
    
  const handleClose = () => { 
    setResult({  ...result,  open : false }) 
    if(!result.error) {
      history.push('/view/list')
    }
  }

  const handleChange = (e, params) => {
    const { name, value } = (typeof params == "undefined") ? e.target : {name : 'receiver', value :params.value}
    setValues({ ...values, [name]: value });
    setResult({...result , 
      error : !(values.receiver.length > 0 && values.content.length > 100), 
      message : values.content.length <  100 ? '내용은 100자 이상 입력해주세요.' : values.receiver.length <= 0 ? '받는 사람을 선택해주세요.' : ''})
  }
  React.useEffect(() => {
    axios.get('/api/quarter/detail').then(({data}) => {
      if(data[0][0]) {
        if(data[0][0].isClosed == 'Y') {
          setResult({...result , 
            open : true,
            error : false, 
            message : '칭찬카드 작성기간이 아닙니다. ',
            url : '/view/list'
          });
        }
      }
    });

    try{
      axios.get('/api/emp/list')
      .then(({data}) => {
        data[0].forEach(element => {
        employeeList.push({ label : element.name_kor, value : element.email })
      });
    })
    }catch(err) {
      console.log(err)
    }

   
    
    try{
      // 수정폼일 시 SEQ값으로 데이터를 조회한다.
      axios.get('/api/card/detail', {params: { seq : location.state.seq }})
      .then(({data}) => {
        setValues({ ...values, 
          seq : data[0][0].SEQ,
          receiver : data[0][0].RECEIVER,
          content : data[0][0].CONTENT
        })
      });
    }catch(err) {  }
  }, []);

  return (
    <Box component="form" noValidate autoComplete="off">
      <CardContent>
        {/* 받는사람 입력 */}
        <Autocomplete  disablePortal id="combo-box-demo" 
          sx={{ m : 2 }} 
          size="small"
          options={employeeList} 
          renderInput={(params) => {
              if(values.seq > 0)  {
                  employeeList.map((el, key) => {
                    if(el.value == values.receiver)  params.inputProps.value = el.label
                  });
                }
              return (<TextField fullWidth {...params} label="받는사람" required error={params.inputProps.value.length == 0}  onChange={handleChange} />)
            }
          }   
           onChange={(e, params) => { handleChange(e, params)}}
          />

          {/* 내용입력 */}
          <TextField fullWidth
            multiline id="outlined-multiline-static" label="칭찬내용" placeholder="칭찬내용" rows={10} name="content"  required
            helperText={`* ${result.message} [${values.content.length}자 입력 중]`} value={values.content}
            error={values.content.length < 100}
            sx={{ m : 2, mt : 0, width: '97%' , fontFamily: 'NanumSquare' }} 
            onChange={handleChange} />
      </CardContent>
      
      {/* 저장, 목록으로 가는 버튼 */}
      <CardActions sx={{m : 2, float:'right', display : {xs:'none', md:'block'}}}>
        <Button size="small" variant="contained" sx={{mr:1, fontFamily: 'NanumSquare'}} onClick={handleOpen}> 저장</Button>
        <Link to="/view/list" style={{ textDecoration: 'none', color: 'white', fontFamily: 'NanumSquare' }}  >
          <Button size="small" variant="outlined" to="/view/list">목록</Button>
        </Link>
      </CardActions>

      <Box sx={{ display:{xs:'block', md:'none'}}}>
        <Grid container spacing={0} sx={{position:'fixed', bottom:'0', left:'0'}}>
          <Grid item xs={6}>
            <Button variant='contained' color="error" size="large" to="/view/list" sx={style} onClick={handleOpen}  >저장</Button>
          </Grid>
          <Grid item xs={6}>
          <Link to="/view/list" style={{ textDecoration: 'none', color: 'white', fontFamily: 'NanumSquare' }}  >
            <Button variant='contained' color="info" size="large"  sx={style} to="/view/list">목록</Button>
          </Link>
          </Grid>

        </Grid>
      </Box>
        
      {/* validation체크를 위한 모달창 띄우기 */}
      <AlimPopup open={result.open} handleClose={handleClose} msg={result.message} error={result.error} url={result.url}/>
    </Box>
        
  );
}
