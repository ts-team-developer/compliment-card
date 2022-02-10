import React, { Component } from 'react';
import { NotInterestedIcon, Box, Card, Typography, CardContent, CardMedia } from '@mui/material';

class NotFound extends Component {
    constructor(props) {
        super(props); 
    }

    componentDidMount() {
        setTimeout(() => {
        }, 3000)
    }
    render() {
        return (
            <Box component="form" noValidate  autoComplete="off"  > 
                <Card variant="outlined" sx={{mb : 10, pt: 3}}>
                    <CardMedia sx={{m:3}} >
                        <Typography variant="h1 " component="h1" sx={{fontFamily:'NanumSquare', textAlign:'center', fontSize : '120px' }}>
                            <NotInterestedIcon color="error" fontSize="120px"  />
                        </Typography>
                        <Typography variant="h1 " component="h1" sx={{fontFamily:'NanumSquare', textAlign:'center',fontSize : '70px'}}>
                            접근 불가
                        </Typography>
                    </CardMedia>
                                    
                    {/* Card Content */}
                    <CardContent>
                        <Typography variant="h4 " component="h4" sx={{fontFamily:'NanumSquare', textAlign:'center', mb: '30px', fontSize : '30px' }}>
                            접근가능 페이지가 아닙니다.
                        </Typography>
    
                        <Typography variant="h4 " component="h4" sx={{fontFamily:'NanumSquare', textAlign:'center', mb: '30px', fontSize : '15px', cursor:'pointer', color : '#000'}}>
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        )
    }
}

export default NotFound;