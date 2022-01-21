import React, { Component } from 'react';
import Form from "./Form"
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';


class FormLayout extends Component {
    render() {
        return (
            <React.Fragment>
            <Card variant="outlined" sx={{mb : 10, pt: 3}}>
                    {/* Card Header */}
                    <CardMedia sx={{m:3, borderBottom: '1px solid #eee'}} >
                        <Typography variant="h5" component="div" sx={{fontFamily:'NanumSquare', fontWeight: 'bold'}}>
                            작성 유의사항
                        </Typography>
                      
                        <Typography variant="body2" sx={{ mt : 4, mb: 4, fontFamily:'NanumSquare' }}>
                            <p style={{fontFamily:'NanumSquare'}}>칭찬카드는 무엇 때문에 칭찬을 받는지 미담 사례를 구체적으로 작성해주세요.</p>
                            <p style={{fontFamily:'NanumSquare'}}>분기 별로 가장 많이 칭찬을 받은 카드를 상단 '우수 칭찬카드' 메뉴에서 확인할 수 있으니 작성 시 참조해주세요.</p>
                        </Typography>
                
                        <Typography sx={{ mb: 1.5, mt:3, fontFamily: 'NanumGothic', ml:2 }} color="text.secondary">
                            미담 (美談) : 사람을 감동시킬 만큼 아름다운 내용을 가진 이야기
                        </Typography>
                    </CardMedia>

                    {/* Card Content */}
                    <CardContent>
                        <Form/>    
                    </CardContent>
                </Card>
            </React.Fragment>
        );
    }
}

export default FormLayout;