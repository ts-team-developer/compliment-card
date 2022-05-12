import * as React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { CssBaseline, Button,  InputLabel, FormControl, Select, MenuItem,Grid, TextField }  from '@mui/material';
import QuarterList from './QuarterList';
import QuarterPopup from '../../modal/QuarterPopup';

export default function WorkerMain() {
  const [searchForm, setSearchForm] = React.useState({'year' : 0, 'quarter' : 0, });
  const [yearList, setYearList] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const handleChanges =(event) => {
    const{name, value} = event.target;
    setSearchForm({
      ...searchForm , 
      [name] : value
    })
  }
  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    const fetchYear = async () => {
      axios.get('/api/quarter/getYearList')
      .then(({data}) => {
        setYearList(data[0])
      });
    };
    fetchYear();
  }, [searchForm]);
 
  return (
    <React.Fragment>
      <CssBaseline />
      <Grid container spacing={1} sx={{marginBottom: '20px'}}>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel id="select-year">년도</InputLabel>
            <Select labelId="select-year" id="year"  label="년도" name="year" value={searchForm.year} size="small" onChange={handleChanges}  >
              <MenuItem value={0}>전체보기</MenuItem>
              {yearList ? yearList.map((el, key) => {
                                return ( <MenuItem key={key} value={el.quarter}>{el.quarter}</MenuItem>  ) }) : null};
              </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
          <TextField id="outlined-password-input"
                          label="분기"
                          type="quarter"
                          size="small"
                          onChange={handleChanges}
                        />
          </FormControl>
        </Grid>
 
            <Grid item xs={12} md={8} sx={{textAlign : 'right'}}>
            <FormControl   >
              <Button size="medium" color="warning" name="add" variant="contained" onClick={handleOpen}>분기추가</Button>
            </FormControl>
            </Grid>
          </Grid>
          <QuarterList searchForm={searchForm} />
          <QuarterPopup open={open} handleClose={handleClose}  isAdd={true} />
    </React.Fragment>
  );
}