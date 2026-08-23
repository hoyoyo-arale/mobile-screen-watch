import { describe, expect, it } from "vitest";
import { toggleTheme } from "./theme";

describe("toggleTheme", () => {
  it("changes dark theme to light theme", () => {
    expect(toggleTheme("dark")).toBe("light");
  });

  it("changes light theme to dark theme", () => {
    expect(toggleTheme("light")).toBe("dark");
  });
});
