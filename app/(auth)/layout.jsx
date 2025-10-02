"use client"; 

import { SessionProvider } from "next-auth/react";

const AuthLayout = ({ children }) => {
  return (
    <SessionProvider>
      <main>{children}</main>
    </SessionProvider>
  );
};

export default AuthLayout;
