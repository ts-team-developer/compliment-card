import React from 'react';
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
import Alim from '../modal/alert'; 

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
  axios.get('/api/selectbody')
  .then(({data}) => {
    data[0].forEach(element => {
      employeeList.push({label : element.name_kor, value : element.email})
    });
})


export default function Form(props) {
  const [result, setResult] = React.useState({ status : '', open : false,  msg : '', url : ''});
  const [form, setForm] = React.useState({receiver : '', content : '', seq : ''});
 
  const [receiver, setReceiver] = React.useState(props.forms == null ? '' : props.forms.RECEIVER);
  const [content, setContent] = React.useState(props.forms == null ? '' : props.forms.CONTENT);
  const [count, setCount] = React.useState(props.forms == null ? 0 : props.forms.CONTENT.length);
  const [seq, setSeq] = React.useState(props.forms == null ? 0 : props.forms.SEQ)
  
  // 저장버튼 클릭 이벤트
  const handleOpen = async () => {
      axios.post('/api/register', {'receiver' : receiver, 'content' : content, 'seq' : seq}).then(res => {
        if(res.status == 200) {
          setResult({
            ...result,
            status : 'success',
            msg : '제출되었습니다.',
            url : '/view/list',
            open : true
          })
        } else {
          setResult({
            ...result,
            status : 'error',
            msg : res.data.message,
            url : '',
            open : true
          })
        }
      }).catch( error => {
        setResult({
          ...result,
          status : 'error',
          msg : error,
          url : '',
          open : true
        })
      });
    } 
  ;

  React.useEffect(() => {
    if(props.userLogin.quarter == null) {
      setResult({
        ...result,
        status : 'error',
        msg : '칭찬카드 작성 기간이 아닙니다.',
        url : '/view/list',
        open : true
      })
    }
  } , []);

  return (
     <React.Fragment>
        <CssBaseline />
        <CardMedia  sx={{borderBottom : '1px solid #eee'}}>
        <div>
      <Typography variant="h5" component="div" sx={{fontFamily: 'NanumSquare', fontWeight: 'bold', ml:2}}>작성 유의사항 </Typography>
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
        <Box component="form" noValidate autoComplete="off">
         
          <Autocomplete disablePortal id="combo-box-demo" sx={{ m :2, fontFamily: 'Nanum Gothic' }} options={employeeList} name="receiver" 
            renderInput={(params) => {
               if(props.forms != null) {
                params.inputProps.value=receiver
               }
               setReceiver(params.inputProps.value)
               
               return (<TextField {...params} label="받는사람" required error={result.error} value={receiver}  helperText={result.msg} />)
             }
            
            }   onChange={(e, params) => {
              setReceiver(params.label)
            }}/>

          <TextField multiline id="outlined-multiline-static" label="칭찬내용" placeholder="칭찬내용" rows={10} name="content"  required
          helperText={"* 내용은 100자 이상 입력해주세요. ["+count+"자 입력 중]"} value={content}
          error={result.error}
                     onChange={(event) => {
                       setCount(event.target.value.length)
                       setContent(event.target.value);
                       if(count < 100) {
                        setResult({
                          ...result,
                          status : 'error',
                          open : false
                        })
                       } else {
                        setResult({
                          ...result,
                          status : 'info',
                          open : false
                        })
                       }
                    }} sx={{ m : 2, mt : 0, width : '97%', fontFamily: 'NanumSquare' }} />
        </Box>
        
        </CardContent>
        <CardActions sx={{m : 2, float:'right'}}>
          <Button size="small" variant="contained" sx={{mr:1, fontFamily: 'NanumSquare'}} onClick={handleOpen}> {props.forms == null ? "저장" : "수정"}</Button>
          <Alim open={result.open} status={result.status} msg={result.msg} url={result.url}  />
          <Link to="/view/list" style={{ textDecoration: 'none', color: 'white', fontFamily: 'NanumSquare' }}  >
              <Button size="small" variant="outlined" to="/view/list" >목록</Button>
          </Link>
        </CardActions>
      </React.Fragment>
  );
}
