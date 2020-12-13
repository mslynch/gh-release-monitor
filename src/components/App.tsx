import { lightGreen } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import Content from "./Content";

function App() {
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: "dark",
          primary: {
            main: lightGreen[200],
          },
          secondary: {
            main: lightGreen[200],
          },
        },
      }),
    []
  );

  return (
    <div>
      <header>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Content />
        </ThemeProvider>
      </header>
    </div>
  );
}

export default App;
