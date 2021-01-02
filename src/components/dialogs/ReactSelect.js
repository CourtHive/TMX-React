// https://github.com/JedWatson/react-select

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Select from 'react-select';

function getModalStyle({ width = 350, top = 50, left = 50 }) {
  return {
    width: `${width}px`,
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const styles = (theme) => ({
  paper: {
    position: 'absolute',
    // width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing.unit * 4,
    outline: 'none'
  }
});

class ListModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = { open: true };
  }

  state = {
    selectedOption: null
  };

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    if (this.props.callback && typeof this.props.callback === 'function') {
      this.props.callback({ selection: selectedOption });
    }
  };

  handleClose = () => {
    if (this.props.callback && typeof this.props.callback === 'function') {
      this.props.callback();
    }
  };

  render() {
    const { classes } = this.props;
    const style = getModalStyle({ width: this.props.width, top: this.props.top, left: this.props.left });
    const { selectedOption } = this.state;
    const options = this.props.options || [];
    const placeholder = this.props.placeholder || 'Select...';

    return (
      <div>
        <Modal open={true} onClose={this.handleClose}>
          <div style={style} className={classes.paper}>
            <Select
              defaultValue=""
              value={selectedOption}
              onChange={this.handleChange}
              options={options}
              menuIsOpen={true}
              isClearable={true}
              autoFocus={true}
              placeholder={placeholder}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

ListModal.propTypes = { classes: PropTypes.object.isRequired };

// We need an intermediary variable for handling the recursive nesting.
const ListModalWrapped = withStyles(styles)(ListModal);

export default ListModalWrapped;
