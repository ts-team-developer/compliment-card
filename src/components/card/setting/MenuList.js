import * as React from 'react';
import { DataGrid, GridRowModes } from '@mui/x-data-grid';
import { Button, Snackbar, Typography,Box } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SetToolbar(props) {
  const { setSelectedRowParam, selectedRowParam, rowMode, rowModesModel, setRowModesModel, selected, setSelected, rows, setRows, form, setForm, result, setResult, menu} = props;

  // ADD버튼 이벤트
  const addRow = () => {
    if(selected == null) {
      setRows((oldRows) => [{ id : menu.NEXT_MENU, MENU_ID : menu.NEXT_MENU , MENU_NM : '', MENU_URL : '', USE_YN :'Y' }, ...oldRows ]);
      setForm({MENU_ID : menu.NEXT_MENU, MENU_NM : '', USE_YN : 'Y' })
      setSelected(menu.NEXT_MENU);
      setRowModesModel((oldModel) => ({
        [menu.NEXT_MENU] : { mode: GridRowModes.Edit, fieldToFocus: 'MENU_NM' },
      }));
    } 
  };

  const handleSaveOrEdit = (event) => {
    if (!selectedRowParam)  return;
    if(selected == null) setSelected(selectedRowParam.id);

    if(selected != menu.NEXT_MENU) {
      axios.get('/api/menu/view', {params: { MENU_ID : selectedRowParam.id }}).then(async({data}) => {
        setForm(data[0])
      });
    }

    setRowModesModel({
      ...rowModesModel,
      [selectedRowParam.id]:{ mode: rowMode === 'edit' ? GridRowModes.View : GridRowModes.Edit },
    });
  };


  const handleRequestSave = () => {
    // 저장 로직
    axios.post('/api/menu/save', form).then(res => {
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
    if(selected == menu.NEXT_MENU) {
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
      [selected != menu.NEXT_MENU ? selected : selectedRowParam.id]: {  mode: GridRowModes.View, ignoreModifications: true },
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

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 1,  textAlign: 'right' }} >
        <div>
         {/* 등록 및 수정 시 Validation Check시 사용 */}
         <Snackbar open={result.open} autoHideDuration={2000} onClose={handleClose} >
            <Alert onClose={handleClose} severity={result.variant} sx={{ width: '100%' }}> {result.message} </Alert>
          </Snackbar>
          <Typography variant="overline" sx={{display:'inlineBlock', textAlign:'left'}}   color="error">
            메뉴는 등록은 관리자에게 문의해주세요. (*추가 개발 필요)
          </Typography>
          <Typography variant="overline" display={result.open ? "inline-block" : "none" } gutterBottom color={result.variant}>
        {result.message}
        </Typography>
      </div>
        
      {selected != null  &&
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
          메뉴추가
        </Button>}

      {(selected == null && selectedRowParam ) &&
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
  const [selectedRowParam, setSelectedRowParam] = React.useState(null);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [selected, setSelected] = React.useState(null);
  const [result, setResult] = React.useState({open: false, variant : 'error', message : '', status : false});
  const [menu, setMenu] = React.useState(null);
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
    const fetchRows = async () => {
      axios.get('/api/menu/getMenuListAll', {params: props.searchForm})
      .then(async (res) => {
        setRows(res.data)
      });
    }

    const nextMenu = async () => {
      axios.get('/api/menu/next').then(async(res) => {
        setMenu(res.data[0][0])
      })
    }
    fetchRows();
    nextMenu();
}, [props.searchForm, result.status, info]);

  // dataGrid 데이터
  const headCells = [
    { field: 'MENU_ID', headerName: '메뉴ID', editable: false, width: 120,},
    { field: 'MENU_NM', width: 180, headerName: '메뉴명', editable: true,
      preProcessEditCellProps: (params) => {
        params.row.MENU_NM = params.props.value;
        setForm(params.row)
        return { ...params.props  };
      } 
    },
    { field: 'MENU_URL', width: 180, headerName: '메뉴URL', editable: true,
      preProcessEditCellProps: (params) => {
        params.row.MENU_URL = params.props.value;
        setForm(params.row)
        return { ...params.props  };
      } 
    },
    { field: 'USE_YN',
      headerName: '활성화 여부', type:'boolean', editable: true, width: 100, 
      preProcessEditCellProps: (params) => {
        params.row.USE_YN = params.props.value ? 1 : 0 ;
        setForm(params.row)
        return { ...params.props  };
      } 
    }
  ];

  return (
    <React.Fragment>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          getRowId={(rows) => rows.MENU_ID}
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
              result, setResult, menu, setMenu
            },
            cell : { onFocus : handleRowFocus   },
          }}
       
          experimentalFeatures={{ newEditingApi: true }}
        />
      </div>
    </React.Fragment>
  );
}
