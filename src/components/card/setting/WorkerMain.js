import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import { visuallyHidden } from '@mui/utils';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import WorkerPopup from '../../modal/WorkerPopup';

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

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
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
        >
          직원리스트
        </Typography>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
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
    disablePadding: true,
    label: '이름',
  },
  {
    id: 'team',
    numeric: false,
    disablePadding: false,
    label: '팀',
  },
  {
    id: 'rank',
    numeric: false,
    disablePadding: false,
    label: '직급',
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: '이메일',
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
  const [disp_order, setDispOrder] = React.useState(0);
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

  const handleDelete = async () => {
    const selectedWorkerCount = selected.length;

    if (selectedWorkerCount === 0) {
      alert("비활성화할 직원을 선택해주세요.");
    } else {
      if (!window.confirm(selectedWorkerCount + "명을 비활성화 하시겠습니까?")) return false;
    }

    axios.post('/api/worker/deleteWorker', {'dispOrderArr' : selected}).then(res => {
        if(res.status == 200) {
          alert("변경되었습니다");
        }
      }).catch( error => {
        alert("에러 : " + error);
      });
  };

  const fetchRows = async () => {
    axios.get('/api/worker/getWorkerList', {params: {name_kor : name_kor, team : team}})
    .then(async ({data}) => {
      setSelected([]);
      setRows(data[0])
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
      <Container fixed >
        <Box sx={{ bgcolor: 'none', height: '100vh' }} sx={{ mt: 3 }} >
            <Card variant="outlined">
                <React.Fragment>
                  <CardContent>
                    <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    sx={{mb : -2 }}
                    >
                        <FormControl sx={{ mt:1.6, ml:1, minWidth: 120 }}>
                              <InputLabel id="demo-simple-select-label">팀</InputLabel>
                              <Select labelId="demo-simple-select-label" id="demo-simple-select" value={team} label="팀"  size="small" onChange={(e) => { setTeam(e.target.value);}}>
                              <MenuItem value={0}>전체보기</MenuItem>
                              {teamList ? teamList.map((el, key) => {
                                return ( <MenuItem key={key} value={el.team}>{el.team}</MenuItem>  ) }) : null};
                              </Select>
                        </FormControl>
                        <TextField
                          sx={{display: 'inline-block', verticalAlign:'middle', mt:1.5, ml:1 }}
                          id="outlined-password-input"
                          label="이름"
                          type="name_kor"
                          size="small"
                          /*onKeyPress={(e) => {if(e.charCode === 13) setNameKor(e.target.value)}}
                          onBlur={(e) => {setNameKor(e.target.value)}}*/
                          onChange={(e) => {setNameKor(e.target.value);}}
                        />
                        <Typography variant="body2" sx={{display: 'inline-block', verticalAlign:'middle', mt:1.5, ml:1 }}>
                            {/*<Button size="large" variant="outlined" onClick={(e) => {setNameKor(e.target.value)}}>조회</Button>*/}
                            <Button size="large" name="add" variant="outlined" onClick={(e) => {handleOpen(e)}}>추가</Button>
                            <Button size="large" name="edit" variant="outlined" onClick={(e) => {handleOpen(e)}} sx={{ml:1}}>수정</Button>
                            <Button size="large" variant="outlined" onClick={handleDelete} sx={{ml:1}}>비활성화</Button>
                        </Typography>
                    </Box>
                  </CardContent>
                </React.Fragment>
                <CardContent>
                <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='medium'
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
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
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
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
    </Box>
                  </CardContent>
                  <WorkerPopup open={open} handleClose={handleClose} row={row} isAdd={isAdd} selected={selected}
                  setSelected={setSelected} fetchRows={fetchRows} initSelectedAll={initSelectedAll}/>
            </Card>
        </Box>
      </Container>
    </React.Fragment>
  );
}
