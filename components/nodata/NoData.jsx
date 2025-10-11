"use client";
import React from "react";
import Lottie from "lottie-react";
import noDataAnimation from "@/components/lottie/nodata.json";

const NoData = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-64 h-64">
        <Lottie animationData={noDataAnimation} loop={true} />
      </div>
    </div>
  );
};

export default NoData;
