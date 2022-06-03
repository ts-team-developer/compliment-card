import React, { Component } from 'react';
import { Card, CardContent, CardMedia, Typography, Alert, AlertTitle } from '@mui/material'
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
                        미담 (美談) : 사람을 감동시킬 만큼 아름다운 내용을 가진 이야기 <br/><br/>
                    </Typography>
                    <React.Fragment>
                    <Alert severity="error">
                        <AlertTitle><strong>칭찬카드 작성 규정</strong></AlertTitle>
                        - 칭찬하고 싶은 대상자가 있을 경우 , 아무때나 365일 작성이 가능 <br/>
                        - 칭찬카드 작성 시 창의 / 긍정 / 열정 / 약속 중 한가지 카테고리를 선택하여 작성 <br/>
                        - 분기 회의 전 최소 1개 이상의 칭찬카드 작성 필수 <br/>
                        - 칭찬카드는 최소 50자 이상 작성 <br/>

                    </Alert>
                    <Alert severity="error">
                        <AlertTitle><strong>칭찬카드 포상 규정</strong></AlertTitle>
                        - 카테고리 별 칭찬 많이 받은 사람 선정 후 포상  <strong>(카테고리 별 칭찬 많이 받은 사람이 여러 명 일 경우 , 여러명 동시 포상)</strong>  <br/>
                        - 칭찬카드 내용우수자 (잘 쓴 사람)에 대한 포상은 폐지 <br/>
                    </Alert>
                    </React.Fragment>


                </CardMedia>

                {/* Card Content */}
                <CardContent className={classes.cardContent}>
                    <Form/>
                </CardContent>
            </Card>
        </React.Fragment>
    );
}
