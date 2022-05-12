import * as React from 'react';

import axios from 'axios';
import PropTypes from 'prop-types';
import { CssBaseline, Box, Button, TextField,  Switch,  InputLabel, FormControl, Select, MenuItem,Grid,  Fab, Snackbar }  from '@mui/material';
import { DataGrid, useGridApiContext } from '@mui/x-data-grid';
import { ConfirmPopup, AlimPopup } from '../../modal/index';

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

  let errorList = [];

  export const handleUpdate = async (param, col) => {
    console.log(JSON.stringify(param.row))
    let formData = {};
    if(col != "") {
      param.row[col] = param.props.value;
      formData = param.row;      
    } else {
      formData = param;
    }
    console.log(`handleUpdate : ${JSON.stringify(formData)}`);
    axios.post('/api/emp/save', param.row).then(res => {

    }).catch(error => {
        if(error.response.status == "400") {
          errorList = error.response.data.error;
        }
        return error.response.data.error;
    });
  };

  const teamList = [];
  const rankList = [];


  axios.get('/api/emp/team').then(async({data}) => {
    if(teamList.length == 0) {
      for(var i = 0 ; i < data.length; i++) {
        teamList.push(data[i]);
      }
    }
  });

  axios.get('/api/emp/rank').then(async({data}) => {
    if(rankList.length == 0) {
      for(var i = 0 ; i < data.length; i++) {
        rankList.push(data[i]);
      }
    }
  });
  
export const errorMsg = errorList;

export const headCells = [
    { field: 'name_kor', width: 180, headerName: '이름', editable: true,
    preProcessEditCellProps: (params) => {
      return { ...params.props  };
    } },
    { field: 'team', headerName: '팀', editable: true, width: 120,
      type : 'singleSelect',
      valueOptions : teamList,
      preProcessEditCellProps: (params) => {
        return { ...params.props  };
      },
     },
    { field: 'rank', headerName: '직급', editable: true, width: 100,
    type : 'singleSelect',
    valueOptions : rankList,
    preProcessEditCellProps: (params) => {
      return { ...params.props  };
    },
    },
    { field: 'email', headerName: '이메일', editable: true, width: 250,
      preProcessEditCellProps: (params) => {
        return { ...params.props  };
      },
    },
    { field: 'work_sts',
      headerName: '활성화 여부',
      type:'boolean',
      editable: true,
      width: 100,
      preProcessEditCellProps: (params) => {
    
      return { ...params.props  };
    },
  },
];

