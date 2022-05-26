import * as React from 'react';
import axios from 'axios';
import { CssBaseline,  TextField,  InputLabel, FormControl, Select, MenuItem,Grid }  from '@mui/material';
import WorkerList from './WorkerList';
import { useSelector } from 'react-redux';

export default function WorkerMain() {
  const [searchForm, setSearchForm] = React.useState({'team' : -1, 'name_kor' : "", 'work_sts' : 1});
  const [teamList, setTeamList] = React.useState([]);
  const info = useSelector(state => state.authentication.status);
  
  const handleChanges =(event) => {
    const{name, value} = event.target;
    setSearchForm({
      ...searchForm , 
      [name] : value
    })
  }

  React.useEffect(() => {
    const fetchTeam = async () => {
      axios.get('/api/emp/team')
      .then( async ({data}) => {
        setTeamList(data)
      });
    };
    fetchTeam();
  }, [searchForm, info]);
 
  return (
    <React.Fragment>
      <CssBaseline />
      <Grid container spacing={1} sx={{marginBottom: '20px'}}>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel id="select-work-sts">활성화 여부</InputLabel>
            <Select labelId="select-work-sts" name='work_sts' onChange={handleChanges} 
              id="work_sts" value={searchForm.work_sts} label="활성화여부"  size="small"  >
                <MenuItem value={-1}>전체보기</MenuItem>
                <MenuItem value={1}>활성화</MenuItem>
                <MenuItem value={0}>비활성화</MenuItem>
            </Select>
          </FormControl>
        </Grid> 
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel id="select-team">팀</InputLabel>
            <Select labelId="select-team" id="team"  label="팀" name="team" value={searchForm.team} size="small" onChange={handleChanges}  >
              <MenuItem value={-1}>전체보기</MenuItem>
              {teamList ? teamList.map((el, key) => { return ( <MenuItem key={key} value={el}>{el}</MenuItem>  ) }) : null};
              </Select>
          </FormControl>
        </Grid>
            
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <TextField
              name="name_kor"
              id="outlined-password-input"
                    label="이름"
                    value={searchForm.name_kor}
                    type="name_kor"
                    size="small"  fullWidth
                    onChange={handleChanges} />
              </FormControl>
            </Grid>
          </Grid>
          <WorkerList searchForm={searchForm} />
    </React.Fragment>
  );
}

