import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function TitleManager() {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        document.title = "Home";
        break;
      case "/product":
        document.title = "Products";
        break;
      case "/login":
        document.title = "Login";
        break;
      case "/category":
        document.title = "Categories";
        break;
      case "/profile":
        document.title = "Profile";
        break;
      default:
        document.title = "ekart";
    }
  }, [location]);

  return null;
}
export default TitleManager;