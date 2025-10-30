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

export default function Foooter({ pathname = "/" }: FooterProps) {
  return (
    <footer className="w-full border-t border-zinc-300 bg-white/60 py-4 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
      © {new Date().getFullYear()}{" "}
      <Link href={pathname}>Metropolitan Cebu Water District</Link>. All rights
      reserved.
    </footer>
  );
}
