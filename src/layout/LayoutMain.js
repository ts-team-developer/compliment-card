import React, {Component, useState} from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Form , List, GradeList, Status } from '../index.js';


class main extends Component {
    constructor(props) {
        super(props)
        var handleToUpdate  = this.handleToUpdate.bind(this);
        var arg1 = '';
    }
    handleToUpdate(someArg){
        alert('We pass argument from Child to Parent: ' + someArg);
        this.setState({arg1:someArg});
}

  
    render() {
        var handleToUpdate  =   this.handleToUpdate;
        return (
            <React.Fragment>
                <CssBaseline />
                <Container fixed >
                    <Box sx={{ bgcolor: 'none', height: '100vh' }} sx={{ mt: 10 }} >
                            <Card variant="outlined" sx={{mb : 10, pt: 3}}>
                           
                            <CardContent>
                                <Box
                                    component="form"
                                    noValidate
                                    autoComplete="off"
                                > 
                                   {/*  <Route path='/form' render={() => <Form handleToUpdate = {handleToUpdate.bind(this)} />}  /> */}
                                    <Route path='/form' component={Form}  />
                                    <Route path='/list' component={List} />
                                    <Route path='/gradelist' component={GradeList} />
                                    <Route path='/status' component={Status} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Container>
    </React.Fragment>
        )
    }
}

export default main;