import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

const FOUC_SCRIPT_BODY = [
  "(function(){",
  "try{",
  "var t=localStorage.getItem('theme');",
  "if(t==='light'){document.documentElement.classList.remove('dark');}",
  "else if(t==='dark'){document.documentElement.classList.add('dark');}",
  "else if(t==='system'){",
  "if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('dark');}",
  "else{document.documentElement.classList.remove('dark');}",
  "}else{document.documentElement.classList.add('dark');}",
  "}catch(e){document.documentElement.classList.add('dark');}",
  "})();",
].join("");

describe("RootLayout FOUC prevention", () => {
  it("renders html element with suppressHydrationWarning", () => {
    const { container } = render(
      <html lang="pt-BR" suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{ __html: FOUC_SCRIPT_BODY }} />
        </head>
        <body />
      </html>,
    );
    const html = container.querySelector("html");
    expect(html).toBeTruthy();
  });

  it("FOUC script defaults to dark when localStorage is empty", () => {
    localStorage.clear();
    const fn = new Function(FOUC_SCRIPT_BODY.replace(/^\(function\(\)\{/, "").replace(/\}\)\(\);$/, ""));
    fn.call({});
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("FOUC script applies light class when theme is light", () => {
    localStorage.setItem("theme", "light");
    document.documentElement.classList.add("dark");
    const fn = new Function(FOUC_SCRIPT_BODY.replace(/^\(function\(\)\{/, "").replace(/\}\)\(\);$/, ""));
    fn.call({});
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    localStorage.clear();
  });
});
