import * as React from 'react';
import axios from 'axios';
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
import Chip from '@mui/material/Chip';
import { DataGrid }  from '@mui/x-data-grid';

const quarterList= [];
axios.get('/api/quarter/list')
  .then(({data}) => {
    data[0].forEach(element => {
      quarterList.push({label : element.quarter})
  });
})

  const card = (
    <React.Fragment>
      <CardContent>
        <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{mb : -2 }}
        >
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={quarterList}
                sx={{ m :2, ml: -1, width: '20%', display: 'inline-block'}}
                renderInput={(params) => <TextField {...params} label="칭찬카드 분기" />}
                size="small"
            />
            <Typography variant="body2" sx={{display: 'inline-block', verticalAlign:'middle', mt:1.5, ml:-1 }}>
                <Button size="large" variant="outlined" >조회</Button>  
                <Button size="large" variant="outlined" sx={{ml:1}}>작성마감</Button>  
            </Typography>
        </Box>
      </CardContent>
    </React.Fragment>
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
  ];
  
  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];

export default function FixedContainer() {

  const [totalMembers, setTotalMembers] = React.useState();
  React.useEffect( () => {
    axios.get('/api/emp/selectTotalMemberCountByQuarter', {params: { quarter : '2021년도 1분기' }})
    .then(({data}) => {
      setTotalMembers(data[0][0].COUNT);
    });
  });
  
  return (
    <React.Fragment>
      <CssBaseline />
      <Container fixed >
        <Box sx={{ bgcolor: 'none', height: '100vh' }} sx={{ mt: 6 }} >
            <Card variant="outlined">
                {card}
                <React.Fragment>
                  <CardContent >
                  <Box
                    sx={{
                    display: 'flex',
                    '& > :not(style)': {
                      m: 1,
                      height: 40,
                      bgcolor: 'primary'
                    },
                }}
              >
                <Badge badgeContent={totalMembers} color="primary" sx={{ml: -1, fontFamily:'Nanum Gothic'}}>
                  <Chip label=" 전체인원" variant="outlined" />
                  </Badge> 
                  <Badge badgeContent={4} color="primary" sx={{ml: -1,fontFamily:'NanumSquare' }}>
                  <Chip label="전체카드수" variant="outlined" sx={{fontFamily:'NanumSquare'}} />
                  </Badge> 
                  <Badge badgeContent={4} color="primary" sx={{ml: -1}}>
                  <Chip label="미작성인원" variant="outlined" />
                  </Badge> 
                  <Badge badgeContent={4} color="primary" sx={{ml: -1}}>
                  <Chip label="미투표인원" variant="outlined" />
                  </Badge> 
                  <Badge badgeContent={'미진행'} color="secondary" sx={{ml: -1}}>
                  <Chip label="진행현황" variant="outlined" />
                  </Badge>  
              </Box>
                  </CardContent>
              </React.Fragment>
                <CardContent>
                <div style={{ height: 400, width: '100%' }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                  />
                </div>
                </CardContent>
            </Card>
        </Box>
      </Container>
    </React.Fragment>
  );
}