import React, { Component } from 'react';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';

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
        this.state = {
            open : props.open
        }
        
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose = () => {
        this.setState({
            open : false
        })
        
        if(this.props.status == 'error') {
            window.location = this.props.url
        } 
    }

    render () {
        return (
            <div>
                <Modal open={this.state.open} onClose={this.handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Alert severity={this.props.status}  sx={style}  onClose={this.handleClose}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            <AlertTitle>{this.props.status}</AlertTitle>
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>{this.props.msg}</Typography>
                    </Alert>
                </Modal>
            </div>
        );
    }
}

export default Alim;