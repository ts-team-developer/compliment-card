import React, { Component } from 'react';
import { Modal, Alert, AlertTitle, Typography } from '@mui/material';

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
                <Modal open={this.props.open} onClose={this.props.handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Alert severity={this.props.error ? 'error' : 'success'}  sx={style}  onClose={this.props.handleClose}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            <AlertTitle sx={{fontFamily : 'NanumGothic'}}>{this.props.error ? 'error' : 'success'}</AlertTitle>
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2, fontFamily : 'NanumGothic' }}>{this.props.msg}</Typography>
                    </Alert>
                </Modal>
            </div>
        );
    }
}

export default Alim;