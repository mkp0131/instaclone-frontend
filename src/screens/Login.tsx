import { isLoggedInVar } from "apollo";
import styled from "styled-components";

interface IContainer {
  float: boolean;
}

const Container = styled.div<IContainer>`
  width: 300px;
  height: 300px;
  background: red;
`;

const Login = () => {
  return (
    <>
      <h1>Login</h1>
      <button onClick={() => isLoggedInVar(true)}>로그인 가자!</button>
      <Container float={true} />
    </>
  );
};

export default Login;
