import React, {Component} from 'react';
import { Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Form , List, GradeList, Status, Setting } from '../index.js';


class LayoutMain extends Component {
    constructor(props) {
        super(props)
    }
  
    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <Container fixed >
                    <Box sx={{ bgcolor: 'none', height: '100vh' }} sx={{ mt: 10 }} >
                            <Card variant="outlined" sx={{mb : 10, pt: 3}}>
                           
                            <CardContent>
                                <Box  component="form" noValidate  autoComplete="off"  > 
                                    <Route path='/view/form' component = {() => <Form userLogin ={this.props.userLogin}/>}   />
                                    <Route path='/view/list' component = {() => <List  userLogin ={this.props.userLogin}/>}   />
                                    <Route path='/view/gradelist' component = {() => <GradeList  userLogin ={this.props.userLogin}/>}   />
                                    <Route path='/view/status' component = {() => <Status  userLogin ={this.props.userLogin}/>}   />
                                    <Route path='/view/setting' component = {() => <Setting  userLogin ={this.props.userLogin}/>}   />
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Container>
    </React.Fragment>
        )
    }
}

export default LayoutMain;