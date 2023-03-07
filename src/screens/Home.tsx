import { useNavigate } from "react-router-dom";
import { logUserOut } from "../apollo";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => logUserOut(navigate)}>Log out now!</button>
    </div>
  );
}
export default Home;
