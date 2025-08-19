"use client";

import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; 

function BootstrapClient() {
  useEffect(() => {
    import("bootstrap");
  }, []);

  return null;
}

export default BootstrapClient;
