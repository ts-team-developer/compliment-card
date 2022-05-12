import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import StaticYear from  './static-year';
import StaticPoint from  './static-point';
import StaticPeople from  './static-people';

export default function LabTabs() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginLeft : '25px' , marginTop : '-50px'}}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="년도별 통계" value="1" />
            <Tab label="직원별 통계" value="2" />
            <Tab label="점수별 통계" value="3" />
          </TabList>
        </Box>
        <TabPanel sx={{ padding : '0px' }} value="1">
          <StaticYear/>
        </TabPanel>
        <TabPanel sx={{ padding : '0px' }} value="2">
          <StaticPeople/>
        </TabPanel>
        <TabPanel sx={{ padding : '0px' }} value="3">
          <StaticPoint/>
        </TabPanel>
      </TabContext>
    </Box>
  );
}