import * as React from 'react';
import axios from 'axios';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

import GradeList from './GradeList'

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
      axios.get('/api/card/bestcard')
      .then(({data}) => {
        setPosts(data[0])
      });
    }
    const fetchQuarter = async () => {
      axios.get('/api/quarter/list')
      .then(({data}) => {
         setQuarterList(data[0])
      });
    }
    fetchQuarter();
    fetchPosts();
 }, []);

  return (
    <React.Fragment>
        {quarterList && quarterList.map((quarters, key) => {
            return (
                <React.Fragment>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header"  >
                            <Typography sx={{fontFamily: 'NanumSquare'}}>{quarters.quarter} 우수사원</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <CardContent>
                                    <Grid container spacing={2}>
                                    {posts && posts.map((el1, key) => {
                                        return (quarters.quarter == el1.BSET_QUARTER) ?
                                            <GradeList list = {el1}/>  : null  } ) }
                                    </Grid>
                                </CardContent>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </React.Fragment> )
              })}
    </React.Fragment>
  );
}