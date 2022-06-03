import * as React from 'react';
import { DataGrid, GridRowModes } from '@mui/x-data-grid';
import { Button, Snackbar, Box,Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import PropTypes from 'prop-types';
import { ConfirmPopup } from '../../modal/index';
import { useSelector, useDispatch } from 'react-redux';
import { requestQuarterInfo } from '../../../redux/actions/authentication'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SetToolbar(props) {
  const { quarter , setSelectedRowParam, selectedRowParam, rowMode, rowModesModel, setRowModesModel, selected, setSelected, rows, setRows, form, setForm, result, setResult, dispatch} = props;

  // ADD버튼 이벤트
  const addRow = () => {

    if(selected == null) {
      setRows((oldRows) => [{ id : quarter.NEXT_QUARTER, QUARTER: quarter.NEXT_QUARTER , ISCLOSED : 0 }, ...oldRows ]);
      setForm({QUARTER : quarter.NEXT_QUARTER, ISCLOSED : 'N', ISRECCLOSED : 'N'})
      setSelected(quarter.NEXT_QUARTER);
      setRowModesModel((oldModel) => ({
        [quarter.NEXT_QUARTER] : { mode: GridRowModes.Edit },
      }));
    }
  };

  const handleSaveOrEdit = (event) => {
    if (!selectedRowParam)  return;
    if(selected == null) setSelected(selectedRowParam.id);

    if(selected != quarter.NEXT_QUARTER) {
      axios.get('/api/quarter/view', {params: { QUARTER : selectedRowParam.id }}).then(async({data}) => {
        setForm(data[0])
      });
    }

    setRowModesModel({
      ...rowModesModel,
      [selectedRowParam.id]:{ mode: rowMode === 'edit' ? GridRowModes.View : GridRowModes.Edit },
    });
  };

  const handleDelete = () => {
    dispatch(requestQuarterInfo());
    setResult({
      ...result,
      open : false,
      callback : {
          ...result.callback,
          open : true,
      } })
  }

  const handleRequestSave = () => {
    axios.post(`/api/quarter/save`, form).then(res => {
        dispatch(requestQuarterInfo());
          setResult({...result,
            open: true,
            variant : 'success',
            message : res.data.message,
            status : !result.status
          });
          setSelected(null);
          setForm(null);
          setRowModesModel((oldModel) => ({
            ...oldModel,
            [res.data.quarter]: { mode: GridRowModes.View },
          }));
        }).catch(error => {
          setResult({...result,
            open: true,
            variant : 'error',
            message : error.response.data.message
          });
          if(error.response.status == 400) {
            handleCancel();
          }
        });
  }

  const handleCancel = () => {
    console.log(JSON.stringify(selectedRowParam));
    console.log(JSON.stringify(selected));
    if(selected == quarter.NEXT_QUARTER) {
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
      [selected != quarter.NEXT_QUARTER ? selected : selectedRowParam.id]: {  mode: GridRowModes.View, ignoreModifications: true },
    });

    setSelected(null);
    setForm(null);
  };

  const handleMouseDown = (event) => {
    event.preventDefault();
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setResult({...result, open: false})
  };
  const handlePopupClose = () => {
    setResult({
        ...result,
        open : false,
        callback : {
            ...result.callback,
            open : false,
        } })
}

const handleCallback = () => {
  axios.post('/api/quarter/delete', {'QUARTER' :selectedRowParam.id}).then( async res => {
    setResult({...result,
      open: true,
      variant : res.status == 200 ? 'success' : 'error',
      message : res.data.message,
      status : !result.status,
      callback : {
        ...result.callback,
        open : false
      }
    });

  }).catch(async error => {
    setResult({...result,
      open: true,
      variant : 'error',
      message : '삭제 실패',
      status : !result.status,
      callback : {
        ...result.callback,
        open : false
      }
    });
  });
  setForm(null);
  setSelected(null);
  setSelectedRowParam(null)
}

  return (
    <Box
      sx={{ borderBottom: 1, borderColor: 'divider', p: 1,  textAlign: 'right' }} >
        <div>
          {/* 등록 및 수정 시 Validation Check시 사용 */}
          <Snackbar open={result.open} autoHideDuration={2000} onClose={handleClose} >
            <Alert onClose={handleClose} severity={result.variant} sx={{ width: '100%' }}> {result.message} </Alert>
          </Snackbar>
          <ConfirmPopup open={result.callback.open}  msg = '정말로 삭제하시겠습니까?'  handleClose={handlePopupClose} handleCallback={handleCallback} />
        </div>
        <Typography variant="overline" display={result.open ? "inlineBlock" : "none" } gutterBottom color={result.variant}>
        {result.message}
        </Typography>
      {selected != null &&
      <React.Fragment>
        <Button onClick={handleRequestSave} onMouseDown={handleMouseDown} color="warning" variant="contained">
          저장
        </Button>
        <Button onClick={handleCancel} onMouseDown={handleMouseDown} color="warning" variant="outlined" sx={{ ml: 1 }} >
            취소
        </Button>
      </React.Fragment> }

      {selected == null &&
        <Button onClick={addRow} onMouseDown={handleMouseDown} color="warning" sx={{ mr: 1 }} variant="contained" >
          분기추가
        </Button>}

      {(selected == null && selectedRowParam ) &&
      <React.Fragment>
        <Button onClick={handleSaveOrEdit} onMouseDown={handleMouseDown} color="warning" variant="outlined" >
          편집
        </Button>
        <Button onClick={handleDelete} onMouseDown={handleMouseDown} color="warning" variant="outlined" sx={{ml : 1}}>
          삭제
        </Button>
      </React.Fragment>
      }
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
  const [selectedRowParam, setSelectedRowParam] = React.useState(null);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [selected, setSelected] = React.useState(null);
  const [quarter, setQuarter] = React.useState(null);
  const [result, setResult] = React.useState({open: false, variant : 'error', message : '', status : false, callback: {open : false, messge : '', error : false}});

  const [rows, setRows] = React.useState([]);
  const [form, setForm] = React.useState(null);
  const info = useSelector(state => state.authentication.status);
  const dispatch = useDispatch();

  const handleRowFocus = React.useCallback((event) => {
    if(selected != null && selected != quarter.NEXT_QUARTER) {
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
      const fetchRows = async () => {
        axios.get('/api/quarter/getQuarterList', {params: props.searchForm})
        .then(async (res) => {
          setRows(res.data);
        });
      }

      const recentQuarter = async () => {
        axios.get('/api/quarter/recently').then(async(res) => {
          setQuarter(res.data[0][0])
        })
      }
      fetchRows();
      recentQuarter();
  }, [props.searchForm, result.status, info]);

  // dataGrid 데이터
  const headCells = [
    { field: 'QUARTER', width: 200, headerName: '분기',
        preProcessEditCellProps: (params) => {
          params.row.QUARTER = params.props.value;
          setForm(params.row)
          return { ...params.props  };
        },
      },
    {
        field: 'ISCLOSED',
        headerName: '등록마감여부',
        editable: true,
        width: 140,
        type: 'boolean',
        preProcessEditCellProps: (params) => {
          params.row.ISCLOSED = params.props.value ? 'Y' : 'N';
          setForm(params.row)
          return { ...params.props  };
        },
      },
      {
        field: 'ISRECCLOSED',
        headerName: '분기마감여부',
        editable: true,
        width: 140,
        type : 'boolean',
        preProcessEditCellProps: (params) => {
          params.row.ISRECCLOSED = params.props.value ? 'Y' : 'N';
          setForm(params.row)
          return { ...params.props  };
        },
      }
  ];

  return (
    <React.Fragment>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          getRowId={(rows) => rows.QUARTER}
          rows={rows}
          columns={headCells}
          editMode="row"
          rowModesModel={rowModesModel}
          components={{ Toolbar : SetToolbar }}
          onCellKeyDown={handleRowKeyDown}
          componentsProps={{
            toolbar: {
              rowMode,quarter,
              selectedRowParam, setSelectedRowParam,
              rowModesModel, setRowModesModel,
              selected, setSelected,
              rows, setRows,
              form, setForm,
              result, setResult,
              dispatch
            },
            cell : { onFocus : handleRowFocus   },
          }}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </div>
    </React.Fragment>
  );
}
