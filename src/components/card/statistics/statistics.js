import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import StaticYear from  './static-year';
import StaticPoint from  './static-point';
import StaticPeople from  './static-people';
import {Card, CardContent, CardMedia, Box, Tab, Tabs, Typography, Link, Breadcrumbs } from '@mui/material';
import { usePcStyles, useMobileStyles } from "../../../styles/styles"
import { useMediaQuery } from "@material-ui/core";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
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
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}
export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  // Style 관련 CSS
  const isMobile = useMediaQuery("(max-width: 600px)");
  const classes = usePcStyles();
  const mobile = useMobileStyles();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <React.Fragment>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <StaticYear/>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <StaticPeople/>
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <StaticPoint/>
          </TabPanel>
        </SwipeableViews>
      </React.Fragment>
  );
}