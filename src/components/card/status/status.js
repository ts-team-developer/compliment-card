import * as React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { DataGrid }  from '@mui/x-data-grid';
import { Card, CardContent, Button, Badge, TextField, Autocomplete, Grid, Box, Typography, CardMedia } from '@mui/material';
import { usePcStyles, useMobileStyles } from "../../../styles/styles"
import { useMediaQuery } from "@material-ui/core";


export default function FixedContainer() {
  // Style 관련 CSS
  const isMobile = useMediaQuery("(max-width: 600px)");
  const classes = usePcStyles();
  const mobile = useMobileStyles();
  const columns = [
    // { field: 'idx', headerName: '순서', width: 90 },
    { field: 'name', headerName: '이름', width: 120 },
    { field: 'card', headerName: '작성한 카드 수', type: 'number', width: 150 },
    { field: 'unreadCard', headerName: '안 읽은 카드 수', type: 'number', width: 150,},
    { field: 'readCard', headerName: '읽은 카드 수', type: 'number', width: 150,},
    { field: 'receiveCard', headerName: '받은 카드 수', type: 'number', width: 150,},
  ];

  const info = useSelector(state => state.authentication.status);

  const [totalMembers, setTotalMembers] = React.useState();
  const [unwrittenMembers, setUnwrittenMembers] = React.useState();
  const [unreadMembers, setUnreadMembers] = React.useState();

  const [rows, setRowList] = React.useState([]);
  const [value, setValue] = React.useState(info.quarterInfo.QUARTER);
  const [card1Style, setCard1Style] = React.useState({border : "1px solid rgb(25, 118, 210)",backgroud : "rgba(25, 118, 210, 0.04)"});
  const [card2Style, setCard2Style] = React.useState();
  const [card3Style, setCard3Style] = React.useState();

  const [searchForm, setSearchForm] = React.useState({ quarter : info.quarterInfo.QUARTER, cards : '1' });

  const quarterList= [];

  axios.get('/api/quarter/list', {params: { sort : 'Y' }})
    .then(({data}) => {
      data[0].forEach(element => {
        quarterList.push({label : element.quarter})
      });
    })

  React.useEffect( () => {

    axios.get('/api/status/totalMemberCount', {params: searchForm })
    .then(({data}) => {
      setTotalMembers(data[0][0].COUNT);
    });

    axios.get('/api/status/unwrittenMemberCount')
    .then(({data}) => {
      setUnwrittenMembers(data[0][0].COUNT);
    });

    axios.get('/api/status/unreadMemberCount')
    .then(({data}) => {
      setUnreadMembers(data[0][0].COUNT);
    });

    axios.get('/api/status/list', {params: searchForm })
    .then(({data}) => {
      try{
        setRowList(data[0]);
      }catch(error) {
        console.log(error)
      }
    });

  },[info, value, searchForm, card1Style, card2Style, card3Style]);

  const handleClick = () => {
    if(value.label==undefined){
      setSearchForm({quarter:info.quarterInfo.QUARTER, cards:1})  
    }else{
      setSearchForm({quarter:value.label, cards:1})
    }
    setCard1Style( {border : "1px solid rgb(25, 118, 210)",
      backgroud : "rgba(25, 118, 210, 0.04)"})
      change2();
      change3();
  }

  const handleClick2 = () => {
    if(value.label==undefined){
      setSearchForm({quarter:info.quarterInfo.QUARTER, cards:2})  
    }else{
      setSearchForm({quarter:value.label, cards:2})
    }
    setCard2Style( { border : "1px solid rgb(211, 47, 47)",
    backgroud : "rgba(211, 47, 47, 0.04)" })
    change1();
    change3();
    
  }
  
  const handleClick3 = () => {
    if(value.label==undefined){
      setSearchForm({quarter:info.quarterInfo.QUARTER, cards:3})  
    }else{
      setSearchForm({quarter:value.label, cards:3})
    }
    setCard3Style( { border : "1px solid rgb(211, 47, 47)",
    backgroud : "rgba(211, 47, 47, 0.04)" })
    change1();
    change2();
  }

  const change1 = () => {
      setCard1Style( {border : "1px solid rgb(211, 211, 211)",
      backgroud : "white"})
  }
  const change2 = () => {
      setCard2Style( {border : "1px solid rgb(211, 211, 211)",
      backgroud : "white"})
  }
  const change3 = () => {
      setCard3Style( {border : "1px solid rgb(211, 211, 211)",
      backgroud : "white"})
  }

  return (
    <React.Fragment>
      <CssBaseline />
        <Card variant="outlined"  className={isMobile ? mobile.card : classes.card}>
          <CardMedia className={isMobile ? mobile.cardTop  : classes.cardTop}>
            <Typography variant="h5" component="div" className={classes.title} >
              <b>진행현황</b>
            </Typography>
            <Box component="form" noValidate autoComplete="off" >
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={quarterList}
                        value={value}
                        onChange={(event, newValue) => {
                          setValue(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="칭찬카드 분기" />}
                        size="small" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={3}>
                      <Badge badgeContent={totalMembers} color="primary" className={mobile.fullWidth}  >
                        <Button variant="outlined" style={card1Style} onClick={handleClick} className={mobile.fullWidth}  >전체조회</Button>  
                      </Badge> 
                    </Grid>
                    {(info.quarterInfo.QUARTER==searchForm.quarter && info.quarterInfo.ISCLOSED=='N' ) && 
                      <Grid item xs={12} md={3}>
                        <Badge badgeContent={unwrittenMembers} color="error" className={mobile.fullWidth} >
                          <Button variant="outlined" color="error"  style={card2Style} onClick={handleClick2} className={mobile.fullWidth}>미작성조회</Button>  
                        </Badge> 
                      </Grid>
                    }
                    {(info.quarterInfo.QUARTER==searchForm.quarter && info.quarterInfo.ISCLOSED=='Y' &&  info.quarterInfo.ISCLOSED=='N') && 
                      <Grid item xs={12} md={3}>
                        <Badge badgeContent={unreadMembers} color="error" className={mobile.fullWidth}>
                          <Button variant="outlined" color="error"  style={card3Style}  onClick={handleClick3} className={mobile.fullWidth} >미투표조회</Button>   
                        </Badge>
                      </Grid>
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </CardMedia>
       
          <CardContent>
            <div style={{ height: 600, width: '100%' }}>
              <DataGrid getRowId={(rows) => rows.idx}
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5]}
              />
            </div>
          </CardContent>
        </Card>
    </React.Fragment>
  );
}