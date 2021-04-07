import React from 'react';

import { Box, Typography } from '@material-ui/core';

const NotFoundPage = () => {
  return (
    <Box p={3} m={3} textAlign="center" bgcolor="background.paper">
      <Typography variant="h3" component="h2" gutterBottom>
        Page not found!
      </Typography>
    </Box>
  );
};

export default NotFoundPage;
