import { makeStyles, Theme } from '@material-ui/core/styles';
import { TEXT_GREY } from 'theme/colors';

export const useStylesMatchUpOutcomeDialog = makeStyles((theme: Theme) => ({
  root: {
    padding: '15px 10px',
    width: '400px'
  },
  rootXS: {
    padding: '15px 10px'
  },
  subheaderContainer: {
    // borderBottom: `2px solid ${TEXT_MAIN}`
  },
  outcomeTitle: {
    margin: 0,
    padding: 0
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    fontStretch: 'normal',
    fontStyle: 'normal',
    height: '24px',
    lineHeight: 1.2,
    marginBottom: '10px'
  },
  roundNameTypography: {
    height: '35px',
    fontWeight: 700,
    fontSize: 13
    // padding: '10px 0'
  },
  subheaderSets: {
    color: TEXT_GREY,
    height: '35px',
    fontWeight: 700,
    fontSize: 11,
    padding: '10px 0',
    textAlign: 'center'
  },
  actionWrapper: {
    padding: '0px 0'
  },
  matchParticipantsWrapper: {
    padding: '10px 0'
  },
  actionButton: {
    width: '100%'
  },
  matchFormatTypography: {
    fontSize: 13,
    fontWeight: 700,
    height: '18px',
    lineHeight: 1.4
  },
  matchUpFormatTypography: {
    color: theme.palette.primary.main,
    fontSize: 13,
    // textDecoration: 'underline',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  editFormatDialogContentWrapper: {
    paddingBottom: '10px'
  },
  editFormatDialogActionsWrapper: {
    paddingTop: '10px'
  }
}));

export const useStylesScoringDialogTitle = makeStyles(() => ({
  root: {
    margin: 0,
    padding: 0
  }
}));

export const useStylesScoringDialogContent = makeStyles(() => ({
  root: {
    padding: 0,
    overflow: 'hidden'
  }
}));

export const useStylesMatchParticipant = makeStyles((theme: Theme) => ({
  matchParticipantWrapper: {
    height: '84px',
    padding: '10px 0'
  },
  setResultInputField: {
    '& input': {
      height: '27px',
      textAlign: 'center'
    }
  },
  setResultTypography: {
    fontSize: 20,
    padding: '20px 22px'
  },
  setResultTypographyXS: {
    padding: '10px 12px'
  },
  moreHorizontalIcon: {
    color: theme.palette.grey['50']
  },
  moreHorizontalIconDisabled: {
    color: TEXT_GREY,
    '&:hover': {
      cursor: 'default'
    }
  },
  moreHorizontalIconWrapper: {
    padding: '15px',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  moreHorizontalIconWrapperXS: {
    '&:hover': {
      cursor: 'pointer'
    }
  },
  statusPopoverContent: {
    padding: theme.spacing(2)
  },
  participantTypographySingle: {
    lineHeight: '64px'
  },
  participantTypographyDouble: {
    lineHeight: '32px'
  },
  participantTypographyFont: {
    fontSize: 14
  },
  participantTypographyFontXS: {
    fontSize: 11
  },
  participantLastName: {
    textTransform: 'uppercase'
  },
  tiebreakSuperscript: {
    position: 'absolute',
    marginLeft: '32px',
    marginTop: '15px',
    fontSize: 13
  },
  tiebreakSuperscriptXS: {
    position: 'absolute',
    marginLeft: '20px',
    marginTop: '4px',
    fontSize: 11
  },
  textualStatus: {
    color: theme.palette.error.main
  }
}));

export const useStyleScoringDialogActions = makeStyles(() => ({
  root: {
    margin: 0,
    padding: 0
  }
}));

export const useStyleStatusDialog = makeStyles(() => ({
  root: {
    padding: '15px 10px',
    width: '460px'
  },
  rootXS: {
    padding: '15px 10px',
    width: '315px'
  },
  contentWrapper: {
    padding: '20px 0'
  },
  selector: {
    marginBottom: '20px'
  },
  actionsWrapper: {
    paddingTop: '10px'
  }
}));
