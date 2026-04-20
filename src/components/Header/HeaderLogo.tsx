import Link from "next/link";
import { DEFAULT_LOGO_COLOR } from "./constants";

interface HeaderLogoProps {
  readonly name?: string | null;
  readonly logoUrl?: string | null;
  readonly primaryColor?: string | null;
}

export function HeaderLogo({ name, logoUrl, primaryColor }: HeaderLogoProps) {
  return (
    <Link href="/" className="flex items-center">
      {logoUrl ? (
        <img src={logoUrl} alt={name ?? "Logo"} className="h-10 w-auto" />
      ) : (
        <h1
          className="text-xl font-bold"
          style={{ color: primaryColor ?? DEFAULT_LOGO_COLOR }}
        >
          {name ?? "Gaqno Shop"}
        </h1>
      )}
    </Link>
  );
}
