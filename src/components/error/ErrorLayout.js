import React, { Component } from 'react';
import{ Box, Container }  from '@mui/material/Box';
import { NotFound, NotAuth } from './index';

class ErrorLayout extends Component {
    render() {
        const errorPage = () => {
            if(this.props.error == '404') {
                return (<NotFound/>);
            } else if(this.props.error == 'auth'){
                return (<NotAuth/>);
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