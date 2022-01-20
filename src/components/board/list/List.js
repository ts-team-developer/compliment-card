import * as React from 'react';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import CardContent from '@mui/material/CardContent';

import Grid from '@mui/material/Grid';
import AlimPopup from '../../modal/AlimPopup'
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import moment from 'moment';
import PraiseCard from './PraiseCard';
import {useLocation} from "react-router";
import Store, { NameContext } from '../../context/Store';

export default function List(props) {
  // 작성 중일 때 : quarter : thisQuarter, cards=1(내가쓴카드)
  // 추천 중일 때 : quarter : thisQuarter,  cards=안읽은 카드
  // 마감 : quarter : cardes : 안읽은 카드(5) 혹은 전체 카드
  const location = useLocation();
  const { userInfo, quarterInfo } = React.useContext(NameContext);

  const [searchForm, setSearchForm] = React.useState({ quarter : quarterInfo.QUARTER, cards : quarterInfo.ISCLOSED == 'N' ? '1' : '5' });
  const [result, setResult] = React.useState({error : true, message : '', open : false});

  const [posts, setPosts] = React.useState([]);
  const [quarterList, setQuarterList] = React.useState([]);
  
  // 추천 카드 CARD_CHECK
  
  React.useEffect(() => {
    const fetchPosts = async () => {
      if(searchForm.quarter == quarterInfo.QUARTER && quarterInfo.ISCLOSED == 'N' && searchForm.cards != '1') {
        setResult({ ...result, open : true, error :true, message : '작성 마감이 되면 해당 분기 카드를 조회할 수 있습니다.' , url : '' })
        setSearchForm({ ...searchForm, cards: '1', quarter : quarterInfo.QUARTER });
        return false;
      }

      axios.get('/api/getCardsIWriteQuery', {params: searchForm})
      .then(async ({data}) => {
        setPosts(data[0])
      });
    }

    const fetchQuarter = async () => {
      axios.get('/api/getQuarterQuery')
      .then(({data}) => {
        setQuarterList(data[0])
      });
    };

    fetchQuarter();
    fetchPosts();
 }, [searchForm]);


 const handleChange = (e) => {
  const { name, value } = e.target;
  setSearchForm({ ...searchForm, [name]: value });
 }

 const handleClose = () => { setResult({  ...result,  open : false }) }

 return (
  <React.Fragment>
    <CssBaseline />
      {/* 알림 모달창 띄우기 */}
      <AlimPopup open={result.open} handleClose={handleClose} msg={result.message} error={result.error}/>
      
      <CardContent>
        {/* 검색 조건 */}
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">분기</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" name="quarter" label="분기" value={searchForm.quarter}  size="small" onChange={handleChange}>
              {quarterList ? quarterList.map((el, key) => {
                return ( <MenuItem value={el.quarter}>{el.quarter}</MenuItem>  ) }) : null};
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-label">카드</InputLabel>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" name="cards" label="카드"  size="small" value={searchForm.cards}  
                  onChange={handleChange}>
                  <MenuItem value={5}>안 읽은 카드</MenuItem>
                  <MenuItem value={4}>추천카드</MenuItem>
                  <MenuItem value={3}>전체카드</MenuItem>
                  <MenuItem value={2}>받은카드</MenuItem>
                  <MenuItem value={1}>내가쓴카드</MenuItem>
                </Select>
          </FormControl>
      </CardContent>

      {/* 카드 리스트 시작 */}
      <CardContent>
        <Grid container spacing={3}>
          {posts ? posts.map((el, key) => {
          const praiseCard = {
            seq : el.SEQ, 
            receiver : el.RECEIVER, 
            sender : el.SENDER, 
            content : el.CONTENT,
            evaluation : el.EVALUATION, 
            sendDt : moment(el.SEND_DT).format('YYYY-MM-DD') + " " + el.SEND_TM,
            readDt : el.READ_DT === undefined ? '' : moment(el.READ_DT).format('YYYY-MM-DD') + " " + el.READ_TM
          }
          const isRecPeriodYn = (quarterInfo.ISRECCLOSED == 'N' && quarterInfo.ISCLOSED == 'Y' && el.SENDER != userInfo.email && quarterInfo.QUARTER == searchForm.quarter );
          return  ( <PraiseCard card = {praiseCard} searchForm={searchForm} isClosed = {quarterInfo.ISCLOSED} isRecPeriodYn={isRecPeriodYn} /> )  } ) : null}
        </Grid>
      </CardContent> 
    </React.Fragment>
  );
}