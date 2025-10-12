"use client";

import React, { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import CoverPage from "@/components/coverpage/Coverpage";

const AuthLayout = ({ children }) => {
  const [showCover, setShowCover] = useState(true);

  return (
    <SessionProvider>
      <AnimatePresence mode="wait">
        {showCover ? (
          <motion.div
            key="cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[999] w-full h-full"
          >
            <CoverPage onGetStarted={() => setShowCover(false)} />
          </motion.div>
        ) : (
          <motion.main
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.main>
        )}
      </AnimatePresence>
    </SessionProvider>
  );
};

export default AuthLayout;
