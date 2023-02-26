import { darkModeVar, isLoggedInVar } from "apollo";
import { useReactiveVar } from "@apollo/client";
import { darkTheme, lightTheme, GlobalStyles } from "styles";
import { ThemeProvider } from "styled-components";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "screens/Home";
import Login from "screens/Login";
import SignUp from "screens/SignUp";
import routes from "routes";
import { HelmetProvider } from "react-helmet-async";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);

  return (
    <HelmetProvider>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route
              path={routes.home}
              element={isLoggedIn ? <Home /> : <Login />}
            />
            {!isLoggedIn ? (
              <Route path={routes.signUp} element={<SignUp />} />
            ) : null}
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
