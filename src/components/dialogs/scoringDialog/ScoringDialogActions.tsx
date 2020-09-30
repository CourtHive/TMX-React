import React from 'react';

import MuiDialogActions from '@material-ui/core/DialogActions';

import { useStyleScoringDialogActions } from 'components/dialogs/scoringDialog/styles';

const ScoringDialogActions: React.FC = ({ children }) => {
  const classes = useStyleScoringDialogActions();

  return (
    <MuiDialogActions className={classes.root}>
      {children}
    </MuiDialogActions>
  );
};

export default ScoringDialogActions;