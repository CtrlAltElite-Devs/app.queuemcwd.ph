import { PropsWithChildren } from "react";
import WithFooter from "../with-footer";
import WithNavbar from "../with-navbar";

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="bg-zinc-50 font-sans dark:bg-black">
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
