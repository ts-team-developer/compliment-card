import React, { Component } from 'react';
import{ Box, Container }  from '@mui/material';
import { NotFound, NotAuth } from './index';

class ErrorLayout extends Component {
    render() {
        console.log(`error : ${this.props.error}`)
        const errorPage = () => {
            if(this.props.error == 'auth'){
                return (<NotAuth/>);
            } else {
                return (<NotFound/>);
            }
        }
            return (
                <React.Fragment>
                    <Container fixed sx={{mb : '50px'}}>
                        <Box sx={{ bgcolor: 'none', height: '100vh' }} sx={{ mt: 10 }} >
                            {errorPage()}
                        </Box>
                    </Container>
                </React.Fragment>
            );
    }
}

export default ErrorLayout;