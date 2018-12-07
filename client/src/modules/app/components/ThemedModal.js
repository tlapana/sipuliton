import React from 'react';
import { Modal } from 'reactstrap';

/*
  A themed reactstrap modal. Just wraps a regular modal.
*/

class ThemedModal extends React.Component {

  render() {

    const { 
      className, theme, isLoading, isRounding, 
      changeTheme, changeLoading, changeRounding, ...other 
    } = this.props;

    let classes = '';
    if (theme) {
      classes += theme;
    }
    if (isRounding) {
      classes += ' rounded';
    }
    if (className) {
      classes += ' ' + className;
    }

    return (
        <Modal {...other} className={classes} />
    );
  }
}

export default ThemedModal;
