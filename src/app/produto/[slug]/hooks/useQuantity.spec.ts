import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useQuantity } from "./useQuantity";

describe("useQuantity", () => {
  it("starts at 1", () => {
    const { result } = renderHook(() => useQuantity());
    expect(result.current.quantity).toBe(1);
  });

  it("increments and decrements", () => {
    const { result } = renderHook(() => useQuantity());
    act(() => result.current.increment());
    act(() => result.current.increment());
    expect(result.current.quantity).toBe(3);
    act(() => result.current.decrement());
    expect(result.current.quantity).toBe(2);
  });

  it("does not decrement below 1", () => {
    const { result } = renderHook(() => useQuantity());
    act(() => result.current.decrement());
    act(() => result.current.decrement());
    expect(result.current.quantity).toBe(1);
  });

  it("clamps at max when provided", () => {
    const { result } = renderHook(() => useQuantity(2));
    act(() => result.current.increment());
    act(() => result.current.increment());
    act(() => result.current.increment());
    expect(result.current.quantity).toBe(2);
    expect(result.current.canIncrement).toBe(false);
  });

  it("canIncrement is true when no max is set", () => {
    const { result } = renderHook(() => useQuantity());
    expect(result.current.canIncrement).toBe(true);
  });
});
