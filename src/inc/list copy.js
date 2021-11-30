import * as React from 'react';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { styled, alpha } from '@mui/material/styles';
import CardMedia from '@mui/material/CardMedia';

import Paper from '@mui/material/Paper';
import Autocomplete from '@mui/material/Autocomplete';
import CardActions from '@mui/material/CardActions';
import MenuItem from '@mui/material/MenuItem';
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
const currencies = [
    {
      value: 'USD',
      label: '$',
    },
    {
      value: 'EUR',
      label: '€',
    },
    {
      value: 'BTC',
      label: '฿',
    },
    {
      value: 'JPY',
      label: '¥',
    },
  ];
const top100Films = [
    { label: '남기욱', id : 'ahakuki' },
    { label: '전성진', id : 'sjJeon' },
    { label: '최석환', id: 'choish' },
    { label: '장혜진', id: 'jang314' },
    { label: '이수진', id: 'sjlee' },
    { label: "민경철", id: 'kmin1145' },
    { label: '김현송', id: 'hskim' },
    { label: '이문혁', id: 'leemh' }
  ];

  
  const card = (
    <React.Fragment>
      <CardMedia sx={{m:3, borderBottom: '1px solid #eee' }} >
        <Typography variant="h5" component="div" sx={{fontFamily:'NanumSquare', fontWeight: 'bold'}}>
          평가방법 
        </Typography>
        
        <Typography variant="body2" sx={{ mt : 4, mb: 4 , fontFamily:'NanumSquare'}}>
          평가는 5점 척도입니다. 좋은 미담 사례를 위조로 높은 평가 부탁드립니다. 평가점수의 합이 높은 10개의 칭찬카드를 분기 모임 시 현장 투표 진행합니다. <br/>
          칭찬하는 내용이 이해가 가지 않거나 성이가 없다고 생각하시면 5점 척도레서 가장 낮는 쪽의 점수를 선택해주세요. <br/>
          본인이 작성한 카드는 본인을 제외한 전 직원이 5점 척도로 평가하여 본인에게만 피드백을 드릴테니, 다음 칭찬카드 작성 시에 분발해주세요. <br/>
          시험적으로 5점 척도를 사용합니다. 더 좋은 방안을 찾는 중이니 성실하게 평가해 주십시오.
        </Typography>
      </CardMedia>
      <CardContent>
      <Box
      component="form"
      noValidate
      autoComplete="off"
      sx={{mb : -2 }}
      >
        
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={top100Films}
      sx={{ m :2 , ml:0,  width: '20%', display: 'inline-block'}}
      renderInput={(params) => <TextField {...params} label="점수" />}
      size="small"
    />
        <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={top100Films}
      sx={{ m :2, ml: -1, width: '20%', display: 'inline-block'}}
      renderInput={(params) => <TextField {...params} label="2021년 1분기" />}
      size="small"
    />
         <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={top100Films}
      sx={{ m :2 , ml: -1, width: '20%', display: 'inline-block'}}
      renderInput={(params) => <TextField {...params} label="전체카드" />}
      size="small"
    />
     <Typography variant="body2" sx={{display: 'inline-block', verticalAlign:'middle', mt:1.5, ml:-1 }}>
     <Button size="large" variant="outlined">조회</Button>  
         </Typography>
 
        
    </Box>
      </CardContent>
    
   
    </React.Fragment>
  );
  
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
export default function FixedContainer() {
    const [expanded, setExpanded] = React.useState(false);
    const [value, setValue] = React.useState(2);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

    
 const state= {
  loading: false,
  itemList : []
};

  const handleClose = () => {
    setAnchorEl(null);
  };

  const loadItem = async () => {
    axios.get('http://localhost:3001/selectbody')
    .then(({data}) => {
      this.setState({
        loading : true,
        itemList: data.test
      })
    })
  }

  function test() {
    return '<div>test</div>'
  }


 

  return (
    <React.Fragment>
      <CssBaseline />
              {card} 
            <CardContent sx={{ fontFamily:'NanumSquare'  }}>
           
            <Stack direction="row" justifyContent="center" spacing={1} color="inherit" sx={{ width: '100%', mt:3 }}>
          
    <Card variant="outlined"  sx={{width: '30%'}}>    
            <CardHeader
                avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    TS
                </Avatar>
                } 
                action={
                <IconButton aria-label="settings">
                    <MoreVertIcon />
                </IconButton>
                }
                title="전성진"
                subheader="2021/07/19, 16:03:40"
            />
     
      <CardContent>
      <Collapse in={expanded} timeout="auto" >
      <Typography variant="body2" color="text.secondary">
         전성진 과장님을 칭찬합니다. <br/><br/>
         언제나 유지보수에 힘써주시고, 잘못된게 있으면 따끔하게 지적해주시며
         <br/>
         도움이 되는 것을 알려주시고 모르는 것을 물어보며 친절하게 답해주십니다.
         <br/>
         그런 전성진 과장님을 칭찬합니다.
        </Typography>
          </Collapse>
        
      </CardContent>
      <CardActions disableSpacing>
      <Rating
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
      
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
     
    </Card>

    <Card variant="outlined"   sx={{width: '30%'}}>    
            <CardHeader
                avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    TS
                </Avatar>
                } 
                action={
                <IconButton aria-label="settings">
                    <MoreVertIcon />
                </IconButton>
                }
                title="전성진"
                subheader="2021/07/19, 16:03:40"
            />
   
      <CardContent>
      <Collapse in={expanded} timeout="auto" >
      <Typography variant="body2" color="text.secondary">
         전성진 과장님을 칭찬합니다. <br/><br/>
         언제나 유지보수에 힘써주시고, 잘못된게 있으면 따끔하게 지적해주시며
         <br/>
         도움이 되는 것을 알려주시고 모르는 것을 물어보며 친절하게 답해주십니다.
         <br/>
         그런 전성진 과장님을 칭찬합니다.
        </Typography>
          </Collapse>
        
      </CardContent>
      <CardActions disableSpacing>
      <Rating
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
      
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
     
    </Card>
    
            </Stack>      
    </CardContent>
    </React.Fragment>
  );
}