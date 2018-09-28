import React from 'react';
import PropTypes from 'prop-types';

export default class EditInPlaceText extends React.Component {
  static propTypes = {
    ignoreBlanks: PropTypes.bool,
    isEditable: PropTypes.bool,
    editor: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onDone: PropTypes.func.isRequired,
  }

  static defaultProps = {
    ignoreBlanks: false,
    isEditable: true,
    placeholder: '',
    value: '',
  }
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    };
    this.inputRef = React.createRef();
    const self = this;
    this.componentDidUpdate = (prevProps, prevState) => {
      if (self.state.editing && !prevState.editing) {
        self.inputRef.current.focus();
      }
    };
  }

  startEditing = () => {
    if (this.props.isEditable) {
      this.setState({ editing: true });
    }
  }

  stopEditing = () => {
    const newValue = this.inputRef.current.value;
    const ignorableBlank = this.props.ignoreBlanks && this.props.value === '';
    if (!ignorableBlank && newValue !== this.props.value) {
      this.props.onDone(newValue);
    }
    this.setState({ editing: false });
  }

  keyDown = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      this.stopEditing();
    } else if (event.keyCode === 27) {
      this.setState({ editing: false });
    }
  }

  renderNormal = () => (
    <span
      role="presentation"
      onFocus={this.startEditing}
      onClick={this.startEditing}
      className={'edit-in-place' + this.props.isEditable ? ' editable' : ''}
    >
      {this.props.value || this.props.placeholder}
    </span>)

  renderEdit = () => React.createElement(
    this.props.editor,
    {
      ref: this.inputRef,
      className: 'edit-in-place rd-form-control',
      defaultValue: this.props.value,
      onBlur: this.stopEditing,
      onKeyDown: this.keyDown,
    },
  )

  render() {
    if (this.state.editing) {
      return this.renderEdit();
    }
    return this.renderNormal();
  }
}
