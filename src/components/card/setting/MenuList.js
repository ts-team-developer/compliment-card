import * as React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { CssBaseline, Box, Button, TextField,  Switch,  InputLabel, FormControl, Select, MenuItem,Grid,  Fab, Snackbar }  from '@mui/material';
import { DataGrid, useGridApiContext } from '@mui/x-data-grid';
import { headCells } from './Menu';


function renderDisabled(params) {
    const label = { inputProps: { 'aria-label': 'Switch demo' }  };
    return params.row.work_sts == 1 ? <Switch {...label} disabled value={params.id} defaultChecked /> : <Switch {...label} disabled  value={params.id} />
  }
  
  renderDisabled.propTypes = {
    value: PropTypes.number,
  };
  
  function RatingEditInputCell(props) {
    const { id, field,value } = props;
    const apiRef = useGridApiContext();
  
    const handleChange = async (e, newValue) => {
      apiRef.current.setEditCellValue({ id, field, value: newValue });
    };
  
    return value == 1 ? (
      <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
        <Switch defaultChecked onChange={handleChange} />
      </Box>
    ) : (
      <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
        <Switch  onChange={handleChange} />
      </Box>
    );
  }
  
  RatingEditInputCell.propTypes = {
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    value: PropTypes.number,
  };
  

export default function QuarterList(props) {
    const [rows, setRows] = React.useState([]);
    React.useEffect(() => {
        const fetchRows = async () => {
          axios.get('/api/menu/getMenuListAll', {params: props.searchForm})
          .then(async (res) => {
            setRows(res.data)
          });
        }
        fetchRows();
    }, [props.searchForm]);
return ( 
    <React.Fragment>
        <div style={{ height: 400, width: '100%'}}>
            <DataGrid getRowId={(rows) => rows.MENU_ID}
            rows={rows}
            columns={headCells}
            pageSize={10}
            rowsPerPageOptions={[5]}
            experimentalFeatures={{ newEditingApi: true }}  />
        </div>
    </React.Fragment>
    )
}
