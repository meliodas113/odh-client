import { Github } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-footerBg">
      <div className="container max-w-7xl mx-auto flex flex-col items-center justify-between gap-4 py-12 md:h-32 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-palette-text md:text-left">
            Built by{" "}
            <Link
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 text-palette-link"
            >
              your-name
            </Link>
            . The source code is available on{" "}
            <Link
              href="https://github.com/yourusername/your-repo"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 text-palette-link"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/yourusername/your-repo"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="h-5 w-5 text-palette-text hover:text-palette-hover" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
