import * as React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { FormControl, Grid, Button, TextField  } from '@mui/material';
import { DataGrid }  from '@mui/x-data-grid';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';


export default function FixedContainer() {

  const columns = [
    // { field: 'idx', headerName: '순서', width: 90 },
    { field: 'QUARTER', headerName: '분기', width: 100,},
    { field: 'SEND_DT', headerName: '날짜', width: 100,},
    { field: 'RECEIVER', headerName: '받은 사람', width: 80 },
    { field: 'CATEGORY', headerName: '카테고리', width: 80,},
    { field: 'SENDER', headerName: '작성한 사람', width: 80 },
    { field: 'CONTENT', headerName: '칭찬 내용', width: 1000,},
  ];

  const info = useSelector(state => state.authentication.status);

  const [rows, setRowList] = React.useState([]);
  const [value, setValue] = React.useState(info.quarterInfo.QUARTER);
  const [inputValue, setInputValue] = React.useState('');
  const [searchForm, setSearchForm] = React.useState({ quarter : info.quarterInfo.QUARTER, receiver : '' });
  const quarterList= [];
  const nameList = []
   axios.get('/api/quarter/list', {params: { sort : 'Y' }})
    .then(({data}) => {
      data[0].forEach(element => {
        quarterList.push({label : element.quarter})
      });
    })

    axios.get('/api/emp/list').then(({data}) => {
        data[0].forEach(element => {
            nameList.push({label : element.name_kor})
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
    setSearchForm({...searchForm, quarter:value.label, receiver:inputValue})
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Grid container spacing={1} sx={{ marginBottom: '20px'}}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth >
            <Autocomplete disablePortal
              id="combo-box-demo"
              options={quarterList}
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              renderInput={(params) => <TextField {...params} label="칭찬카드 분기" />}
              size="small"
            />
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <FormControl fullWidth >
            <Autocomplete freeSolo
                id="free-solo-2-demo"
                disableClearable
                size="small"
                options={nameList.map((option) => option.label)}
                onInputChange={(event, newInputValue) => { setInputValue(newInputValue); }}
                renderInput={(params) => (
                  <TextField {...params} label="직원 이름" InputProps={{ ...params.InputProps, type: 'search',  }} />
                )} />   
            </FormControl>
          </Grid>
          <Grid item xs={12} md={1}>
            <FormControl fullWidth>
              <Button variant="outlined" size="medium" onClick={handleClick} fullWidth>조회</Button>  
            </FormControl>
          </Grid>
      </Grid>
      
      <div style={{ height: 400, width: '100%'}}>
        <DataGrid getRowId={(rows) => rows.SEQ}
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5]}
        />
      </div>
    </React.Fragment>
  );
}