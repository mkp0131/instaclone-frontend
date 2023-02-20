import { useReactiveVar } from "@apollo/client";
import { isDarkModeVar, isLoggedInVar } from "apollo";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "screens/Home";
import Login from "screens/Login";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "styles/GlobalStyle";
import { darkTheme, lightTheme } from "styles/theme";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const isDarkMode = useReactiveVar(isDarkModeVar);

  const toggleDarkMode = () => {
    isDarkModeVar(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <button onClick={toggleDarkMode}>다크모드 토글</button>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Home /> : <Login />} />
          {/* <Route path="/:coinId" element={<Coin />}>
          <Route path="chart" element={<Chart />} />
          <Route path="price" element={<Price />} />
        </Route>*/}
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
