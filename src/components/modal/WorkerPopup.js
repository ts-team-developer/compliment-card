import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';

export default function WorkerModal(props) {
  const [editName, setEditName] = React.useState(0);
  const [editTeam, setEditTeam] = React.useState(0);
  const [editEmail, setEditEmail] = React.useState(0);
  const [editRank, setEditRank] = React.useState(0);

  const handleAddAndEdit = async () => {
      (props.isAdd) ? handleAdd(props) : handleEdit(props)
    }
  ;

  const handleAdd = async () => {
    axios.post('/api/worker/addWorker', {'name_kor' : editName, 'team' : editTeam, 'email' : editEmail, 'rank' : editRank}).then(res => {
        if(res.status == 200) {
          alert("추가되었습니다");
          props.fetchRows();
          props.initSelectedAll();
        }
      }).catch( error => {
        alert("에러 : " + error);
      });
  };

  const handleEdit = async () => {
    const selectedWorkerCount = props.selected.length;

    if (selectedWorkerCount > 0 && !window.confirm(selectedWorkerCount + "명의 데이터를 수정하시겠습니까?")) return false;

    axios.post('/api/worker/editWorker', {'dispOrderArr' : props.selected , 'name_kor' : editName, 'team' : editTeam, 'email' : editEmail, 'rank' : editRank}).then(res => {
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
    setEditName(props.row[0]);
    setEditEmail(props.row[2]);
    setEditTeam(props.row[1]);
    setEditRank(props.row[3]);
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
                      width: 530,
                      bgcolor: 'background.paper',
                      border: '2px solid #000',
                      boxShadow: 24,
                      p: 4
                    }}>
          {(props.selected.length > 1) && !props.isAdd ? null :
            <div>
              <TextField sx={{mt : 1}} label="이름" name="editName" id="outlined-size-normal"  defaultValue={editName} onBlur={(e)=>{setEditName(e.target.value)}}/>
              <TextField sx={{mt : 1, ml:1}} label="이메일" name="editEmail" id="outlined-size-normal" defaultValue={editEmail} onBlur={(e)=>{setEditEmail(e.target.value)}}/>
            </div>}
            <div>
              <TextField sx={{mt : 2}} label="팀" name="editTeam" id="outlined-size-normal" defaultValue={editTeam} onBlur={(e)=>{setEditTeam(e.target.value)}}/>
              <TextField sx={{mt : 2, ml:1}} label="직급" name="editRank" id="outlined-size-normal" defaultValue={editRank} onBlur={(e)=>{setEditRank(e.target.value)}}/>
            </div>
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
