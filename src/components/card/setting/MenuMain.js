import * as React from 'react';
import { CssBaseline,  TextField,  Switch,  InputLabel, FormControl, Select, MenuItem,Grid }  from '@mui/material';
import MenuList from './MenuList';
import { useSelector } from 'react-redux';

export default function WorkerMain() {
  const [searchForm, setSearchForm] = React.useState({'MENU_NM' : "", 'USE_YN' : 'X'});
  const info = useSelector(state => state.authentication.status);
  const handleChanges =(event) => {
    const{name, value} = event.target;
    setSearchForm({
      ...searchForm , 
      [name] : value
    })
  }

  React.useEffect(() => {
    
  }, [searchForm, info]);
 
  return (
    <React.Fragment>
      <CssBaseline />
      <Grid container spacing={1} sx={{marginBottom: '20px'}}>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel id="select-work-sts">활성화 여부</InputLabel>
            <Select labelId="select-work-sts" name='USE_YN' onChange={handleChanges} 
              id="USE_YN" value={searchForm.USE_YN} label="활성화여부"  size="small"  >
                <MenuItem value='X'>전체보기</MenuItem>
                <MenuItem value='Y'>활성화</MenuItem>
                <MenuItem value='N'>비활성화</MenuItem>
            </Select>
          </FormControl>
        </Grid> 
        
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <TextField
              name="MENU_NM"
              id="outlined-password-input"
                    label="메뉴명"
                    value={searchForm.MENU_NM}
                    type="MENU_NM"
                    size="small"  fullWidth
                    onChange={handleChanges} />
              </FormControl>
            </Grid>
          </Grid>
          <MenuList searchForm={searchForm} />
    </React.Fragment>
  );
}