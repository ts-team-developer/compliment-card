import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
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
import QuarterPopup from '../../modal/QuarterPopup';

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
          분기리스트
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
    id: 'quarter',
    numeric: false,
    disablePadding: true,
    label: '분기',
  },
  {
    id: 'isRecClosed',
    numeric: false,
    disablePadding: false,
    label: '등록마감여부',
  },
  {
    id: 'isClosed',
    numeric: false,
    disablePadding: false,
    label: '투표마감여부',
  }

];

export default function QuarterMain() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [allRows, setAllRows] = React.useState([]);
  const [row, setRow] = React.useState([]);
  const [yearList, setYearList] = React.useState(0);
  const [year, setYear] = React.useState(0);
  const [quarter, setQuarter] = React.useState(0);
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
        alert("수정할 분기를 선택해주세요.");

        return false;
      } else if (selected.length > 1) {
        alert("분기는 한개씩 수정해주세요.");

        return false;
      }

      setIsAdd(false);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const fetchRows = async () => {
    axios.get('/api/quarter/getQuarterList', {params: {year : year, quarter : quarter}})
    .then(async ({data}) => {
      setSelected([]);
      setRows(data[0])
    });
  }

  const fetchYear = async () => {
    axios.get('/api/quarter/getYearList')
    .then(({data}) => {
      setYearList(data[0])
    });
  };

  React.useEffect(() => {
    fetchRows();
    fetchYear();
  }, [year, quarter]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    initSelectedAll();

    if (event.target.checked) {
      const newSelecteds = rows.map((row) => row.quarter);

      setAllRows(rows.map((row) => [row.quarter,row.isClosed,row.isRecClosed]));
      setSelected(newSelecteds);

      return;
    }
  };

  const handleClick = (event, row) => {
    const quarter = row.quarter;
    const selectedIndex = selected.indexOf(quarter);

    let newSelected = [];
    let newAllRows = [];
    let addAllRows = [row.quarter,row.isClosed,row.isRecClosed];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, quarter);
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

  const isSelected = (quarter) => selected.indexOf(quarter) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <React.Fragment>
      <CssBaseline />
        <Box sx={{ bgcolor: 'none' }} >
                    <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    sx={{mb : -2 }}
                    >
          <Grid container spacing={1} sx={{marginBottom: '20px'}}>
            <Grid item xs={12} md={3}>
            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">년도</InputLabel>
                              <Select labelId="demo-simple-select-label" id="demo-simple-select" value={year} label="년도"  size="small" onChange={(e) => { setYear(e.target.value);}}>
                              <MenuItem value={0}>전체보기</MenuItem>
                              {yearList ? yearList.map((el, key) => {
                                return ( <MenuItem key={key} value={el.quarter}>{el.quarter}</MenuItem>  ) }) : null};
                              </Select>
                        </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
            <TextField
                          id="outlined-password-input"
                          label="분기"
                          type="quarter"
                          size="small"
                          /*onKeyPress={(e) => {if(e.charCode === 13) setNameKor(e.target.value)}}
                          onBlur={(e) => {setNameKor(e.target.value)}}*/
                          onChange={(e) => {setQuarter(e.target.value);}}
                        />
            </Grid>
            <Grid item xs={12} md={1}>
            <Button size="large" name="add" variant="outlined" onClick={(e) => {handleOpen(e)}}>추가</Button>
            </Grid>
            <Grid item xs={12} md={1}>
            <Button size="large" name="edit" variant="outlined" onClick={(e) => {handleOpen(e)}} sx={{ml:1}}>수정</Button>
            </Grid>
          </Grid>
         
                    </Box>
                <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%' }}>
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
                  const isItemSelected = isSelected(row.quarter);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => {handleClick(event, row)}}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.quarter}
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
                        {row.quarter}
                      </TableCell>
                      <TableCell>{row.isClosed}</TableCell>
                      <TableCell>{row.isRecClosed}</TableCell>
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
                  <QuarterPopup open={open} handleClose={handleClose} row={row} isAdd={isAdd} selected={selected}
                  setSelected={setSelected} fetchRows={fetchRows} initSelectedAll={initSelectedAll}/>
        </Box>
    </React.Fragment>
  );
}
