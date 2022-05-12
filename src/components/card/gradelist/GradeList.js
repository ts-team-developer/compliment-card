import * as React from 'react';
import { Card, CardContent, Typography, Grid, Chip, CardHeader, Avatar } from '@mui/material'
import { red } from '@mui/material/colors';
import { usePcStyles, useMobileStyles } from "../../../styles/styles"
import { useMediaQuery } from "@material-ui/core";

export default function GradeList(props) {
  // Style 관련 CSS
  const isMobile = useMediaQuery("(max-width: 600px)");
  const classes = usePcStyles();
  const mobile = useMobileStyles();
  return (
    <React.Fragment>
      <Grid item xs={12} md={12}>
        <Card variant="outlined" severity="success" key={props.seq} className={classes.p0} >    
        <CardHeader  avatar={  <Avatar sx={{ bgcolor: red[500], fontSize : '1rem' }} aria-label="recipe"> 열정 </Avatar> }
             title={props.list.BSET_RECEIVER} 
             subheader={props.list.BSET_QUARTER}
        />
        <CardContent>
            <Typography variant="body2" color="text.secondary">
              {props.list.BSET_CONTENT.split('\n').map((line) => { return (<p>{line}</p>)  })  } 
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </React.Fragment> )
}