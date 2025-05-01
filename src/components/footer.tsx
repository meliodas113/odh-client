import { Github } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-[#374151] bg-[#0A1A2F]">
      <div className="container max-w-7xl mx-auto flex flex-col items-center justify-between gap-6 py-10 md:h-32 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-relaxed text-[#A3BFFA] md:text-left">
            Built by{" "}
            <Link
              href="https://x.com/0xOddshub"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[#60A5FA] hover:text-[#E0F2FE] underline underline-offset-4 transition-colors"
            >
              @0xOddshub
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center gap-4"></div>
      </div>
    </footer>
  );
}
