import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const makeMatchMedia = (matches: boolean) => ({
  matches,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
  onchange: null,
  media: "(prefers-color-scheme: dark)",
  addListener: vi.fn(),
  removeListener: vi.fn(),
});

describe("FOUC script system theme behaviour", () => {
  const FOUC_BODY = [
    "try{",
    "var t=localStorage.getItem('theme');",
    "if(t==='light'){document.documentElement.classList.remove('dark');}",
    "else if(t==='dark'){document.documentElement.classList.add('dark');}",
    "else if(t==='system'){",
    "if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('dark');}",
    "else{document.documentElement.classList.remove('dark');}",
    "}else{document.documentElement.classList.add('dark');}",
    "}catch(e){document.documentElement.classList.add('dark');}",
  ].join("");

  const execScript = () => new Function(FOUC_BODY)();

  beforeEach(() => {
    document.documentElement.classList.remove("dark");
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("adds dark class when system prefers dark and theme is system", () => {
    localStorage.setItem("theme", "system");
    vi.stubGlobal("matchMedia", () => makeMatchMedia(true));
    execScript();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes dark class when system prefers light and theme is system", () => {
    localStorage.setItem("theme", "system");
    document.documentElement.classList.add("dark");
    vi.stubGlobal("matchMedia", () => makeMatchMedia(false));
    execScript();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("defaults to dark when matchMedia throws", () => {
    localStorage.setItem("theme", "system");
    vi.stubGlobal("matchMedia", () => {
      throw new Error("unavailable");
    });
    execScript();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("defaults to dark when localStorage is unavailable", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("SecurityError");
    });
    execScript();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
