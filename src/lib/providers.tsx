"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { queryClient } from "./react-query";

export default function AppProvider({ children }: { children: ReactNode }) {
  const [client] = useState(queryClient);
  return (
    <QueryClientProvider client={client}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
