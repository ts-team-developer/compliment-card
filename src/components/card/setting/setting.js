import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
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
  const [alignment, setAlignment] = React.useState('worker');

  const handleChange = (event, newAlignment) => {
    if (newAlignment != null) setAlignment(newAlignment);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        sx={{ ml : 6}}
      >
        {menuList.map((menu, index) => (
            <ToggleButton value={menu.value}>{menu.name}</ToggleButton>
        ))}
      </ToggleButtonGroup>
      {menuList.map((menu, index) => (
        <TabPanel value={alignment} index={menu.value}>
          {mainList[index]}
        </TabPanel>
      ))}
    </Box>
  );
}
