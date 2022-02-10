import * as React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material'

export default function GradeList(props) {
  return (
    <React.Fragment>
      <Grid item xs={12} md={12}>
        <Card variant="outlined" severity="success" key={props.seq} >    
          <CardContent>
            <Typography variant="subtitle1" sx={{fontFamily : 'NanumGothic', fontWeight : 'bold', float : 'left'}}>
             {props.list.BSET_RECEIVER}
            </Typography>
          </CardContent>
          
          <CardContent>
            <Typography variant="body2" color="text.secondary" sx={{fontFamily: 'NanumGothic'}}>
              {props.list.BSET_CONTENT.split('\n').map((line) => { return (<p>{line}</p>)  })  } 
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </React.Fragment> )
}