import { describe, expect, it } from "vitest";
import {
  STORAGE_KEY,
  buildSummary,
  daysAgo,
  emptyState,
  formatAmount,
  loadState,
  saveState,
  spokenSummary,
} from "./storage.js";

describe("formatAmount", () => {
  it("formats won in 만 원", () => {
    expect(formatAmount(480000)).toBe("48만 원");
    expect(formatAmount("")).toBe("");
  });
});

describe("daysAgo", () => {
  it("counts calendar days", () => {
    expect(daysAgo("2026-10-13", new Date("2026-10-23T12:00:00"))).toBe(10);
  });
});

describe("buildSummary", () => {
  it("writes last treatment, counts, and draft reason", () => {
    const summary = buildSummary({
      treatments: [
        { name: "스킨부스터", date: "2026-07-23", amount: 480000, createdAt: "1" },
      ],
      decisions: [{ choice: "defer", reason: "아직 이른 것 같다", date: "2026-09-01", createdAt: "1" }],
      draft: { choice: "defer", reason: "아직 이른 것 같다" },
    });

    expect(summary).toContain("마지막 시술: 스킨부스터");
    expect(summary).toContain("48만 원");
    expect(summary).toContain("받음 0 / 미룸 1");
    expect(summary).toContain("미룰 이유 — 아직 이른 것 같다");
  });
});

describe("spokenSummary", () => {
  it("makes the sentence a user should be able to say", () => {
    const text = spokenSummary({
      treatments: [{ name: "스킨부스터", date: "2026-07-23", amount: 480000, createdAt: "1" }],
      decisions: [{ choice: "defer", reason: "아직 이른 것 같다", date: "2026-10-23", createdAt: "1" }],
    });
    expect(text).toContain("지난번 스킨부스터");
    expect(text).toContain("미룬다");
  });
});

describe("loadState / saveState", () => {
  it("round-trips through storage", () => {
    const memory = new Map();
    const storage = {
      getItem: (key) => memory.get(key) ?? null,
      setItem: (key, value) => memory.set(key, value),
    };
    const next = { treatments: [{ name: "보톡스" }], decisions: [] };
    saveState(next, storage);
    expect(memory.get(STORAGE_KEY)).toContain("보톡스");
    expect(loadState(storage)).toEqual(next);
  });

  it("returns empty state when missing", () => {
    expect(loadState({ getItem: () => null })).toEqual(emptyState());
  });
});
