import * as React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { DataGrid, gridColumnsSelector }  from '@mui/x-data-grid';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';


export default function FixedContainer() {

  const columns = [
    // { field: 'idx', headerName: '순서', width: 90 },
    { field: 'QUARTER', headerName: '분기', width: 150,},
    { field: 'SEND_DT', headerName: '날짜', width: 150,},
    { field: 'RECEIVER', headerName: '받은 사람', width: 120 },
    { field: 'SENDER', headerName: '작성한 사람', width: 150 },
    { field: 'CONTENT', headerName: '칭찬 내용', width: 400,}
  ];

  const info = useSelector(state => state.authentication.status);

  const [rows, setRowList] = React.useState([]);
  const [value, setValue] = React.useState(info.quarterInfo.QUARTER);
  const [inputValue, setInputValue] = React.useState('');

  const [searchForm, setSearchForm] = React.useState({ quarter : info.quarterInfo.QUARTER });

  const quarterList= [];

  //const nameList = [{"label":"강다현"},{"label":"강성조"},{"label":"구다솜"},{"label":"김민수"},{"label":"김병진"},{"label":"김성현"},{"label":"김은기"},{"label":"김주희"},{"label":"김혜준"},{"label":"남기욱"},{"label":"민경철"},{"label":"박은주"},{"label":"박준영"},{"label":"백진석"},{"label":"성은영"},{"label":"소지철"},{"label":"송용화"},{"label":"송치호"},{"label":"신승철"},{"label":"심재효"},{"label":"안석민"},{"label":"원조연"},{"label":"윤아름"},{"label":"이관형"},{"label":"이동진"},{"label":"이수진"},{"label":"이시황"},{"label":"이정훈"},{"label":"이현섭"},{"label":"임수진"},{"label":"장준영"},{"label":"장혜진"},{"label":"전성진"},{"label":"전윤일"},{"label":"정다운"},{"label":"조봉진"},{"label":"조종철"},{"label":"조현진"},{"label":"차현철"},{"label":"최석환"},{"label":"최지은"},{"label":"최형욱"},{"label":"한동수"},{"label":"한예나"},{"label":"황윤규"}];
  const nameList = []

   axios.get('/api/quarter/list', {params: { sort : 'Y' }})
    .then(({data}) => {
      data[0].forEach(element => {
        quarterList.push({label : element.quarter})
      });
    })

    axios.get('/api/emp/list')
      .then(({data}) => {
        data[0].forEach(element => {
            nameList.push({label : element.name_kor})
            //console.log(JSON.stringify(nameList));
      })
    });

  React.useEffect( () => {
      
    axios.get('/api/statistics/emp', {params : searchForm})
    .then(({data}) => {
        try{
            setRowList(data[0]);
        }catch(error) {
            console.log(error)
        }
    });
  
    
  },[info, value, searchForm]);

  const handleClick = () => {
    setSearchForm({quarter:value.label, receiver:inputValue})
  }

  return (
    <React.Fragment>
    <CssBaseline />
      <Container fixed >
        <Box sx={{ bgcolor: 'none', height: '100vh' }} sx={{ mt: 6 }} >
            <Card variant="outlined">
            <CardContent>
              <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{mb : -2, ml : 2 , fontWeight:'bold'}}
              >
                  <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={quarterList}
                      value={value}
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                      sx={{ m :2, ml: -1, width: '20%', display: 'inline-block'}}
                      renderInput={(params) => <TextField {...params} label="칭찬카드 분기" />}
                      size="small"
                  />
                  <Autocomplete
                    freeSolo
                    id="free-solo-2-demo"
                    disableClearable
                    sx={{ m :2, ml: -1, width: '20%', display: 'inline-block'}}
                    size="small"
                    options={nameList.map((option) => option.label)}
                    onInputChange={(event, newInputValue) => {
                      setInputValue(newInputValue);
                      console.log("=============" + JSON.stringify(nameList));
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="직원 이름"
                            InputProps={{
                            ...params.InputProps,
                            type: 'search',
                            }}
                        />
                        )}
                    />   
                  <Typography variant="body2" sx={{display: 'inline-block', verticalAlign:'middle', mt:1.5, ml:2 }}>
                        <Button variant="outlined" sx={{fontWeight:'bold' , color:'#5f5f5f', border:'1px solid #d3d3d3' }}  onClick={handleClick} >조회</Button>  
                  </Typography>
              </Box>
            </CardContent>
                <CardContent>
                <div style={{ height: 400, width: '100%'}}>
                  <DataGrid getRowId={(rows) => rows.SEQ}

                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5]}
                  />
                </div>
                </CardContent>
            </Card>
        </Box>
      </Container>
    </React.Fragment>
  );
}