import React, { Component } from 'react';
import axios from 'axios';


import Rating from '@mui/material/Rating';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

class Evaluation extends Component{
    constructor (props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) => {

    }
    
    render() {
        console.log(this.props.isRecPeriodYn)
        if(this.props.isRecPeriodYn) <Rating name="size-small" defaultValue={this.props.evaluation} size="medium" onChange={this.handleChange} />
        else return null;
    }
}

export default Evaluation;