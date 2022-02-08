import React, { Component } from 'react';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    boxShadow: 24,
    p: 4,
  };


class Alim extends Component {
    constructor(props) {
        super(props);
    }
    render () {
        return (
            <div>
                <Modal open={this.props.open}  aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Alert severity='warning'  sx={style}  onClose={this.props.handleClose}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            <AlertTitle sx={{fontFamily : 'NanumGothic'}}>Warning</AlertTitle>
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2, fontFamily : 'NanumGothic' }}>{this.props.msg}</Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2, fontFamily : 'NanumGothic' }}>
                            <Button variant="contained" size="small" color='warning' sx={{mr : '5px'}} onClick={this.props.handleCallback}>확인</Button>
                            <Button variant="outlined" size="small" color='warning' onClick={this.props.handleClose}>취소</Button>
                        </Typography>
                    </Alert>
                </Modal>
            </div>
        );
    }
}

export default Alim;