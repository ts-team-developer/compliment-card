import * as React from 'react';
import { DataGrid, useGridApiContext, GridRowModes } from '@mui/x-data-grid';
import { Button, Snackbar, Stack,Box } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SetToolbar(props) {
  const { setSelectedRowParam, selectedRowParam, rowMode, rowModesModel, setRowModesModel, selected, setSelected, rows, setRows, form, setForm, result, setResult} = props;

  // ADD버튼 이벤트
  const addRow = () => {
    if(selected == -1) {
      setRows((oldRows) => [{ id: 0, disp_order : 0 , name_kor : '', team : '캐리엠팀', rank : '사원', email : '' , work_sts : 'Y' }, ...oldRows ]);
      setSelected(0);
      setRowModesModel((oldModel) => ({
        '0': { mode: GridRowModes.Edit, fieldToFocus: 'name_kor' },
      }));
    } 
  };

  const handleSaveOrEdit = (event) => {
    if (!selectedRowParam)  return;
    if(selected == -1) setSelected(selectedRowParam.id);

    axios.get('/api/emp/view', {params: { disp_order : selectedRowParam.id }}).then(async({data}) => {
      setForm(data[0])
    });

    setRowModesModel({
      ...rowModesModel,
      [selectedRowParam.id]:{ mode: rowMode === 'edit' ? GridRowModes.View : GridRowModes.Edit },
    });
  };

  const handleRequestSave = () => {
    // 저장 로직
    axios.post('/api/emp/save', form).then(res => {
          setResult({...result, 
            open: true,
            variant : 'success',
            message : res.data.message,
            status : !result.status
          });
          setSelected(-1);
          setForm(null);
          setRowModesModel((oldModel) => ({
            ...oldModel,
            [selected]: { mode: GridRowModes.View },
          }));
        }).catch(error => {
          setResult({...result, 
            open: true,
            variant : 'error',
            message : error.response.status == "400" ? error.response.data.error[0].msg : error.response.data.message
          });
        });
  }

  const handleCancel = () => {
    if (!selectedRowParam)  return;

    if(selected == 0) {
      setRows((prevRows) => {
        const rowToDeleteIndex = prevRows.length
        return [
          ...rows.slice(1, rowToDeleteIndex),
          ...rows.slice(rowToDeleteIndex),
        ];
      });
      setSelectedRowParam(null);
    }
    setRowModesModel({
      ...rowModesModel,
      [selected > 0 ? selected : selectedRowParam.id]: {  mode: GridRowModes.View, ignoreModifications: true },
    });

    setSelected(-1);
    setForm(null);
  };

  const handleMouseDown = (event) => {
    event.preventDefault();
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setResult({...result, open: false})
  };

  return (
    <Box
      sx={{ borderBottom: 1, borderColor: 'divider', p: 1,  textAlign: 'right' }} >
        <div>
          {/* 등록 및 수정 시 Validation Check시 사용 */}
          <Snackbar open={result.open} autoHideDuration={1000} onClose={handleClose} >
            <Alert onClose={handleClose} severity={result.variant} sx={{ width: '100%' }}> {result.message} </Alert>
          </Snackbar>
        </div>

      {selected >= 0 &&
      <React.Fragment>
        <Button onClick={handleRequestSave} onMouseDown={handleMouseDown} color="warning" variant="contained">
          저장
        </Button>
        <Button onClick={handleCancel} onMouseDown={handleMouseDown} color="warning" variant="outlined" sx={{ ml: 1 }} >
            취소
        </Button>
      </React.Fragment> }

      {selected == -1 && 
        <Button onClick={addRow} onMouseDown={handleMouseDown} color="warning" sx={{ mr: 1 }} variant="contained" >
          직원추가
        </Button>}

      {(selected == -1 && selectedRowParam ) &&
        <Button onClick={handleSaveOrEdit} onMouseDown={handleMouseDown} color="warning" variant="outlined" >
          편집
        </Button> }
    </Box>
  );
}

