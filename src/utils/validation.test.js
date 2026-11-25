import { describe, it, expect } from "vitest";
import { validateEmail } from "./validation";

describe("validateEmail", () => {
  it("should return true for a valid email", () => {
    expect(validateEmail("joseph@example.com")).toBe(true);
  });

  it("should return false for an invalid email", () => {
    expect(validateEmail("josephexample.com")).toBe(false);
  });

  it("should return false for a valid email", () => {
  expect(validateEmail("joseph@gmail.com")).toBe(true);
});
});