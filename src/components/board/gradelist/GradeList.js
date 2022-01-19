import * as React from 'react';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled, alpha } from '@mui/material/styles';

import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));


const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem', fontFamily: 'NanumSquare' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function FixedContainer() {
  const [posts, setPosts] = React.useState([]);
  const [quarterList, setQuarterList] = React.useState([]);

  React.useEffect(() => {
    const fetchPosts = async () => {
      axios.get('/api/getBestCardsQuery')
      .then(({data}) => {
        setPosts(data[0])
      });
    }
    const fetchQuarter = async () => {
      axios.get('/api/getQuarterQuery')
      .then(({data}) => {
         setQuarterList(data[0])
      });
    }
    fetchQuarter();
    fetchPosts();
 }, []);

  return (
    <React.Fragment>
      <CssBaseline />
        {quarterList ? quarterList.map((quarters, key) => {
            return (
              <React.Fragment>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header"  >
                    <Typography sx={{fontFamily: 'NanumSquare'}}>{quarters.quarter}</Typography>
                  </AccordionSummary>
                  
                  <AccordionDetails>
                    <Typography>
                      <CardContent sx={{  }}>
                        <Grid container spacing={2}>
                          {posts ? posts.map((el1, key) => {
                            return (quarters.quarter == el1.BSET_QUARTER) ? (
                              <Grid item xs={12} md={6}>
                                <Card variant="outlined" key={el1.seq} >    
                                  <CardHeader  avatar={ <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe"> {el1.BSET_RECEIVER.substring(0,1)} </Avatar> } 
                                    title={el1.BSET_RECEIVER}
                                    subheader={el1.BSET_QUARTER + " 우수사원"}
                                    sx={{width: '100%', fontFamily:'Nanum Gothic'}} />
                                          <CardContent>
                                            <Typography variant="body2" color="text.secondary" sx={{fontFamily: 'NanumGothic'}}>{el1.BSET_CONTENT} </Typography>
                                          </CardContent>
                                      </Card>
                                    </Grid> ) : null  } ) : null}
                          </Grid>
                        </CardContent>
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </React.Fragment>
              )
              }) : null}
    </React.Fragment>
  );
}