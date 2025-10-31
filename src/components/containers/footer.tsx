import Link from "next/link";

type Navigation = {
  socialLinks: Array<{
    icon: string;
    link: string;
  }>;
  footerLinks: Array<{
    text: string;
    link: string;
  }>;
};

type FooterProps = {
  pathname?: string;
  navigation?: Navigation;
};

export default function Footer({ pathname = "/" }: FooterProps) {
  return (
    <footer className="mt-8 w-full border-t border-zinc-300 bg-white/60 py-4 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-2">
        <span>© {new Date().getFullYear()}</span>
        <Link
          href={pathname}
          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Metropolitan Cebu Water District
        </Link>
        <span>All rights reserved.</span>
      </div>
    </footer>
  );
}
