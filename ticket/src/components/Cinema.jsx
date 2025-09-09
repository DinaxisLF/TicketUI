import React from "react";
import { useAuth } from "./Login.jsx";

export default function Cinema() {
  const { user, logout } = useAuth();
  return <div>Cinema</div>;
}
