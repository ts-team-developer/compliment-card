import React, { Component } from 'react';
import axios from 'axios';

import { Rating } from '@mui/material';
import { AlimPopup } from '../../modal/index';

class Evaluation extends Component{
    constructor (props) {
        super(props);
        this.state = {
            open : false,
            message : '',
            error : false,
            score : this.props.evaluation,
            form : {seq : '', evaluation : '0'}
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) => {
        this.setState({
            ...this.state.form,
            form : {
                seq : this.props.seq,
                evaluation : e.target.value
            }
        }, () => {
            axios.post('/api/card/evaluation', this.state.form).then( async res => {
                this.setState({
                    open: true,
                    error : res.status != 200,
                    message : res.status == 200 ? '추천 성공 !' : res.data.message
                });
              }).catch(async error => {
                this.setState({
                    open: true,
                    error :true,
                    message : error.response.data.message,
                    score : this.props.evaluation
                });
              });
        })
        setTimeout(() => {
            this.setState({
                open: false,
                score : 0
            });
        }, 800)
    }
    render() {
        return (
            <React.Fragment>
                <AlimPopup open={this.state.open} handleClose={this.handleClose} msg={this.state.message} error={this.state.error}/>
                <Rating name="size-small" defaultValue={this.state.score} size="medium" onChange={this.handleChange} />
            </React.Fragment>
        )
    }
}
export default Evaluation;