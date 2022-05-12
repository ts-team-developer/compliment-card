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
import MenuPopup from '../../modal/MenuPopup';

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
          메뉴리스트
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
    id: 'MENU_ID',
    numeric: false,
    disablePadding: true,
    label: '메뉴 ID',
  },
  {
    id: 'MENU_NM',
    numeric: false,
    disablePadding: true,
    label: '이름',
  },
  {
    id: 'MENU_URL',
    numeric: false,
    disablePadding: false,
    label: 'URL',
  },
  {
    id: 'USE_YN',
    numeric: false,
    disablePadding: false,
    label: '사용여부',
  }
];

export default function MenuMain() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [allRows, setAllRows] = React.useState([]);
  const [row, setRow] = React.useState([]);
  const [searchMenuNm, setSearchMenuNm] = React.useState(0);
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
        alert("수정할 메뉴를 선택해주세요.");

        return false;
      } else if (selected.length > 1) {
        alert("메뉴는 한개씩 수정해주세요.");

        return false;
      }

      setIsAdd(false);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    const selectedMenuCount = selected.length;

    if (selectedMenuCount === 0) {
      alert("비활성화할 메뉴를 선택해주세요.");
    } else {
      if (!window.confirm(selectedMenuCount + "개를 비활성화 하시겠습니까?")) return false;
    }

    axios.post('/api/menu/deleteMenu', {'menuIdArr' : selected}).then(res => {
        if(res.status == 200) {
          alert("변경되었습니다");
        }
      }).catch( error => {
        alert("에러 : " + error);
      });
  };

  const handleActivate = async () => {
    const selectedMenuCount = selected.length;

    if (selectedMenuCount === 0) {
      alert("활성화할 메뉴를 선택해주세요.");
    } else {
      if (!window.confirm(selectedMenuCount + "개를 활성화 하시겠습니까?")) return false;
    }

    axios.post('/api/menu/activateMenu', {'menuIdArr' : selected}).then(res => {
        if(res.status == 200) {
          alert("변경되었습니다");
        }
      }).catch( error => {
        alert("에러 : " + error);
      });
  };

  const fetchRows = async () => {
    axios.get('/api/menu/getMenuListAll', {params: {menuNm : searchMenuNm}})
    .then(async ({data}) => {
      setSelected([]);
      setRows(data[0])
    });
  }

  React.useEffect(() => {
    fetchRows();
  }, [searchMenuNm]);

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
    const menuId = row.MENU_ID;
    const selectedIndex = selected.indexOf(menuId);

    let newSelected = [];
    let newAllRows = [];
    let addAllRows = [row.MENU_ID,row.MENU_NM,row.MENU_URL,row.USE_YN];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, menuId);
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
      setRow(allRows[0]);
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

  const isSelected = (menuId) => selected.indexOf(menuId) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <React.Fragment>
      <CssBaseline />
          <Box component="form" noValidate autoComplete="off"  >
            <Grid container spacing={1} sx={{marginBottom: '20px'}}>
              <Grid item xs={12} md={3}>
                <TextField fullWidth id="outlined-password-input" label="메뉴명" type="menuNm" size="small"
                  onChange={(e) => {setSearchMenuNm(e.target.value);}} />
              </Grid>
              <Grid item xs={12} md={1}>
                <Button  fullWidth size="medium" name="add" variant="outlined" onClick={(e) => {handleOpen(e)}}>추가</Button>
              </Grid>
              <Grid item xs={12} md={1}>
                <Button fullWidth size="medium" name="edit" variant="outlined" onClick={(e) => {handleOpen(e)}}>수정</Button>
              </Grid>
              <Grid item xs={12} md={1}>
                <Button fullWidth size="medium" variant="outlined" onClick={handleActivate}>활성화</Button>
              </Grid>
              <Grid item xs={12} md={1}>
                <Button fullWidth size="medium" variant="outlined" onClick={handleDelete} >비활성화</Button>
              </Grid>
            </Grid>
          </Box>

            <Box sx={{ width: '100%' }}>
              <Paper sx={{ width: '100%'}}>
              <EnhancedTableToolbar numSelected={selected.length} />
              <TableContainer>
                <Table  sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size='medium' >
                <EnhancedTableHead numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length} />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.MENU_ID);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => {handleClick(event, row)}}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.MENU_ID}
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
                        {row.MENU_ID}
                      </TableCell>
                      <TableCell>{row.MENU_NM}</TableCell>
                      <TableCell>{row.MENU_URL}</TableCell>
                      <TableCell>{row.USE_YN}</TableCell>
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
                  <MenuPopup open={open} handleClose={handleClose} row={row} isAdd={isAdd} selected={selected}
                  setSelected={setSelected} fetchRows={fetchRows} initSelectedAll={initSelectedAll}/>
    </React.Fragment>
  );
}
