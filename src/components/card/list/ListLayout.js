import React, { Component } from 'react';
import { Card,Typography, CardContent, CardMedia } from '@mui/material'
import  { List } from "../index";
import { usePcStyles, useMobileStyles } from "../../../styles/styles"
import { useMediaQuery } from "@material-ui/core";

export default function ListLayout() {
  // Style 관련 CSS
  const isMobile = useMediaQuery("(max-width: 600px)");
  const classes = usePcStyles();
  const mobile = useMobileStyles();

  return (
          <React.Fragment>
            <Card variant="outlined" className={isMobile ? mobile.card : classes.card}>
                {/* Card Header */}
                <CardMedia className={isMobile ? mobile.cardTop : classes.cardTop}>
                        <Typography variant="h5" component="div" className={classes.title} >
                          <b>평가방법</b>
                        </Typography>

                        <Typography variant="subtitle2" className={classes.descriptions}>
                            창의 / 긍정 / 열정 / 약속 별 칭찬 많이 받은 사람 선정 후 포상
                        </Typography>

                        <Typography variant="subtitle2" className={classes.descriptions}>
                            카테고리 별 칭찬 많이 받은 사람이 여러 명 일 경우 , 여러명 동시 포상
                        </Typography>
{/* 받은 카드 수이므로 평가 제외
                        <Typography variant="subtitle2" className={classes.descriptions}>
                            평가 점수의 합이 높은 10개의 칭찬카드를 분기 모임 시 현장 투표 진행합니다. <br/>
                        </Typography>

                        <Typography variant="subtitle2" className={classes.descriptions}>
                            칭찬하는 내용이 이해가 가지 않거나 성의가 없다고 생각하시면 5점 척도에서 가장 낮은 쪽의 점수를 선택해주세요. <br/>
                        </Typography>

                        <Typography variant="subtitle2" className={classes.descriptions}>
                            본인이 작성한 카드는 본인을 제외한 전 직원이 오점 척도로 평가하여 본인에게만 피드백을 드릴테니, 다른 칭찬카드 작성 시에 분발해주세요. <br/>
                        </Typography>
                        */}

                    </CardMedia>

                    {/* Card Content */}
                    <CardContent className={classes.cardContent}>
                        <List  />
                    </CardContent>
                </Card>
            </React.Fragment>
  );
}
