import * as React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { DataGrid, gridColumnsSelector }  from '@mui/x-data-grid';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';


export default function FixedContainer() {

  const columns = [
    // { field: 'idx', headerName: '순서', width: 90 },
    { field: 'QUARTER', headerName: '년도', width: 200,},
    { field: 'SENDER', headerName: '작성자', width: 200,},
    { field: 'SUM', headerName: '점수', width: 300,}
  ];


  const info = useSelector(state => state.authentication.status);

  const [rows, setRowList] = React.useState([]);
  const [value, setValue] = React.useState((info.quarterInfo.QUARTER).substr(0,7));
  const [value2, setValue2] = React.useState("");

  const [searchForm, setSearchForm] = React.useState({ quarter : (info.quarterInfo.QUARTER).substr(0,7) });

  const quarterList= ['1분기','2분기','3분기','4분기'];
  const yearList= [];

   axios.get('/api/quarter/listOfYear' , {params: { sort : 'Y' }})
    .then(({data}) => {
      data[0].forEach(element => {
        yearList.push({label : element.QUARTER})
      });
    })


  React.useEffect( () => {
      
    axios.get('/api/statistics/point', {params : searchForm})
    .then(({data}) => {
        try{
            setRowList(data[0]);
        }catch(error) {
            console.log(error)
        }
    });

  },[info, value, value2, searchForm]);

  const handleClick = () => {
    if(value.label==undefined){
      setSearchForm({quarter: value + value2 })  
    } else{
      setSearchForm({quarter: value.label + value2 })
    }
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
                      options={yearList}
                      value={value}
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                      sx={{ m :2, ml: -1, width: '20%', display: 'inline-block'}}
                      renderInput={(params) => <TextField {...params} label="칭찬카드 년도" />}
                      size="small"
                  />
                  <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={quarterList}
                      value={value2}
                      onChange={(event, newValue2) => {
                        setValue2(newValue2);
                      }}
                      sx={{ m :2, ml: -1, width: '20%', display: 'inline-block'}}
                      renderInput={(params) => <TextField {...params} label="칭찬카드 분기" />}
                      size="small"
                  />
                  <Typography variant="body2" sx={{display: 'inline-block', verticalAlign:'middle', mt:1.5, ml:2 }}>
                        <Button variant="outlined" sx={{fontWeight:'bold' , color:'#5f5f5f', border:'1px solid #d3d3d3' }}  onClick={handleClick} >조회</Button>  
                  </Typography>
              </Box>
            </CardContent>
                <CardContent>
                <div style={{ height: 400, width: '100%' }}>
                  <DataGrid getRowId={(rows) => rows.idx}
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