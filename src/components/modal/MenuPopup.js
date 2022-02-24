import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

export default function MenuModal(props) {
  const [editMenuName, setEditMenuName] = React.useState(0);
  const [editMenuId, setEditMenuId] = React.useState(0);
  const [editMenuUrl, setEditMenuUrl] = React.useState(0);

  const handleAddAndEdit = async () => {
      (props.isAdd) ? handleAdd(props) : handleEdit(props)
    }
  ;

  const handleAdd = async () => {
    axios.post('/api/menu/addMenu', {'menuNm' : editMenuName, 'menuId' : editMenuId, 'menuUrl' : editMenuUrl}).then(res => {
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
    axios.post('/api/menu/editMenu', {'selectedMenuId' : props.selected , 'menuNm' : editMenuName, 'menuId' : editMenuId, 'menuUrl' : editMenuUrl}).then(res => {
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
    setEditMenuId(props.row[0]);
    setEditMenuName(props.row[1]);
    setEditMenuUrl(props.row[2]);
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
          <div>
            <TextField sx={{mt : 1}} label="메뉴 ID" name="editMenuId" id="outlined-size-normal" defaultValue={editMenuId} onBlur={(e)=>{setEditMenuId(e.target.value)}}/>
            <TextField sx={{mt : 1, ml : 1}} label="메뉴명" name="editMenuName" id="outlined-size-normal"  defaultValue={editMenuName} onBlur={(e)=>{setEditMenuName(e.target.value)}}/>
          </div>
          <div>
            <TextField sx={{mt : 2}} label="메뉴 URL" name="editMenuUrl" id="outlined-size-normal" defaultValue={editMenuUrl} onBlur={(e)=>{setEditMenuUrl(e.target.value)}}/>
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
