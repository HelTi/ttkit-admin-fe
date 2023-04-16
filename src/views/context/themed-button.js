import React from "react";
import { ThemeContext } from "./theme-context";

class ThemedButton extends React.Component {
  render() {
    const props = this.props;
    const theme = this.context;

    return (
      <button {...props} style={{ backgroundColor: theme.background }}>
        button
      </button>
    );
  }
}

ThemedButton.contextType = ThemeContext;

export default ThemedButton;
