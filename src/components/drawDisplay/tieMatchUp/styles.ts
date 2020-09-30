import { makeStyles, Theme } from '@material-ui/core/styles';
import { TEXT_GREY } from 'theme/colors';

export const useStyles = makeStyles((theme: Theme) => ({
  // header
  headerPanel: {
    fontSize: 14,
    fontWeight: 500,
    '@media (max-width:800px)': {
      fontSize: 10
    }
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3)
  },
  standardPaperWithBorderTop: {
    borderTop: '2px solid black',
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    '@media (max-width:800px)': {
      padding: `${theme.spacing(2)}px 0`
    }
  },
  tieMatchUpContainer: {
    '@media (max-width:800px)': {
      padding: theme.spacing(1)
    }
  },
  resultContainer: {
    alignSelf: 'center'
  },
  resultTypography: {
    fontSize: 60,
    fontWeight: 500,
    width: '100%',
    '@media (max-width:800px)': {
      fontSize: 15
    }
  },
  tieTeamContainer: {
    height: '100%'
  },
  teamGridItem: {
    alignSelf: 'center',
    padding: theme.spacing(2),
    '@media (max-width:800px)': {
      padding: theme.spacing(0.5)
    }
  },
  teamLogo: {
    width: 50,
    '@media (max-width:800px)': {
      width: 25
    }
  },
  homeAway: {
    color: TEXT_GREY,
    fontSize: 14,
    fontWeight: 600
  },
  teamName: {
    fontSize: 24,
    fontWeight: 600,
    '@media (max-width:800px)': {
      fontSize: 10
    }
  },
  teamActionButton: {
    color: theme.palette.primary.main,
    '&:hover': {
      cursor: 'pointer'
    },
    '@media (max-width:800px)': {
      fontSize: 10
    }
  },
  // TieCollectionPanel
  collectionNameTypography: {
    fontSize: 20,
    fontWeight: 600,
    padding: `${theme.spacing(1)}px, 0`,
    textAlign: 'center',
    '@media (max-width:800px)': {
      fontSize: 11
    }
  },
  // TieCollectionItem
  collectionItemWrapper: {
    padding: `${theme.spacing(1)}px 0`
  },
  collectionItemGridWrapper: {
    alignSelf: 'center'
  },
  participantWrapper: {
    height: '100%'
  },
  participantEdit: {
    padding: `0 ${theme.spacing(2)}px`,
    width: 300,
    '@media (max-width:800px)': {
      width: 140
    }
  },
  participantEditDoubleBottom: {
    marginTop: 10
  },
  participantNameTypography: {
    fontSize: 14,
    '@media (max-width:800px)': {
      fontSize: 11
    }
  },
  participantEditTypography: {
    color: theme.palette.primary.main,
    fontSize: 13,
    '&:hover': {
      cursor: 'pointer'
    },
    '@media (max-width:800px)': {
      fontSize: 10
    },
    textAlign: 'left'
  },
  matchUpPointsDisplay: {
    alignSelf: 'center'
  },
  matchUpPointsDisplayTypography: {
    fontSize: 18,
    fontWeight: 600,
    '@media (max-width:800px)': {
      fontSize: 11
    }
  },
  tickIcon: {
    alignSelf: 'center',
    height: '20px',
    width: 'auto',
    '@media (max-width:800px)': {
      height: '11px',
      width: 'auto'
    }
  },
  rightMarginIconText: {
    marginRight: '15px',
    '@media (max-width:800px)': {
      marginRight: 0
    }
  },
  positionTypography: {
    fontSize: 14,
    textAlign: 'center',
    '@media (max-width:800px)': {
      fontSize: 10
    }
  },
  divider: {
    width: '100%'
  }
}));
