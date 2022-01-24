import React, { Component } from 'react';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

class NotFound extends Component {
    constructor(props) {
        super(props); 
    }

    componentDidMount() {
        setTimeout(() => {
            console.log(`test`);
        }, 800)
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
                            404 Not Found
                        </Typography>
                    </CardMedia>
                                    
                    {/* Card Content */}
                    <CardContent>
                        <Typography variant="h4 " component="h4" sx={{fontFamily:'NanumSquare', textAlign:'center', mb: '30px', fontSize : '30px' }}>
                            페이지를 찾을 수 없습니다.
                        </Typography>
    
                        <Typography variant="h4 " component="h4" sx={{fontFamily:'NanumSquare', textAlign:'center', mb: '30px', fontSize : '15px', cursor:'pointer', color : '#eee'}}>
                            처음 화면으로 돌아갑니다.
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        )
    }
}

export default NotFound;