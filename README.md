# 인스타 클론 프론트엔드 리액트 타입스크립트

## [react] 리액트 전역 상태 관리 apollo Reactive Variables

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

## [react] styled-components props 사용
