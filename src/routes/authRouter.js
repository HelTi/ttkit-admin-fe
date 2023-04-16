import storage from "@/utils/storage";
import { Navigate, useLocation } from "react-router-dom";
import routes from "./modules";
import { searchRoute } from "./utils";

const AuthRouter = ({ children }) => {
  const isLogin = storage.get('token');
  const { pathname } = useLocation();
  const route = searchRoute(pathname, routes);
  const roles = route?.meta?.roles;

  // 登录状态
  if (isLogin) {
    return children;
  } else {
    // 未登录状态，不需要权限，比如登录页
    if (roles?.length === 0) {
      return children;
    }
    return <Navigate to="/login" replace />;
  }
};

export default AuthRouter;
