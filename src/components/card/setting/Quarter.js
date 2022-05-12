import * as React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { CssBaseline, Box, Button, TextField,  Switch,  InputLabel, FormControl, Select, MenuItem,Grid,  Fab, Snackbar }  from '@mui/material';
import { DataGrid, useGridApiContext } from '@mui/x-data-grid';

function renderDisabled(params) {
    const label = { inputProps: { 'aria-label': 'Switch demo' }  };
    let key = Object.keys(params.row);
    for(var i = 0; i < key.length; i++) {
      if(key[i] == "ISCLOSED") {
        return params.row.ISCLOSED == 'Y' ? <Switch {...label} disabled value={params.id} defaultChecked /> : <Switch {...label} disabled  value={params.id} />
      }

      if(key[i] == "ISRECCLOSED") {
        return params.row.ISRECCLOSED == 'Y' ? <Switch {...label} disabled value={params.id} defaultChecked /> : <Switch {...label} disabled  value={params.id} />
      }
    }
    
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
  
    return value == 'Y' ? (
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
  
const renderRatingEditInputCell = (params) => {
    return <RatingEditInputCell {...params} />;
  };
  
  const handleUpdate = async (param, col) => {
    axios.post('/api/quarter/editQuarter', {'MENU_ID' : param.id, 'col' : col, 'val' : param.props.value }).then(res => {
      console.log(res.data)
      if(res.status != 200) {

      } else {
  
      }
    }).catch( error => {
    
    });
  };
export const headCells = [
  { field: 'QUARTER', width: 200, headerName: '분기', editable: true,
      preProcessEditCellProps: (params) => {
        handleUpdate(params, 'QUARTER');
        return { ...params.props  };
      },
    },
  {
      field: 'ISCLOSED',
      headerName: '등록마감여부',
      renderCell: renderDisabled,
      renderEditCell: renderRatingEditInputCell,
      editable: true,
      width: 140,
      type: 'number',
      preProcessEditCellProps: (params) => {
        handleUpdate(params, 'ISCLOSED')
        return { ...params.props  };
      },
    },
    {
      field: 'ISRECCLOSED',
      headerName: '투표마감여부',
      renderCell: renderDisabled,
      renderEditCell: renderRatingEditInputCell,
      editable: true,
      width: 140,
      type: 'number',
      preProcessEditCellProps: (params) => {
        handleUpdate(params, 'ISRECCLOSED')
        return { ...params.props  };
      },
    }
];

