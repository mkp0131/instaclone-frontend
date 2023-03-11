import { gql, useLazyQuery, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Me } from "__generated__/me";
import { isLoggedInVar, logUserOut } from "../apollo";

const ME_QUERY = gql`
  query Me {
    me {
      username
      avatar
    }
  }
`;

function useUser() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { data } = useQuery<Me>(ME_QUERY, {
    skip: !isLoggedIn,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (data?.me === null) {
      logUserOut(navigate);
    }
  }, [data]);

  return { data };
}
export default useUser;
