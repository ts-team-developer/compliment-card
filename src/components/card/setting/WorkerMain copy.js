import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import { CssBaseline, Box, Button, Typography, TextField, Paper, Switch,
  Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, 
  TableRow, TableSortLabel, Toolbar, Checkbox, InputLabel, FormControl, Select, MenuItem,Grid }  from '@mui/material';
import WorkerPopup from '../../modal/WorkerPopup';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

// --------------------- MUI 테이블 관련 소스(정렬, 헤더) 시작 ----------------------
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        > 직원리스트
        </Typography>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell> */}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

// --------------------- MUI 테이블 관련 소스(정렬, 헤더) 끝 ----------------------

// 헤더 목록
const headCells = [
  {
    id: 'name_kor',
    numeric: false,
    disablePadding: false,
    label: '이름',
    editable: true
  },
  {
    id: 'team',
    numeric: false,
    disablePadding: false,
    label: '팀',
    editable: true
  },
  {
    id: 'rank',
    numeric: false,
    disablePadding: false,
    label: '직급',
    editable: true
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: '이메일',
    editable: true
  },
  {
    id: 'work_sts',
    numeric: false,
    disablePadding: false,
    label: '활성화 여부',
  }
];

export default function WorkerMain() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [allRows, setAllRows] = React.useState([]);
  const [row, setRow] = React.useState([]);
  const [name_kor, setNameKor] = React.useState(0);
  const [team, setTeam] = React.useState(0);
  const [teamList, setTeamList] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [isAdd, setIsAdd] = React.useState(false);

  const initSelectedAll = () => {
    setSelected([]);
    setAllRows([]);
    setRow([]);
  }

  const handleOpen = (e) => {
    if (e.target.name === "add") {
      setIsAdd(true);
    } else {
      if (selected.length === 0) {
        alert("수정할 직원을 선택해주세요.");
        return false;
      }
      setIsAdd(false);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleDelete = async (e) => {
    axios.post('/api/worker/deleteWorker', {'dispOrder' : e.target.value}).then(res => {
        
      }).catch( error => {
        alert("에러 : " + error);
      });
  };

  const fetchRows = async () => {
    const list = [];
    axios.get('/api/worker/getWorkerList', {params: {name_kor : name_kor, team : team}})
    .then(async ({data}) => {
      setSelected([]);
      // setRows(data[0]);
      data[0].map((el) => {
        el.work_sts = (el.work_sts == "1") ? <Switch {...label} defaultChecked onChange={handleDelete} value={el.disp_order} /> : <Switch {...label} onChange={handleDelete} value={el.disp_order}  />
        list.push(el)
      });
      setRows(list);
    });
  }

  const fetchTeam = async () => {
    axios.get('/api/worker/getTeamList')
    .then(({data}) => {
      setTeamList(data[0])
    });
  };

  React.useEffect(() => {
    fetchRows();
    fetchTeam();
  }, [name_kor, team]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    initSelectedAll();
    if (event.target.checked) {
      const newSelecteds = rows.map((row) => row.MENU_ID);
      setAllRows(rows.map((row) => [row.MENU_ID,row.MENU_NM,row.MENU_URL,row.USE_YN]));
      setSelected(newSelecteds);
      return;
    }
  };

  const handleClick = (event, row) => {
    const disp_order = row.disp_order;
    const selectedIndex = selected.indexOf(disp_order);

    let newSelected = [];
    let newAllRows = [];
    let addAllRows = [row.name_kor,row.team,row.email,row.rank];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, disp_order);
      allRows.push(addAllRows);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      allRows.splice(0, 1);
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      allRows.pop();
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
      newAllRows = newAllRows.concat(
        allRows.slice(0, selectedIndex),
        allRows.slice(selectedIndex + 1),
      );
      setAllRows(newAllRows);
    }

    if (allRows.length === 1) {
      setRow(allRows[0])
    } else {
      setRow([])
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (disp_order) => selected.indexOf(disp_order) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <React.Fragment>
      <CssBaseline />
      <Grid container spacing={1} sx={{marginBottom: '20px'}}>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">팀</InputLabel>
          <Select labelId="demo-simple-select-label" 
            id="demo-simple-select" value={team} label="팀"  size="small" onChange={(e) => { setTeam(e.target.value);}}  >
          <MenuItem value={0}>전체보기</MenuItem>
            {teamList ? teamList.map((el, key) => { return ( <MenuItem key={key} value={el.team}>{el.team}</MenuItem>  ) }) : null};
          </Select>
          </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
          <FormControl fullWidth>
          <TextField
              id="outlined-password-input"
              label="이름"
              type="name_kor"
              size="small"
              fullWidth
              onChange={(e) => {setNameKor(e.target.value);}} />
          </FormControl>
          </Grid>
          <Grid item xs={12} md={1}>
          <FormControl fullWidth>
            <Button size="medium"  fullWidth name="add" variant="outlined" onClick={(e) => {handleOpen(e)}} >추가</Button>
          </FormControl>
          </Grid>
          <Grid item xs={12} md={1}>
          <FormControl fullWidth>
            <Button size="medium"  fullWidth name="edit" variant="outlined" onClick={(e) => {handleOpen(e)}}>수정</Button>
          </FormControl>
          </Grid>
        </Grid>

   

          <Paper sx={{ width: '100%', mt : '10px' }}>
            <EnhancedTableToolbar numSelected={selected.length} />
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size='medium'>
            
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length} />
            
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.disp_order);
                  const labelId = `enhanced-table-checkbox-${index}`;
                return (
                    <TableRow
                      hover
                      onClick={(event) => {handleClick(event, row)}}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.disp_order}
                      selected={isItemSelected} >
                      <TableCell
                          component="th"
                          id={labelId}
                          scope="row" >
                        {row.name_kor}
                      </TableCell>
                      <TableCell>{row.team}</TableCell>
                      <TableCell>{row.rank}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.work_sts}</TableCell>
                  </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </Paper>
      <WorkerPopup open={open} handleClose={handleClose} row={row} isAdd={isAdd} selected={selected} sx = {{ width : {xs:'90%', md:'auto'}}}
                  setSelected={setSelected} fetchRows={fetchRows} initSelectedAll={initSelectedAll}/>
    </React.Fragment>
  );
}
