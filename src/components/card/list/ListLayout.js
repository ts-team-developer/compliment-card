import React, { Component } from 'react';
import List from "./List"
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import { connect } from 'react-redux';
import { loginRequest } from '../../../redux/actions/authentication'; 

class ListLayout extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
            <Card variant="outlined" sx={{mb : 10, pt: 3}}>
                    {/* Card Header */}
                    <CardMedia sx={{m:3, borderBottom: '1px solid #eee'}} >
                        <Typography variant="h5" component="div" sx={{fontFamily:'NanumSquare', fontWeight: 'bold'}}>
                        평가방법
                        </Typography>
                      
                        <Typography variant="body2" sx={{ mt : 4, mb: 4, fontFamily:'NanumSquare' }}>
                            <p style={{fontFamily:'NanumSquare'}}>평가는 5점 척도입니다. 좋은 미담 사례를 위주로 높은 평가 부탁드립니다.</p>
                            <p style={{fontFamily:'NanumSquare'}}>평가 점수의 합이 높은 10개의 칭찬카드를 분기 모임 시 현장 투표 진행합니다. </p>
                            <p style={{fontFamily:'NanumSquare'}}>칭찬하는 내용이 이해가 가지 않거나 성의가 없다고 생각하시면 5점 척도에서 가장 낮은 쪽의 점수를 선택해주세요. </p>
                            <p style={{fontFamily:'NanumSquare'}}>본인이 작성한 카드는 본인을 제외한 전 직원이 오점 척도로 평가하여 본인에게만 피드백을 드릴테니, 다른 칭찬카드 작성 시에 분발해주세요. <br/></p>
                            <p style={{fontFamily:'NanumSquare'}}>시험적으로 5점 척도를 사용합니다. 더 좋은 방안을 찾는 중이니 성실하게 평가해주십시오.</p>
                        </Typography>
                
                        <Typography sx={{ mb: 1.5, mt:3, fontFamily: 'NanumGothic', ml:2 }} color="text.secondary">
                        </Typography>
                    </CardMedia>

                    {/* Card Content */}
                    <CardContent>
                        <List  />    
                    </CardContent>
                </Card>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      status : state.authentication.status.currentUser
    }
  }
  const mapDispatchToProps = (dispatch) => {
    return {
      loginRequest : () => {
        return dispatch(loginRequest());
      }
    }
  }
  
export default connect (mapStateToProps, mapDispatchToProps)(ListLayout);