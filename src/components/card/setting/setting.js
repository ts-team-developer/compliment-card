import React, { Component } from 'react';
import { Card, CardContent, CardMedia, Typography,Tabs,Tab, Box } from '@mui/material'
import { usePcStyles, useMobileStyles } from "../../../styles/styles"
import { useMediaQuery } from "@material-ui/core";
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import WorkerMain from './WorkerMain'
import MenuMain from './MenuMain'
import QuarterMain from './QuarterMain'

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

export default function FormLayout () {
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
            <Card variant="outlined" className={isMobile ? mobile.card : classes.card}  >
                {/* Card Header */}
                <CardMedia sx={{padding: '10px'}}>
                    <Typography variant="h5" component="div"  className={classes.title} >
                       <b>관리</b> 
                    </Typography>
                    
                </CardMedia>
                <CardContent>
                    <Tabs value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        aria-label="full width tabs example" >
                        <Tab label="직원관리" {...a11yProps(0)}  />
                        <Tab label="메뉴관리" {...a11yProps(1)} />
                        <Tab label="분기관리" {...a11yProps(2)} />
                    </Tabs>
                </CardContent>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={value}
                    onChangeIndex={handleChangeIndex} >
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <WorkerMain/>
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <MenuMain/>
                    </TabPanel>
                    <TabPanel value={value} index={2} dir={theme.direction}>
                        <QuarterMain />
                    </TabPanel>
                    </SwipeableViews>
            </Card>
        </React.Fragment>
    );
}