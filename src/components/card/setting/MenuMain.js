import * as React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { CssBaseline, Box, Button, TextField,  Switch,  InputLabel, FormControl, Select, MenuItem,Grid }  from '@mui/material';
import MenuList from './MenuList';

export default function WorkerMain() {
  const [searchForm, setSearchForm] = React.useState({'MENU_NM' : "", 'USE_YN' : 'X'});
  
  const handleChanges =(event) => {
    const{name, value} = event.target;
    setSearchForm({
      ...searchForm , 
      [name] : value
    })
  }

  React.useEffect(() => {
    
  }, [searchForm]);
 
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
            <Grid item xs={12} md={7} sx={{textAlign : 'right'}}>
            <FormControl   >
              <Button size="medium" color="warning"  name="add" variant="contained">메뉴추가</Button>
            </FormControl>
            </Grid>
          </Grid>
          <MenuList searchForm={searchForm} />
    </React.Fragment>
  );
}