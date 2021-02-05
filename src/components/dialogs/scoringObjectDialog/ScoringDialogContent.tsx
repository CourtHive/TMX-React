import React from 'react';
import MuiDialogContent from '@material-ui/core/DialogContent';
import { useStylesScoringDialogContent } from 'components/dialogs/scoringObjectDialog/styles';

const ScoringDialogContent: React.FC = ({ children }) => {
  const classes = useStylesScoringDialogContent();
  return (
    <MuiDialogContent dividers className={classes.root}>
      {children}
    </MuiDialogContent>
  );
};

export default ScoringDialogContent;
