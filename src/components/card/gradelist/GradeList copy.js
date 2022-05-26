import * as React from 'react';
import { Card, CardContent, Typography, Grid, Chip, CardHeader, Avatar } from '@mui/material'
import { red } from '@mui/material/colors';
import { usePcStyles, useMobileStyles } from "../../../styles/styles"
import { useMediaQuery } from "@material-ui/core";
import { deepOrange, deepPurple,green, pink } from '@mui/material/colors';

export default function GradeList(props) {
  // Style 관련 CSS
  const isMobile = useMediaQuery("(max-width: 600px)");
  const classes = usePcStyles();
  const mobile = useMobileStyles();
  let color = null;

  if(props.list.CATEGORY == '긍정') {
      color = pink[500] ;
  }else if(props.list.CATEGORY == '열정') {
      color = deepPurple[500];
  } else if(props.list.CATEGORY == '창의') {
      color = deepOrange[500]
  } else if(props.list.CATEGORY == '약속') {
      color = green[500];
  }

  return (
    <React.Fragment>
      <Grid item xs={12} md={3}>
        <Card variant="outlined" severity="success" key={props.seq} className={classes.p0} >    
        <CardHeader  avatar={  <Avatar sx={{ bgcolor: color, fontSize : '1rem' }} aria-label="recipe"> {props.list.CATEGORY ? props.list.CATEGORY : '-'} </Avatar> }
             title={props.list.BEST_RECEIVER} 
             subheader={props.list.BEST_QUARTER} />
        <CardContent>
            <Typography variant="body2" color="text.secondary">
              {props.list.BEST_CONTENT.split('\n').map((line) => { return (<p>{line}</p>)  })  } 
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </React.Fragment> )
}