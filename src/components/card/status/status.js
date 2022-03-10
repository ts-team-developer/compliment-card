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
import Autocomplete from '@mui/material/Autocomplete';
import { DataGrid }  from '@mui/x-data-grid';
import { style } from '@mui/system';

  
export default function FixedContainer() {

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


    // axios.get('/api/status/listByQuarter', {params: { params : searchForm }})
    // .then(({data}) => {
    //   setStatus((data[0][0].isClosed=='N') ? '진행중' : '진행완료');
    // });

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
                       <Badge badgeContent={totalMembers} color="primary" sx={{ml: -1, fontFamily:'Nanum Gothic'}} >
                        <Button variant="outlined" sx={{fontWeight:'bold' , color:'#5f5f5f', border:'1px solid #d3d3d3' }} style={card1Style} onClick={handleClick} >전체 조회</Button>  
                      </Badge> 
                      {
                        (info.quarterInfo.QUARTER==searchForm.quarter && info.quarterInfo.ISCLOSED=='N' ) && 
                        <React.Fragment>
                        <Badge badgeContent={unwrittenMembers} color="error" sx={{ml: 1, fontFamily:'Nanum Gothic'}} >
                          <Button variant="outlined" color="error" sx={{fontWeight:'bold' , color:'#5f5f5f', border:'1px solid #d3d3d3'}} style={card2Style} onClick={handleClick2}>미작성 조회</Button>  
                        </Badge> 
                        </React.Fragment>
                      }
                      {
                          (info.quarterInfo.QUARTER==searchForm.quarter && info.quarterInfo.ISCLOSED=='Y' ) && 
                        <React.Fragment>
                        <Badge badgeContent={unreadMembers} color="error" sx={{ml: 1, fontFamily:'Nanum Gothic'}}>
                          <Button variant="outlined" color="error" sx={{fontWeight:'bold' , color:'#5f5f5f', border:'1px solid #d3d3d3'}} style={card3Style} onClick={handleClick3}>미투표 조회</Button>   
                        </Badge> 
                        </React.Fragment>
                      }
                      {/* <Button variant="outlined" sx={{ml:1, fontWeight:'bold'}} >작성마감</Button>*/}
                  </Typography>
              </Box>
            </CardContent>
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
        </Box>
      </Container>
    </React.Fragment>
  );
}