import * as React from 'react';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled, alpha } from '@mui/material/styles';
import CardMedia from '@mui/material/CardMedia';

import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Rating from '@mui/material/Rating';
import Grid from '@mui/material/Grid';
import moment from 'moment';
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
  const [expanded, setExpanded] = React.useState(true);
  const [posts, setPosts] = React.useState([]);
  const [quarterList, setQuarterList] = React.useState([]);

  React.useEffect(() => {
    const fetchPosts = async () => {
      axios.get('http://localhost:3001/getBestCardsQuery')
      .then(({data}) => {
        setPosts(data.lists)
      });
    }
    const fetchQuarter = async () => {
      axios.get('http://localhost:3001/getQuarterQuery')
      .then(({data}) => {
         setQuarterList(data.lists)
      });
    }
    fetchQuarter();
    fetchPosts();
   
 }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <CardMedia sx={{m:3, mb: 5, borderBottom: '1px solid #eee'}} >
        <Typography variant="h5" component="div" sx={{fontFamily:'NanumSquare', fontWeight: 'bold', mb: 3}}>
          우수칭찬카드
        </Typography>
      </CardMedia>

      {quarterList ? quarterList.map((quarters, key) => {
              return (
                <div>
                   <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>{quarters.quarter}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                      <CardContent sx={{  }}>
          <Grid container spacing={2}>
            {posts ? posts.map((el1, key) => {
            
            return (quarters.quarter == el1.BSET_QUARTER) ? (
              <Grid item xs={12} md={6}>
                <Card variant="outlined" key={el1.seq} >    
                  <CardHeader 
                    avatar={ <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe"> {el1.BSET_RECEIVER.substring(0,1)} </Avatar> } 
                    title={el1.BSET_RECEIVER}
                    subheader={el1.BSET_QUARTER + " 우수사원"}
                    sx={{width: '100%', fontFamily:'Nanum Gothic'}} />
                          <CardContent>
                          <Typography variant="body2" color="text.secondary">
                          </Typography>
                            <Typography variant="body2" color="text.secondary" >{el1.BSET_CONTENT} </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ) : null  } ) : null}
              </Grid>
            </CardContent>
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              )
              }) : null}
        
    </React.Fragment>
  );
}