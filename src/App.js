// npm install react-bootstrap bootstrap@5.1.3
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom"; //npm install react-router-dom@5.2.0
import { Home } from "./pages/Home";
import { UserAdmin } from "./pages/UserAdmin";
import { AllowanceDashboard } from "./pages/AllowanceDashboard";
// import { AddedUserList } from './AddedUserList';
import Login from "./pages/Login";
import ErrorPage from "./pages/ErrorPage";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./pages/Register";
import "./index.css";
import UserProfile from "./pages/UserProfile/UserProfile";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route path="/Requestaccess" element={<Register />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/home" element={<Home />}></Route>
          <Route path="/UserAdmin" element={<UserAdmin />}></Route>
          <Route path="/UserProfile" element={<UserProfile />}></Route>
          <Route
            path="/AllowanceDashboard"
            element={<AllowanceDashboard />}
          ></Route>
          {/* <Route path="/addeduserlist" element={<AddedUserList/>}></Route> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
