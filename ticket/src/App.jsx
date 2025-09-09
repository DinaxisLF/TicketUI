import React from "react";
import { AuthProvider, ProtectedRoute } from "./components/Login.jsx";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Logo from "./assets/logo-black.png";
import Theater from "./components/Theater.jsx";
import Cinema from "./components/Cinema.jsx";
import Museum from "./components/Museum.jsx";
import WhiteLogo from "./assets/logo.png";
import TheaterEvents from "./components/TheaterEvents.jsx";
import BuyTickets from "./components/BuyTickets.jsx";
import ConfirmPurchase from "./components/ConfirmPurchase.jsx";
import PurchaseSummary from "./components/PurchaseSummary.jsx";

// Create a wrapper component to conditionally apply background
function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isHomePage = location.pathname === "/";

  const getBackgroundColor = () => {
    if (isLoginPage) return "";
    if (isHomePage) return "min-h-screen bg-blue-700";
    return "min-h-screen bg-white shadow-lg";
  };

  const getNavColor = () => {
    if (isHomePage || isLoginPage) return "bg-white shadow-lg";
    return "bg-blue-700 shadow-lg";
  };

  const navItemsColor = () => {
    if (isHomePage || isLoginPage)
      return "inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-black hover:text-gray-700 hover:border-gray-300";
    return "inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-white hover:text-white-700 hover:border-black-300";
  };

  const setNavItems = () => {
    if (isHomePage || isLoginPage) return true;
    return false;
  };

  return (
    <div className={getBackgroundColor()}>
      <nav className={getNavColor()}>
        <div className="max-w-7xl mx-auto px-4 justify-center">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              {setNavItems() && (
                <>
                  <img src={Logo} alt="Logo" className="mx-auto w-full" />
                  <Link to="/" className={navItemsColor()}>
                    Inicio
                  </Link>
                </>
              )}
              {!setNavItems() && (
                <>
                  <img src={WhiteLogo} alt="Logo" className="mx-auto w-full" />
                  <Link to="/dashboard" className={navItemsColor()}>
                    <p className="font-bold">Inicio</p>
                  </Link>
                  <Link to="/theater" className={navItemsColor()}>
                    Teatro
                  </Link>
                  <Link to="/cinema" className={navItemsColor()}>
                    Cine
                  </Link>
                  <Link to="/museum" className={navItemsColor()}>
                    Museo
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Remove container padding on login page */}
      <main
        className={isLoginPage ? "" : "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"}
      >
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/theater"
              element={
                <ProtectedRoute>
                  <Theater />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cinema"
              element={
                <ProtectedRoute>
                  <Cinema />
                </ProtectedRoute>
              }
            />
            <Route
              path="/museum"
              element={
                <ProtectedRoute>
                  <Museum />
                </ProtectedRoute>
              }
            />
            <Route
              path="/theaterEvents/:theaterId"
              element={
                <ProtectedRoute>
                  <TheaterEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyTickets"
              element={
                <ProtectedRoute>
                  <BuyTickets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchaseSummary"
              element={
                <ProtectedRoute>
                  <ConfirmPurchase />
                </ProtectedRoute>
              }
            />
            <Route
              path="/summary"
              element={
                <ProtectedRoute>
                  <PurchaseSummary />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
