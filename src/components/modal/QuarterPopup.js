import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function MenuModal(props) {
  const [editQuarter, setEditQuarter] = React.useState('1분기');
  const [isClosedChecked, setIsClosedChecked] = React.useState(false);
  const [isRecClosedChecked, setIsRecClosedChecked] = React.useState(false);
  const [isClosed, setIsClosed] = React.useState('N');
  const [isRecClosed, setIsRecClosed] = React.useState('N');

  const handleAddAndEdit = async () => {
      (props.isAdd) ? handleAdd(props) : handleEdit(props)
    }
  ;

  const handleAdd = async () => {
    axios.post('/api/quarter/addQuarter', {'quarter' : editQuarter}).then(res => {
        if(res.status == 200) {
          alert("추가되었습니다");
          props.fetchRows();
          props.initSelectedAll();
          props.handleClose();
        }
      }).catch( error => {
        alert("에러 : " + error);
      });
  };

  const handleEdit = async () => {
    axios.post('/api/quarter/editQuarter', {'selectedQuarter' : props.selected , 'quarter' : editQuarter, 'isClosed' : isClosed, 'isRecClosed' : isRecClosed}).then(res => {
        if(res.status == 200) {
          alert("변경되었습니다");
          props.fetchRows();
          props.initSelectedAll();
          props.handleClose();
        }
      }).catch( error => {
        alert("에러 : " + error);
      });
  };

  React.useEffect(() => {
    if (props.row.length > 0) {
        setEditQuarter(props.row[0].substring(7));
    } else {
        setEditQuarter("1분기");
    }

    if (props.row[1] === 'O') {
        setIsClosedChecked(true);
        setIsClosed('Y');
    } else {
        setIsClosedChecked(false);
        setIsClosed('N');
    }

    if (props.row[2] === 'O') {
        setIsRecClosedChecked(true);
        setIsRecClosed('Y');
    } else {
        setIsRecClosedChecked(false);
        setIsRecClosed('N');
    }
  }, [props.row]);

  return (
    <Box>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box  component="form"
            sx={{position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 430,
                      bgcolor: 'background.paper',
                      border: '2px solid #000',
                      boxShadow: 24,
                      p: 4
                    }}>
          <div>
            <FormControl sx={{ mt:1, minWidth: 350}}>
                  <InputLabel id="demo-simple-select-label">분기</InputLabel>
                  <Select labelId="demo-simple-select-label" id="demo-simple-select" value={editQuarter} label="분기"  size="small" onChange={(e) => { setEditQuarter(e.target.value);}}>
                  <MenuItem value='4분기'>4분기</MenuItem>
                  <MenuItem value='3분기'>3분기</MenuItem>
                  <MenuItem value='2분기'>2분기</MenuItem>
                  <MenuItem value='1분기'>1분기</MenuItem>
                  </Select>
            </FormControl>
          </div>
          {
            props.isAdd ? null :
            <div>
              <FormGroup aria-label="position" row>
                <FormControlLabel sx={{ mt : 1}} control={<Checkbox checked={isClosedChecked}
                onChange={(e) => { setIsClosedChecked(e.target.checked); e.target.checked ? setIsClosed('Y') : setIsClosed('N');}}/>} label="등록마감여부" />
                <FormControlLabel sx={{ mt : 1, ml : 7}} control={<Checkbox value='Y' checked={isRecClosedChecked}
                onChange={(e) => { setIsRecClosedChecked(e.target.checked); e.target.checked ? setIsRecClosed('Y') : setIsRecClosed('N');}}/>} label="투표마감여부" />
              </FormGroup>
            </div>
          }
          <div style={{ float:'right' }}>
            <Button sx={{mt : 2, mr : 1}} variant="contained" size="small" onClick={(e)=>{handleAddAndEdit()}}>
              {props.isAdd ? "추가" : "수정"}
            </Button>
          </div>
        </Box>
      </Modal>
    </Box>
  )
}
