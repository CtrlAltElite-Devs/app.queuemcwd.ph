import { PropsWithChildren } from "react";
import Footer from "./footer";
import Header from "./header";

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="bg-zinc-50 font-sans dark:bg-black">
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto mt-15 flex max-w-[1000px] flex-1 flex-col items-center justify-center gap-10 lg:flex-row lg:items-start lg:justify-around">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
