import React from 'react';

import { Box, Typography } from '@material-ui/core';

interface NotFoundPageProps {
}

// TODO: implement proper page not found
const NotFoundPage: React.FC<NotFoundPageProps> = () => {
  return (
    <Box p={3} m={3} textAlign='center' bgcolor='background.paper'>
      <Typography variant="h3" component="h2" gutterBottom>
         Page not found!
      </Typography>
    </Box>
  );
};

export default NotFoundPage;