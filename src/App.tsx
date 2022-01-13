import React, { ReactElement } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Cabinet from "./pages/Cabinet/Cabinet";
import Login from "./pages/Login/Login";
import styles from "./App.module.css";
import Logout from "./pages/Logout/Logout";
import { GlobalStyle } from './styles/global_style';
import Logo from "./components/Logo/Logo";

interface PrivateRouteProps {
  children: ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const savedToken = localStorage.getItem("publicKey");
  const token = !!window.solana && !!savedToken;
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
      <>
          <GlobalStyle/>
          <div className={styles.App}>
              <Logo/>
              <div className={styles.main_container}>
                  <div className={styles.container}>
                      <Routes>
                          <Route index={false} path="/" element={<Login />} />
                          <Route path="/cabinet" element={<PrivateRoute><Cabinet /></PrivateRoute>}/>
                          <Route path="/logout" element={<Logout />} />
                      </Routes>
                  </div>
              </div>
          </div>
      </>
  );
}

const AppWrapper = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default AppWrapper;
