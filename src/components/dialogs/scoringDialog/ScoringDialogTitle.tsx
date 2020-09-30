import React from 'react';

import MuiDialogTitle from '@material-ui/core/DialogTitle';

import { useStylesScoringDialogTitle } from 'components/dialogs/scoringDialog/styles';

interface ScoringDialogTitleProps {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const ScoringDialogTitle = ((props: ScoringDialogTitleProps) => {
  const { children, onClose, ...other } = props;
  const classes = useStylesScoringDialogTitle();
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      {children}
    </MuiDialogTitle>
  );
});

export default ScoringDialogTitle;