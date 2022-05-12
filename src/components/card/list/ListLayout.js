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
                            평가는 5점 척도입니다. 좋은 미담 사례를 위주로 높은 평가 부탁드립니다. 
                        </Typography>

                        <Typography variant="subtitle2" className={classes.descriptions}>
                            평가 점수의 합이 높은 10개의 칭찬카드를 분기 모임 시 현장 투표 진행합니다. <br/>
                        </Typography>

                        <Typography variant="subtitle2" className={classes.descriptions}>
                            칭찬하는 내용이 이해가 가지 않거나 성의가 없다고 생각하시면 5점 척도에서 가장 낮은 쪽의 점수를 선택해주세요. <br/>
                        </Typography>

                        <Typography variant="subtitle2" className={classes.descriptions}>
                            본인이 작성한 카드는 본인을 제외한 전 직원이 오점 척도로 평가하여 본인에게만 피드백을 드릴테니, 다른 칭찬카드 작성 시에 분발해주세요. <br/>
                        </Typography>

                        <Typography variant="subtitle2" className={classes.descriptions}>
                            시험적으로 5점 척도를 사용합니다. 더 좋은 방안을 찾는 중이니 성실하게 평가해주십시오.<br/>
                        </Typography>
                    </CardMedia>

                    {/* Card Content */}
                    <CardContent className={classes.cardContent}>
                        <List  />    
                    </CardContent>
                </Card>
            </React.Fragment>
  );
}
