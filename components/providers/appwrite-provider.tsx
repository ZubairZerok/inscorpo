"use client";

import { useEffect } from "react";
import { client } from "@/lib/appwrite";

export function AppwriteProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ping the Appwrite backend server to verify configuration setup
    client.ping()
      .then((response) => {
        console.log("Appwrite integration verified successfully:", response);
      })
      .catch((error) => {
        console.error("Appwrite connection failed:", error);
      });
  }, []);

  return <>{children}</>;
}
