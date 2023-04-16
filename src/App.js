import "antd/dist/reset.css";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes";
import AuthRouter from "./routes/authRouter";

function App() {
  return (
    <BrowserRouter>
      <AuthRouter>
        <Router />
      </AuthRouter>
    </BrowserRouter>
  );
}

export default App;
