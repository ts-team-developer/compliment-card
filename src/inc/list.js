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
import { useHistory } from "react-router-dom";

import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Rating from '@mui/material/Rating';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Menu from '@mui/material/Menu';
import Grid from '@mui/material/Grid';

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import moment from 'moment';

const age = [];
const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const card = (
    <React.Fragment>
      <CardMedia sx={{m:3, borderBottom: '1px solid #eee'}} >
        <Typography variant="h5" component="div" sx={{fontFamily:'NanumSquare', fontWeight: 'bold'}}>
          평가방법 
        </Typography>
        
        <Typography variant="body2" sx={{ mt : 4, mb: 4, fontFamily:'NanumSquare' }}>
          평가는 5점 척도입니다. 좋은 미담 사례를 위조로 높은 평가 부탁드립니다. 평가점수의 합이 높은 10개의 칭찬카드를 분기 모임 시 현장 투표 진행합니다. <br/>
          칭찬하는 내용이 이해가 가지 않거나 성의가 없다고 생각하시면 5점 척도레서 가장 낮는 쪽의 점수를 선택해주세요. <br/>
          본인이 작성한 카드는 본인을 제외한 전 직원이 5점 척도로 평가하여 본인에게만 피드백을 드릴테니, 다음 칭찬카드 작성 시에 분발해주세요. <br/>
          시험적으로 5점 척도를 사용합니다. 더 좋은 방안을 찾는 중이니 성실하게 평가해 주십시오.
        </Typography>
      </CardMedia>
   
    </React.Fragment>
  );



export default function FixedContainer() {
  const [expanded, setExpanded] = React.useState(true);
  const [posts, setPosts] = React.useState([]);
  const [quarterList, setQuarterList] = React.useState([]);
  const [score, setScore] = React.useState(5);
  const [quarter, setQuarter] = React.useState(0);
  const [cards, setCards] = React.useState(5);
  const [isClosed, setIsClosed] = React.useState(false);
  const [isRecClosed, setIsRecClosed] = React.useState(false);
  const [targetSeq, setTargetSeq] = React.useState(0);

  // 추천 카드 CARD_CHECK
  const [check, setChecks] = React.useState(0);

  React.useEffect(() => {
    const fetchPosts = async () => {
      axios.get('http://localhost:3001/getCardsIWriteQuery')
      .then(({data}) => {
        setPosts(data.lists)
      });
    }

    const fetchQuarter = async () => {
      axios.get('http://localhost:3001/getQuarterQuery')
      .then(({data}) => {
        setQuarterList(data.lists)
        setQuarter(data.lists[0].quarter)
      });
    };

    const fetchIsRecClose = async () => {
      axios.get('http://localhost:3001/getIsClosedQuery')
      .then(({data}) => {
        setIsRecClosed(data.lists[0].isRecClosed);
      });
    }
    fetchQuarter();
    fetchPosts();
    fetchIsRecClose();
 }, []);

const history = useHistory();
const [anchorEl, setAnchorEl] = React.useState(null);
const open = Boolean(anchorEl);
const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
};
const handleClose = () => {
  setAnchorEl(null);
};
  return (
    <React.Fragment>
      <CssBaseline />
        {card}
        <CardContent>
      
      <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">점수</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={score} label="점수" size="small" onChange={(e) => { setScore(e.target.value) }}>
              <MenuItem value={5}>5점</MenuItem>
              <MenuItem value={4}>4점</MenuItem>
              <MenuItem value={3}>3점</MenuItem>
              <MenuItem value={2}>2점</MenuItem>
              <MenuItem value={1}>1점</MenuItem>
            </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">분기</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={quarter} label="분기"  size="small" onChange={(e) => { setQuarter(e.target.value) }}>
            <MenuItem value={0}>전체보기</MenuItem>
            {quarterList ? quarterList.map((el, key) => {
              return (
              <MenuItem value={el.quarter}>{el.quarter}</MenuItem>
              )
              }) : null};
              
         
            </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">카드</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={cards} label="카드"  size="small"  onChange={(e) => { setCards(e.target.value) }}>
              <MenuItem value={5}>안 읽은 카드</MenuItem>
              <MenuItem value={4}>추천카드</MenuItem>
              <MenuItem value={3}>전체카드</MenuItem>
              <MenuItem value={3}>받은카드</MenuItem>
            </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Typography variant="body2" sx={{display: 'inline-block', verticalAlign:'middle'}}>
              <Button size="large" variant="outlined">조회</Button>  
          </Typography>
      </FormControl>
  </div>
          
      </CardContent>
        <CardContent sx={{  }}>
        <Grid container spacing={2}>
          {posts ? posts.map((el, key) => {
              
          const ExpandMore = styled((props) => {
          const { expand, ...other } = props;
            return <IconButton {...other} />;
          })(({ theme, expand }) => ({
            transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
          }),
        })); 
        
        const handleExpandClick = () => {
          setExpanded(!expanded);
        };
            
        return  (
          <Grid item xs={12} md={4}>
            <Card variant="outlined" >    
              <CardHeader 
                avatar={ <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe"> {el.SEQ} </Avatar> } 
                action={
                <div>
                <IconButton 
                    aria-label="settings"
                    id="demo-customized-button"
                    aria-controls="demo-customized-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    variant="contained"
                    disableElevation
                    onClick={(e) => {
                      setTargetSeq(el.SEQ)
                      handleClick(e)
                    }}
                    endIcon={<KeyboardArrowDownIcon />} 
                    >
                    <MoreVertIcon />
                </IconButton> 
                <StyledMenu
                  id="demo-customized-menu"
                  MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                    'seq' : el.seq
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose} >
                  <MenuItem value={el.SEQ} onClick={(e) => {
                    axios.get('http://localhost:3001/getCardsDetailQuery', {params: {seq : targetSeq}})
                    .then(({data}) => {
                      history.push({
                        pathname : '/form',
                        state : {forms : data.lists}
                      })
                    });
                  
                  }} disableRipple>
          <EditIcon />
          편집
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
        <DeleteIcon />
          삭제
        </MenuItem>
      </StyledMenu>
                </div>
                }
                title={el.RECEIVER}
                subheader={moment(el.SEND_DT).format('YYYY-MM-DD') + " " + el.SEND_TM}
                sx={{width: '100%', fontFamily:'Nanum Gothic'}} />
                      <CardContent>
                      <Typography variant="body2" color="text.secondary">
                      {!expanded ? el.CONTENT.substring(0, 10) + "..." : null} 
                      </Typography>
                      <Collapse in={expanded} timeout="auto" sx={{width: '100%'}} >
                         <Typography variant="body2" color="text.secondary" > { el.CONTENT} </Typography>
                      </Collapse>
                    </CardContent>
                    <CardActions disableSpacing>
                      {isRecClosed == 'N' ?
                      <Rating name="size-small" defaultValue={el.EVALUATION} size="medium" onChange={(e) => {  
                        axios.post('http://localhost:3001/doCardCheckTable', {'seq' : el.SEQ, 'evaluation' : e.target.value}).then(function (res) {
                          if(res.status == 200) {

                          } else {

                          }
                        }).catch(function (res, status, err) {
                        });
                      }}/>
                      : null}
                      <ExpandMore aria-label="show more" expanded={!expanded}  name={el.seq} onClick={(e) => {  handleExpandClick(expanded) } } ><ExpandMoreIcon /> </ExpandMore>
                    </CardActions>
                  </Card>
                </Grid>
              )  } ) : null}
              </Grid>
    </CardContent>
    </React.Fragment>
  );
}