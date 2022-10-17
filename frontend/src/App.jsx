import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard.tsx";
import Login from "./components/Login.tsx";
import Navbar from "./components/Navbar.tsx";
import Register from "./components/Register.tsx";
 
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Login/>
        </Route>
        <Route path="/register">
          <Register/>
        </Route>
        <Route path="/dashboard">
          <Navbar/>
          <Dashboard/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
