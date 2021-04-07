import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  actionsWrapper: {
    margin: 0,
    paddingLeft: 0,
    paddingRight: 0,
    width: 'auto',
    // backgroundColor: 'lightgray',
    borderRadius: 8
  },
  iconMargin: {
    marginRight: '.5em'
  },
  actionIcon: {
    marginTop: 5,
    height: '20px',
    // stroke: theme.palette.grey['50'],
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
      '& path': {
        stroke: theme.palette.primary.main
      }
    },
    '& path': {
      strokeWidth: 2
    }
  }
}));
