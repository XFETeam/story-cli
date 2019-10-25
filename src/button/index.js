import * as React from 'react';


export default class Button extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.state = {
      loading: false
    };
  }

  async onClick() {
    const { onClick } = this.props;
    if (onClick) {
      this.updateState({ loading: true });
      try {
        await onClick();
        this.updateState({ loading: false });
      } catch (e) {
        this.updateState({ loading: false });
        throw e;
      }
    }
  }

  getClassName() {
    const { size, className } = this.props;
    return cx(
      'button',
      {
        medium: style.buttonMedium
      }[size],
      className
    );
  }

  updateState(nextState) {
    if (!this.isUnmount) {
      this.setState(nextState);
    }
  }

  componentWillUnmount() {
    this.isUnmount = true;
  }

  render() {
    let { children, loading, disabled, ...restProps } = this.props;
    loading = loading === undefined ? this.state.loading : loading;
    disabled = disabled === undefined ? this.state.loading : disabled;
    return (
      <div/>
    );
  }
}
