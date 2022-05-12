import * as React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { CssBaseline, Box, Button, TextField,  Switch,  InputLabel, FormControl, Select, MenuItem,Grid,  Fab, Snackbar }  from '@mui/material';
import { DataGrid, useGridApiContext } from '@mui/x-data-grid';

function renderDisabled(params) {
    const label = { inputProps: { 'aria-label': 'Switch demo' }  };
    return params.row.USE_YN == 'Y' ? <Switch {...label} disabled value={params.id} defaultChecked /> : <Switch {...label} disabled  value={params.id} />
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
    axios.post('/api/menu/editMenu', {'MENU_ID' : param.id, 'col' : col, 'val' : param.props.value }).then(res => {
      console.log(res.data)
      if(res.status != 200) {

      } else {
  
      }
    }).catch( error => {
    
    });
  };
export const headCells = [
  { field: 'MENU_ID', headerName: '메뉴ID', editable: false, width: 120,},
  { field: 'MENU_NM', width: 180, headerName: '메뉴명', editable: true,
      preProcessEditCellProps: (params) => {
        handleUpdate(params, 'MENU_NM');
        return { ...params.props  };
      },
    },
    {
      field: 'USE_YN',
      headerName: '활성화 여부',
      renderCell: renderDisabled,
      renderEditCell: renderRatingEditInputCell,
      editable: true,
      width: 100,
      type: 'number',
      preProcessEditCellProps: (params) => {
        handleUpdate(params, 'USE_YN')
        return { ...params.props  };
      },
    }
];

