import * as React from 'react';
import { useLocation } from "react-router";
import { Link, useHistory } from 'react-router-dom';

import axios from 'axios';

import { Box, Button, TextField, Autocomplete, CardActions, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { AlimPopup } from '../../modal/index';

import { usePcStyles, useMobileStyles } from "../../../styles/styles"
import { useMediaQuery } from "@material-ui/core";

let employeeList= [];

export default function Form(props) {
    // Style 관련 CSS
    const isMobile = useMediaQuery("(max-width: 600px)");
    const classes = usePcStyles();
    const mobile = useMobileStyles();

    const history = useHistory();
    const location = useLocation();
    const [values, setValues] = React.useState({receiver : '', content : '', seq : 0, token : '', category : ''});
    const [result, setResult] = React.useState({ url : '', error : true, message : '', open : false});
    const [categories, setCategories] = React.useState([]);

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
    const {name , value } = (e.target.name == 'category' || e.target.name=='content') ? e.target : {name : 'receiver', value :params.value};
    setValues({ ...values, [name]: value });
    setResult({...result ,
      error : !(values.receiver.length > 0 && values.content.length > 100 && values.category.length > 0),
      message : values.content.length <  50 ? '내용은 50자 이상 입력해주세요.' : values.receiver.length <= 0 ? '받는 사람을 선택해주세요.' : values.category.length <=0 ? '카테고리를 선택해 주세요.' :''})
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
    }, []);

    try{
      employeeList = []
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
          content : data[0][0].CONTENT,
          category : data[0][0].CATEGORY
        })
      });
    }catch(err) {  }


    try {
      axios.get('/api/category/list').then(({data}) => {
        setCategories(data[0])
      })
    }catch(err) {

    }
  }, []);

  return (
    <Box  component="form" noValidate autoComplete="off" p={0}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth error={values.category.length == 0} size={isMobile ? 'small' : 'medium'} >
            <InputLabel id="demo-simple-select-label">카테고리* </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={values.category}
              name="category"
              label="카테고리 *"
              onChange={handleChange} >
              {categories.map((el, key) => {
                return (<MenuItem name="category" value={el.KEY}>{el.VALUE}</MenuItem>);
              })}
          </Select>
        </FormControl>
        </Grid>
        <Grid item xs={12} md={10}>
          <Autocomplete  disablePortal id="combo-box-demo"
            options={employeeList}
            className={isMobile ? mobile.searchEl : classes.searchEl}
            size={isMobile ? 'small' : 'medium'}
            renderInput={(params) => {
                if(values.seq > 0)  {
                    employeeList.map((el, key) => {
                      if(el.value == values.receiver)  params.inputProps.value = el.label
                    });
                  }
                return (<TextField fullWidth className={isMobile ? mobile.searchEl : classes.searchEl} {...params} label="받는사람" size={isMobile ? 'small' : 'medium'} required error={params.inputProps.value.length == 0}  onChange={handleChange} />)
              }
            }
            onChange={(e, params) => { handleChange(e, params)}}
            />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth
              multiline id="outlined-multiline-static" label="칭찬내용" placeholder="칭찬내용" rows={10} name="content"  required
              helperText={`* ${result.message} [${values.content.length}자 입력 중]`} value={values.content} size={isMobile ? 'small' : 'medium'}
              error={values.content.length < 50}
              onChange={handleChange} />
        </Grid>
      </Grid>

      {/* 저장, 목록으로 가는 버튼 */}
      <CardActions className={classes.formButton}>
        <Grid container spacing={2} >
          <Grid item xs={12}>
          <Button size="large" variant="contained" color="error" sx={{mr:1}} onClick={handleOpen}>제출</Button>
          <Link to="/view/list" className={classes.link}>
            <Button size="large" variant="contained" color="info" to="/view/list">취소</Button>
          </Link>
          </Grid>
        </Grid>
      </CardActions>
      <AlimPopup open={result.open} handleClose={handleClose} msg={result.message} error={result.error} url={result.url}/>
    </Box>
  );
}
