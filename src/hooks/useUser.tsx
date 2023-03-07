import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { Me } from "__generated__/me";
import { isLoggedInVar } from "../apollo";

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
  const { data, error } = useQuery<Me>(ME_QUERY, {
    skip: !isLoggedIn,
  });
  console.log(data, error);
  return;
}
export default useUser;
