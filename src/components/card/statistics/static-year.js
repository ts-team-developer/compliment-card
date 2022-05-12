import * as React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import Card from '@mui/material/Card';
import { FormControl, ButtonGroup } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { DataGrid, gridColumnsSelector }  from '@mui/x-data-grid';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { usePcStyles, useMobileStyles } from "../../../styles/styles"
  import { useMediaQuery } from "@material-ui/core"

export default function FixedContainer() {
    // Style 관련 CSS
    const isMobile = useMediaQuery("(max-width: 600px)");
    const classes = usePcStyles();
    const mobile = useMobileStyles();
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
      <Grid container spacing={1} sx={{marginBottom: '20px'}}>
          <Grid item xs={12} md={3}>
          <FormControl fullWidth className={isMobile ? mobile.searchEl : classes.searchEl}>
            <Autocomplete  disablePortal
              id="combo-box-demo"
              options={quarterList}
              value={value}
              fullWidth
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              renderInput={(params) => <TextField {...params} label="칭찬카드 분기" />}        
              size="small" />
          </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
          <FormControl fullWidth className={isMobile ? mobile.searchEl : classes.searchEl}>
          <ButtonGroup variant="outlined" aria-label="outlined button group" size="medium" fullWidth >
              <Button onClick={handleClick} fullWidth >칭찬함</Button>
              <Button  onClick={handleClick2} fullWidth >칭찬받음</Button>
            </ButtonGroup>
          </FormControl>
          </Grid>
      </Grid>
      
          
                <div style={{ height: 400, width: '100%', padding : 0 }}>
                  <DataGrid getRowId={(rows) => rows.id}
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5]}
                  />
                </div>
    </React.Fragment>
  );
}