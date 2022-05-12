import * as React from 'react';
import { DataGrid, useGridApiContext } from '@mui/x-data-grid';
import { Button, Snackbar, Stack } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { SnackbarProvider, useSnackbar } from 'notistack'


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function WorkerList(props) {
  const [result, setResult] = React.useState({open: false, variant : 'error', message : ''})
  const [rows, setRows] = React.useState([]);
  const [teamList, setTeamList] = React.useState([]);
  const [rankList, setRankList] = React.useState([]);
  const [status, setStatus] = React.useState(false);
  const [form, setForm] = React.useState({});

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setResult({...result, open: false})
  };
  
  const createRandomRow = () => {
    return { disp_order : 0 , name_kor : '', team : '캐리엠팀', rank : '', email : '' , work_sts : 'Y' };
  };
  
  const headCells = [
    { field: 'name_kor', width: 180, headerName: '이름', editable: true},
    { field: 'team', headerName: '팀', editable: true, width: 120,  type : 'singleSelect', valueOptions : teamList },
    { field: 'rank', headerName: '직급', editable: true, width: 100,  type : 'singleSelect', valueOptions : rankList },
    { field: 'email', width: 250, headerName: '이메일', editable: true, },
    { field: 'work_sts', headerName: '활성화 여부', type:'boolean', editable: true, width: 100 },
  ];

  const removeRow = () => {
    setRows((prevRows) => {
      const rowToDeleteIndex = prevRows.length
      return [
        ...rows.slice(1, rowToDeleteIndex),
        ...rows.slice(rowToDeleteIndex),
      ];
    });
  }
  const addRow = () => {
    setStatus(true);
    setRows((prevRows) => [createRandomRow(), ...prevRows ]);
  }

  const handleRowEditStop = async (params, event) => {
    event.defaultMuiPrevented = true;
    if(Object.keys(form).length > 0) {
      const disp_order = Object.keys(form);
      const keys = Object.keys(form[disp_order]); // key ["name_kor", email, ...]
      keys.forEach(function(key, idx) { 
        if(form[disp_order][key].value.trim().length > 0) {
          const value = form[disp_order][key].value;
          params.row[key] = value;
        }
      })
    }
    axios.post('/api/emp/save', params.row).then(res => {
      console.log("성공 ? " +JSON.stringify(res))
      setResult({...result, 
        open: true,
        variant : 'success',
        message : res.data.message
      });
    }).catch(error => {
      console.log(JSON.stringify(error.response))
      setResult({...result, 
        open: true,
        variant : 'error',
        message : error.response.status == "400" ? error.response.data.error[0].msg : error.response.data.message
      });
      
    });
  };

  React.useEffect(() => {
      axios.get('/api/worker/getWorkerList', {params: props.searchForm})
      .then(async (res) => {
        setRows(res.data)
      });

      axios.get('/api/emp/team').then(async({data}) => {
        setTeamList(data)
      });
    
      axios.get('/api/emp/rank').then(async({data}) => {
        setRankList(data)
      });
  }, [props.searchForm]);
  return (
    <React.Fragment>
      <div style={{ height: 400, width: '100%' }}>
        {
          status ? 
            <Button onClick={removeRow}>CANCEL</Button>
          : <Button onClick={addRow}>ADD A ROW</Button>
        }
        <DataGrid
          getRowId={(rows) => rows.disp_order}
          rows={rows}
          columns={headCells}
          experimentalFeatures={{ newEditingApi: true }}
          editMode="row"
          onRowEditStart={(params, event) => {
            event.defaultMuiPrevented = false;
          }}
          onRowEditStop={handleRowEditStop}
          onEditRowsModelChange={(params, event) => {
            setForm(params)
          }}
        />
        <Snackbar open={result.open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={result.variant} sx={{ width: '100%' }}>
            {result.message}
          </Alert>
        </Snackbar>
      </div>
    </React.Fragment>
  );
}
