import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import { NavigateFunction } from "react-router-dom";
import routes from "routes";

const TOKEN = "TOKEN";
const DARK_MODE = "DARK_MODE";

export const isLoggedInVar = makeVar(!!localStorage.getItem(TOKEN));
export const logUserIn = (token: string) => {
  localStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
};
export const logUserOut = (navigate: NavigateFunction) => {
  localStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  navigate(routes.home, { replace: true, state: null });
};

export const darkModeVar = makeVar(!!localStorage.getItem(DARK_MODE));

export const enableDarkMode = () => {
  localStorage.setItem(DARK_MODE, "enabled");
  darkModeVar(true);
};

export const disableDarkMode = () => {
  localStorage.removeItem(DARK_MODE);
  darkModeVar(false);
};

export const client = new ApolloClient({
  uri: "http://localhost:4444/graphql",
  cache: new InMemoryCache(),
  connectToDevTools: true,
});
