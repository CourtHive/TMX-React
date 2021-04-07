import { makeStyles } from '@material-ui/core';
import { red } from '@material-ui/core/colors';

export const useHomePageStyles = makeStyles((theme) => ({
  root: {},
  addNewsItem: {
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(2)
  }
}));

export const cardStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto'
  },
  card: {
    margin: 'auto',
    transition: '0.3s',
    boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
    '&:hover': {
      boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)'
    },
    // textOverflow: 'visible',
    overflow: 'visible'
  },
  cover: {
    width: 151
  },
  media: {
    paddingTop: '56.25%'
  },
  /*
  content: {
    textAlign: "left",
    padding: theme.spacing(3)
  },
  */
  divider: {
    margin: `${theme.spacing(3)}px 0`
  },
  heading: {
    fontWeight: 'bold'
  },
  subheading: {
    lineHeight: 1.8
  },
  avatar: {
    display: 'inline-block',
    border: '2px solid white',
    '&:not(:first-of-type)': {
      marginLeft: -theme.spacing(1)
    }
  }
}));

export const expandingStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  card: {
    margin: 'auto',
    transition: '0.3s',
    boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
    '&:hover': {
      boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)'
    },
    // textOverflow: 'visible',
    overflow: 'visible',
    marginBottom: '2em'
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    backgroundColor: red[500]
  }
}));
