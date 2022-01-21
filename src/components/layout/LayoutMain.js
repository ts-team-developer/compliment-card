import React, {Component} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import FormLayout from '../card/form/FormLayout';
import ListLayout from '../card/list/ListLayout';
import GradeListLayout from '../card/gradelist/GradeListLayout';

import {GradeList, Status, Setting } from '../../index.js';


class LayoutMain extends Component {
    constructor(props) {
        super(props)
    }

    render() {

        const layoutMain = () => {
            if(this.props.url == '/view/form') {
                return (<FormLayout/>);
            } else if(this.props.url == '/view/list') {
                return (<ListLayout/>);
            } else if(this.props.url =='/view/gradelist'){
                return (<GradeListLayout/>)
            }else if(this.props.url == '/view/status') {
                return (<Status/>)
            } else if(this.props.url=='/view/setting') {
                return (<Setting/>)
            } 
        }

        return (
            <React.Fragment>
                {this.props.children}
                <Container fixed >
                    <Box sx={{ bgcolor: 'none', height: '100vh' }} sx={{ mt: 10 }} >
                        <Box component="form" noValidate  autoComplete="off"  > 
                            {layoutMain()}
                        </Box>
                    </Box>
                </Container>
                
            </React.Fragment>
        );
    }
}

export default LayoutMain;