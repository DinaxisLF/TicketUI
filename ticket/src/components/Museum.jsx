import React from "react";
import { useAuth } from "./Login.jsx";

export default function Museum() {
  const { user, logout } = useAuth();
  return <div>Museum</div>;
}
