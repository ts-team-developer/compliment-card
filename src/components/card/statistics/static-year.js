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
     { field: 'name', headerName: '이름', width: 150,},
    { field: 'Q1', headerName: '1분기', width: 150,},
    { field: 'Q2', headerName: '2분기', width: 150,},
    { field: 'Q3', headerName: '3분기', width: 150,},
    { field: 'Q4', headerName: '4분기', width: 150,}
  ];


  const info = useSelector(state => state.authentication.status);

  const quarter = (info.quarterInfo.QUARTER).substr(0,6);

  const [rows, setRowList] = React.useState([]);
  const [value, setValue] = React.useState(quarter);

  const [searchForm, setSearchForm] = React.useState({ quarter : quarter , isPraise : 'Y' });
  const [cardStyle, setCardStyle] = React.useState({border : "1px solid rgb(25, 118, 210)",backgroud : "rgba(25, 118, 210, 0.04)"});
  const [card2Style, setCard2Style] = React.useState();

  const quarterList= [];

   axios.get('/api/quarter/listOfYear' , {params: { sort : 'Y' }} )
    .then(({data}) => {
      data[0].forEach(element => {
        quarterList.push({label : element.QUARTER})
      });
    })


  React.useEffect( () => {
      
    axios.get('/api/statistics/year', {params : searchForm})
    .then(({data}) => {
        try{
            setRowList(data[0]);
        }catch(error) {
            console.log(error)
        }
    });

  },[info, value, searchForm]);

  const handleClick = () => {
    if(value.label==undefined){
      setSearchForm({quarter:value, isPraise : 'Y'})
    } else{
      setSearchForm({quarter:value.label, isPraise : 'Y'})
    }

    setCardStyle( { border : "1px solid rgb(25, 118, 210)",backgroud : "rgba(25, 118, 210, 0.04)" })
    setCard2Style( { border : "1px solid rgb(211, 211, 211)", backgroud : "white" })
  }

  const handleClick2 = () => {
  if(value.label==undefined){
    setSearchForm({quarter:value, isPraise : 'N'})
  } else{
    setSearchForm({quarter:value.label, isPraise : 'N'})
  }

  
  setCard2Style( { border : "1px solid rgb(25, 118, 210)",backgroud : "rgba(25, 118, 210, 0.04)" })
  setCardStyle( { border : "1px solid rgb(211, 211, 211)", backgroud : "white" })
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
                  <Typography variant="body2" sx={{display: 'inline-block', verticalAlign:'middle', mt:1.5, ml:2 }}>
                        <Button variant="outlined" sx={{fontWeight:'bold' , color:'#5f5f5f', border:'1px solid #d3d3d3', marginRight:'5px' }} style={cardStyle} onClick={handleClick} >칭찬 함</Button>  
                        <Button variant="outlined" sx={{fontWeight:'bold' , color:'#5f5f5f', border:'1px solid #d3d3d3' }} style={card2Style} onClick={handleClick2} >칭찬 받음</Button>  
                  </Typography>
              </Box>
            </CardContent>
                <CardContent>
                <div style={{ height: 400, width: '100%' }}>
                  <DataGrid getRowId={(rows) => rows.id}
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