SetToolbar.propTypes = {
  rowMode: PropTypes.oneOf(['edit', 'view']).isRequired,
  rowModesModel: PropTypes.object.isRequired,
  selectedRowParam: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.string]).isRequired,
  }),
  setRowModesModel: PropTypes.func.isRequired,
};

export default function WorkerList(props) {
  const [teamList, setTeamList] = React.useState(null);
  const [rankList, setRankList] = React.useState(null);
  const [selectedRowParam, setSelectedRowParam] = React.useState(null);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [selected, setSelected] = React.useState(-1);
  const [result, setResult] = React.useState({open: false, variant : 'error', message : '', status : false});
  
  const [rows, setRows] = React.useState([]);
  const [form, setForm] = React.useState(null);
  const info = useSelector(state => state.authentication.status);

  const handleRowFocus = React.useCallback((event) => {
    if(selected > 0) {
      return false;
    } else {
      const row = event.currentTarget.parentElement;
      const id = row.dataset.id;
      setSelectedRowParam({ id });
    }
  }, []);

  const rowMode = React.useMemo(() => {
    if (!selectedRowParam) {
      return 'view';
    }
    const { id } = selectedRowParam;
    return rowModesModel[id]?.mode || 'view';
  }, [rowModesModel]);

  const handleRowKeyDown = React.useCallback( (params, event) => {
      if (rowMode === 'edit') {
        event.defaultMuiPrevented = true;
      }
    }, [rowMode],
  );

  React.useEffect(() => {
      axios.get('/api/emp/list/all', {params: props.searchForm})
      .then(async (res) => {
        setRows(res.data)
      });

      axios.get('/api/emp/team').then(async({data}) => {
        setTeamList(data)
      });
    
      axios.get('/api/emp/rank').then(async({data}) => {
        setRankList(data)
      });
  }, [props.searchForm, result.status,info, info]);

  // dataGrid 데이터
  const headCells = [
    { field: 'name_kor', width: 180, headerName: '이름', editable: true,  
      preProcessEditCellProps: (params) => {
        params.row.name_kor = params.props.value;
        setForm(params.row)
        return { ...params.props };
      }
    } ,
    { field: 'team', headerName: '팀', editable: true, width: 120,  type : 'singleSelect', valueOptions : teamList, 
      preProcessEditCellProps: (params) => {
        params.row.team = params.props.value;
        setForm(params.row)
        return { ...params.props  };
      } 
    },
    { field: 'rank', headerName: '직급', editable: true, width: 100,  type : 'singleSelect', valueOptions : rankList, 
      preProcessEditCellProps: (params) => {
        params.row.rank = params.props.value;
        setForm(params.row)
        return { ...params.props  };
      }, 
    },
    { field: 'email', width: 250, headerName: '이메일', editable: true,  
      preProcessEditCellProps: (params) => {
        params.row.email = params.props.value;
        setForm(params.row)
        return { ...params.props  };
      } 
    },
    { field: 'work_sts', headerName: '활성화 여부', type:'boolean', editable: true, width: 100, 
      preProcessEditCellProps: (params) => {
        params.row.work_sts = params.props.value ? 1 : 0 ;
        setForm(params.row)
        return { ...params.props  };
      } 
    } ,
  ];

  return (
    <React.Fragment>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          getRowId={(rows) => rows.disp_order}
          rows={rows}
          columns={headCells}
          editMode="row"
          rowModesModel={rowModesModel}
          components={{ Toolbar : SetToolbar }}
          onCellKeyDown={handleRowKeyDown}
          componentsProps={{
            toolbar: {
              rowMode,
              selectedRowParam, setSelectedRowParam,
              rowModesModel, setRowModesModel,
              selected, setSelected,
              rows, setRows,
              form, setForm,
              result, setResult,
            },
            cell : { onFocus : handleRowFocus   },
          }}
       
          experimentalFeatures={{ newEditingApi: true }}
        />
      </div>
    </React.Fragment>
  );
}
