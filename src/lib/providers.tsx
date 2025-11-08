"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { queryClient } from "./react-query";
import { Toaster } from "sonner";

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
        <SidebarProvider>
          {children}
          <Toaster />
        </SidebarProvider>
      </ThemeProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
