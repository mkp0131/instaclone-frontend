import styled from "styled-components";
import { FatLink } from "components/shared";
import AuthLayout from "components/auth/AuthLayout";
import FormBox from "components/auth/FormBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import Input from "components/auth/Input";
import Button from "components/auth/Button";
import BottomBox from "components/auth/BottomBox";
import routes from "routes";
import PageTitle from "components/PageTitle";
import { SubmitHandler, useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import {
  CreateAccount,
  CreateAccountVariables,
} from "__generated__/CreateAccount";
import FormError from "components/auth/FormError";
import { useNavigate } from "react-router-dom";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

interface IForm {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  result?: string;
}

const CREATE_ACCOUNT = gql`
  mutation CreateAccount(
    $firstName: String!
    $username: String!
    $email: String!
    $password: String!
    $lastName: String
  ) {
    createAccount(
      firstName: $firstName
      username: $username
      email: $email
      password: $password
      lastName: $lastName
    ) {
      ok
      error
    }
  }
`;

function SingUp() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    clearErrors,
    getValues,
  } = useForm<IForm>();

  const navigate = useNavigate();

  const [createAccount, { loading }] = useMutation<
    CreateAccount,
    CreateAccountVariables
  >(CREATE_ACCOUNT, {
    onCompleted: (data) => {
      const {
        createAccount: { ok, error },
      } = data;

      if (!ok) {
        setError("result", {
          message: error + "",
        });
        return;
      }

      const { username, password } = getValues();

      navigate(routes.home, {
        replace: true,
        state: {
          message: "아이디가 생성되었습니다. 로그인 해주세요.",
          username,
          password,
        },
      });
    },
  });

  const onSubmit: SubmitHandler<IForm> = (data) => {
    if (loading) {
      return;
    }

    createAccount({
      variables: {
        ...data,
      },
    });
  };

  const clearFormError = () => {
    clearErrors();
  };

  return (
    <AuthLayout>
      <PageTitle title="SignUp" />
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
          <Subtitle>
            Sign up to see photos and videos from your friends.
          </Subtitle>
        </HeaderContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("firstName", {
              required: "First Name is required.",
            })}
            onFocus={clearFormError}
            type="text"
            placeholder="First Name"
          />
          <FormError message={errors?.firstName?.message} />
          <Input
            {...register("lastName", {
              required: "Last Name is required.",
            })}
            onFocus={clearFormError}
            type="text"
            placeholder="Last Name"
          />
          <FormError message={errors?.lastName?.message} />
          <Input
            {...register("email", {
              required: "Email is required.",
            })}
            onFocus={clearFormError}
            type="text"
            placeholder="Email"
          />
          <FormError message={errors?.email?.message} />
          <Input
            {...register("username", {
              required: "Username is required.",
            })}
            onFocus={clearFormError}
            type="text"
            placeholder="Username"
          />
          <FormError message={errors?.username?.message} />
          <Input
            {...register("password", {
              required: "Password is required.",
            })}
            onFocus={clearFormError}
            type="password"
            placeholder="Password"
          />
          <FormError message={errors?.password?.message} />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Sign Up"}
            disabled={!isValid || loading}
          />
          <FormError message={errors?.result?.message} />
        </form>
      </FormBox>
      <BottomBox cta="Have an account?" linkText="Log in" link={routes.home} />
    </AuthLayout>
  );
}
export default SingUp;
