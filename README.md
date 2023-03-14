# 인스타 클론 프론트엔드 리액트 타입스크립트

## [react] 리액트 전역 상태(state) 관리 apollo Reactive Variables

reactive variables는 Apollo Client 캐시 외부의 local state를 나타내는 유용한 메커니즘입니다. 캐시와 분리되어 있기 때문에 reactive variables는 모든 유형과 구조의 데이터를 저장할 수 있으며 GraphQL 구문을 사용하지 않고도 애플리케이션의 어느 곳에서나 상호 작용할 수 있습니다. 가장 중요한 것은 reactive variable를 수정하면 해당 변수에 의존하는 모든 활성 쿼리의 업데이트가 트리거된다는 것입니다.

### 사용법

- `src/apollo.ts` 파일 생성
- `makeVar` 로 state 저장

```ts
import { makeVar } from "@apollo/client";

export const isLoggedInVar = makeVar(false);
```

- 파일에서 사용 `useReactiveVar` 를 이용하여 저장한 state를 불러옴.

```ts
function App() {
  let isLoggedIn = useReactiveVar(isLoggedInVar);

  return (
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
  );
}
```

- 상태변경, `makeVar` 로 생성한 변수를 함수로 사용하여 state 를 변경

```ts
import { isLoggedInVar } from "apollo";

const Login = () => {
  return (
    <>
      <h1>Login</h1>
      <button onClick={() => isLoggedInVar(true)}>로그인 가자!</button>
    </>
  );
};

export default Login;
```

---

## 여기 까지 작성

---

## [react] apollo client 사용 graphql 리액트 사용

### 참고사항

- 브라우저에 apollo dev tool 을 설치한다.
  > https://chrome.google.com/webstore/detail/apollo-client-devtools/jdkknkkbebbapilgoeccciglkfbmbnfm/related?hl=ko&gl=KR
- dev tool 에서 쿼리를 가져오지 못할경우, 브라우저를 아에 종료후 재시작 한다.

### 타입스크립트 적용

- 아래 방법은 추후 apollo CLI 패키지가 올라가면 사용못한다함.
  => https://www.graphql-code-generator.com/docs/getting-started
  => 막히면 이 패키지를 연구해 보도록 하자!

- `apollo` 패키지를 전역으로 설치한다.

```
npm i -g apollo
 npm install -g graphql
```

- `apollo.config.js` 파일을 생성

```js
module.exports = {
  client: {
    includes: ["./src/**/*.{tsx,ts}"],
    tagName: "gql",
    service: {
      name: "instaclone-backend",
      url: "http://localhost:4444/graphql",
    },
  },
};
```

- 명령어 실행

```
apollo client:codegen src/__generated__ --target=typescript --outputFlat
```

- `src/__generated__` 폴더에 리액트에 있는 `gql` 함수의 타입이 생선된다.

### 사용

- `apollo.ts` 파일 생성 client 인스턴스 생성

```ts
export const client = new ApolloClient({
  uri: "http://localhost:4444/graphql",
  cache: new InMemoryCache(),
  connectToDevTools: true,
});
```

- `App.tsx` 에 <ApolloProvider> 세팅 / 생성한 client 를 넣어준다.

```ts
function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);

  return (
    <ApolloProvider client={client}>
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
    </ApolloProvider>
  );
}
```

#### login Mutation 보내기

- gql 생성

```ts
const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      ok
      error
    }
  }
`;
```

```ts
// graphql 쿼리 인스턴스 생성
const [login, { loading }] = useMutation<Login, LoginVariables>(
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
      }
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
```

### query 보내기

```tsx
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
```

## [react] apollo query 조건 if skip

- `skip` 속성을 활용하여 쿼리를 조건을 걸고 보낸다.
- `skip` 을 할 경우에는 데이터가 `null` 이 된다.

```tsx
const isLoggedIn = useReactiveVar(isLoggedInVar);
const { data, error } = useQuery(ME_QUERY, {
  skip: !isLoggedIn,
});
```

## [react] apollo client http header 추가 토큰

- `createHttpLink` 로 `httpLink` 생성
- `setContext` 로 `authLink` 생성
- `ApolloClient` 인스턴스 생성시 옵션으로 부여

```ts
const httpLink = createHttpLink({
  uri: "http://localhost:4444/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: localStorage.getItem(TOKEN),
    },
  };
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: true,
  link: authLink.concat(httpLink),
});
```

## [react] apollo useMutation 후 refetch

### update

- `useMutation` 의 `update` 옵션으로 다른 쿼리를 리패치 할 수 있다.

```ts
const [toggleLikeMutation, { loading }] = useMutation(TOGGLE_LIKE_MUTATION, {
  variables: {
    id,
  },
  // 쿼리가 끝난후 실행되는 콜백
  update: (cache, result) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;

    // 쿼리가 잘 전동되었는지 확인
    if (ok) {
      // 캐시를 업데이트
      cache.writeFragment({
        // 캐시 아이디
        id: `Photo:${id}`,
        // fragment 아무이름 on 타입
        fragment: gql`
          fragment BSName on Photo {
            isLiked
          }
        `,
        data: {
          isLiked: !isLiked,
        },
      });
    }
  },
});
```

#### readFragment 사용

- **컴포넌트에 기존 캐시된 정보가 없을 경우 사용한다.**

```ts
const [toggleLikeMutation, { loading }] = useMutation(TOGGLE_LIKE_MUTATION, {
  variables: {
    id,
  },
  // 쿼리가 끝난후 실행되는 콜백
  update: (cache, result) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;

    // 쿼리가 잘 전동되었는지 확인
    if (ok) {
      const fragmentId = `Photo:${id}`;
      const fragment = gql`
        fragment BSName on Photo {
          isLiked
          likes
        }
      `;
      // 캐시에서 데이터 가져오기
      const cacheData: Partial<seeFeed_seeFeed> | null = cache.readFragment({
        id: fragmentId,
        fragment,
      });

      if (cacheData && "isLiked" in cacheData && "likes" in cacheData) {
        const { isLiked: cacheIsLiked, likes: cacheLikes } = cacheData;
        // 캐시를 업데이트
        cache.writeFragment({
          // 캐시 아이디
          id: fragmentId,
          // fragment 아무이름 on 타입
          fragment,
          data: {
            isLiked: !cacheIsLiked,
            likes: cacheIsLiked ? cacheLikes! - 1 : cacheLikes! + 1,
          },
        });
      }
    }
  },
});
```

### refetchQueries

- `useMutation` 의 `refetchQueries` 옵션으로 다른 쿼리를 리패치 할 수 있다.
- 모든 쿼리가 업데이트 되기 때문에 **비추천**

```ts
const [toggleLikeMutation, { loading }] = useMutation(TOGGLE_LIKE_MUTATION, {
  variables: {
    id,
  },
  refetchQueries: [FEED_QUERY],
});
```
