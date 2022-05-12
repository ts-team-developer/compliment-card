import React, { Component } from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material'
import { Form } from "../index"
import { usePcStyles, useMobileStyles } from "../../../styles/styles"
import { useMediaQuery } from "@material-ui/core";


export default function FormLayout () {
    // Style 관련 CSS
    const isMobile = useMediaQuery("(max-width: 600px)");
    const classes = usePcStyles();
    const mobile = useMobileStyles();

    return (
        <React.Fragment>
            <Card variant="outlined" className={isMobile ? mobile.card : classes.card}>
                {/* Card Header */}
                <CardMedia className={isMobile ? mobile.cardTop  : classes.cardTop}>
                    <Typography variant="h5" component="div" className={classes.title} >
                       <b>작성 유의사항</b> 
                    </Typography>
                  
                    <Typography variant="body2" className={classes.descriptions}>
                        칭찬카드는 무엇 때문에 칭찬을 받는지 미담 사례를 구체적으로 작성해주세요. <br/>
                        분기 별로 가장 많이 칭찬을 받은 카드를 상단 '우수 칭찬카드' 메뉴에서 확인할 수 있으니 작성 시 참조해주세요. <br/>
                    </Typography>
            
                    <Typography variant="body2" color="text.secondary" >
                        미담 (美談) : 사람을 감동시킬 만큼 아름다운 내용을 가진 이야기
                    </Typography>
                </CardMedia>

                {/* Card Content */}
                <CardContent className={classes.cardContent}>
                    <Form/>    
                </CardContent>
            </Card>
        </React.Fragment>
    );
}