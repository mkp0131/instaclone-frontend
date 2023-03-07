import { gql, useMutation } from "@apollo/client";
import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logUserIn } from "apollo";
import FormError from "components/auth/FormError";
import PageTitle from "components/PageTitle";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { Login as ILogin, LoginVariables } from "__generated__/Login";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import Input from "../components/auth/Input";
import Separator from "../components/auth/Separator";
import routes from "../routes";

const FacebookLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;

interface IForm {
  username: string;
  password: string;
  result?: string;
}

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      ok
      error
    }
  }
`;

interface stateType {
  message?: string;
  username?: string;
  password?: string;
}

function Login() {
  const location = useLocation();
  const state = location.state as stateType;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    clearErrors,
  } = useForm<IForm>({
    mode: "onChange",
    defaultValues: {
      username: state?.username || "",
      password: state?.password || "",
    },
  });

  // graphql 쿼리 인스턴스 생성
  const [login, { loading }] = useMutation<ILogin, LoginVariables>(
    LOGIN_MUTATION,
    {
      // 완료된 후 콜백
      onCompleted: (data) => {
        const {
          login: { ok, error, token },
        } = data;

        if (!ok) {
          setError("result", {
            message: error + "",
          });
          return;
        }
        if (!token) {
          setError("result", {
            message: "로그인 오류가 발생 했습니다.",
          });
          return;
        }
        logUserIn(token);
      },
    }
  );

  const onSubmitValid = (data: IForm) => {
    // graphql 쿼리 전송
    login({
      variables: {
        username: data.username,
        password: data.password,
      },
    });
  };

  const clearLoginError = () => {
    clearErrors();
  };

  return (
    <AuthLayout>
      <PageTitle title="Login" />
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>
        {location.state?.message && <p>{location.state?.message}</p>}
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 2,
                message: "Username should be longer than 5 chars.",
              },
            })}
            onFocus={clearLoginError}
            type="text"
            placeholder="Username"
            hasError={Boolean(errors?.username?.message)}
          />
          <FormError message={errors?.username?.message} />
          <Input
            {...register("password", {
              required: "Password is required.",
            })}
            onFocus={clearLoginError}
            type="password"
            placeholder="Password"
            hasError={Boolean(errors?.password?.message)}
          />
          <FormError message={errors?.password?.message} />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Log in"}
            disabled={!isValid || loading}
          />
          <FormError message={errors?.result?.message} />
        </form>
        <Separator />
        <FacebookLogin>
          <FontAwesomeIcon icon={faFacebookSquare} />
          <span>Log in with Facebook</span>
        </FacebookLogin>
      </FormBox>
      <BottomBox
        cta="Don't have an account?"
        linkText="Sign up"
        link={routes.signUp}
      />
    </AuthLayout>
  );
}
export default Login;
