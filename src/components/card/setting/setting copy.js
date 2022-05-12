import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {Card, CardContent} from '@mui/material';
import WorkerMain from './WorkerMain'
import MenuMain from './MenuMain'
import QuarterMain from './QuarterMain'

const menuList = [
  {
    name : '직원관리',
    url : '/view/list',
    value : 'worker'
  },
  {
    name : '메뉴관리',
    url : '/view/reg',
    value : 'menu'
  },
  {
    name : '분기관리',
    url : '/view/reg',
    value : 'quarter'
  }
];

const mainList = [
  <WorkerMain/>,<MenuMain/>,<QuarterMain/> 
]

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ToggleMenu() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const [alignment, setAlignment] = React.useState('worker');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <Card sx={{ bgcolor: 'background.paper', width: '100%' }}>
          <CardContent position="static"  variant="oulined" sx={{backgroudColor: '#fff'}}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
              sx={{ backgroudColor: '#fff', borderBottom: '1px solid #eee' }} >
          {menuList.map((menu, index) => (
            <Tab label={menu.name} {...a11yProps({index})}  sx={{fontFamily : 'NanumSquare', borderRight: '1px solid #eee',backgroudColor: '#fff' }}/>
          ))}
          </Tabs>
        </CardContent>
        <CardContent>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
          {menuList.map((menu, index) => (
            <TabPanel value={value}  index={index}>
              {mainList[index]}
            </TabPanel>
            ))}
          </SwipeableViews>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
