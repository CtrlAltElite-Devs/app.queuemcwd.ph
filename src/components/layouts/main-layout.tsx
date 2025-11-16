import { PropsWithChildren } from "react";
import WithFooter from "../with-footer";
import WithNavbar from "../with-navbar";

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="w-full font-sans">
      <div className="flex min-h-screen flex-col">
        <WithNavbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-10">
          {children}
        </main>
        <WithFooter />
      </div>
    </div>
  );
}
