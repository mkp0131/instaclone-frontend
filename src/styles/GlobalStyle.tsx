import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset};
   *, html, body {
    font-family: 'Source Sans Pro', sans-serif;
    box-sizing: border-box;
    // theme 으로 제공한 것은 props 로 접근 가능
    background: ${(props) => props.theme.bgColor};
  }
`;

export default GlobalStyle;
