import React, { Component } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import NotFound from './NotFound';
import NotAuth from './NotAuth';


class ErrorLayout extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }
  

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