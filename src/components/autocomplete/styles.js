import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  autocompleteInput: {
    backgroundColor: theme.palette.background.paper,
    // border: '1px solid #ced4da',
    borderRadius: 2,
    fontSize: 14,
    height: '32px',
    position: 'relative',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '& div': {
      height: '32px'
    },
    '& > div': {
      padding: '0 10px!important'
    },
    '& > div > fieldset': {
      border: 'none'
    },
    '& input': {
      height: '22px!important',
      padding: '5px!important',
      width: '100%!important'
    },
    '&:focus': {
      borderRadius: 2,
      backgroundColor: theme.palette.background.paper
    }
  }
}));
