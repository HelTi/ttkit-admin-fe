import React from "react";
import { ThemeContext, themes } from "./theme-context";
import ThemedButton from "./themed-button";

function ToolBar(props) {
  return <ThemedButton onClick={props.changeTheme}>change Theme</ThemedButton>;
}

class Context extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      theme: themes.light,
    };
  }

  toggleTheme = () => {
    this.setState((state) => ({
      theme: state.theme === themes.dark ? themes.light : themes.dark,
    }));
  };

  render() {
    return (
      <div>
        <ThemeContext.Provider value={this.state.theme}>
          <ToolBar changeTheme={this.toggleTheme} />
        </ThemeContext.Provider>

        <div>
          <ThemedButton />
        </div>
      </div>
    );
  }
}

export default Context;
