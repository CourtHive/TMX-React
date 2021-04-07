import React, { useState } from 'react';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { ScoreEntry } from 'containers/userTesting/ScoreEntry/ScoreEntry';

import { useStyles } from './style';

const UserTestsPage = () => {
  const classes = useStyles();
  const userTestingTab = 'userTestingTab';
  const selectedUserTestingTab = parseInt(localStorage.getItem(userTestingTab)) || 0;
  const [value, setValue] = useState(selectedUserTestingTab);

  const handleChange = (event, newValue) => {
    localStorage.setItem(userTestingTab, newValue.toString());
    setValue(newValue);
  };

  return (
    <>
      <Tabs
        className={classes.tabbar}
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
      >
        <Tab className={classes.tab} id="ut-score-entry-tab" label="Score Entry" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <ScoreEntry />
      </TabPanel>
    </>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
};

export default UserTestsPage;
