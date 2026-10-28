import { describe, expect, it } from "vitest";
import {
  STORAGE_KEY,
  UV_TODO,
  allDosClear,
  careHeadline,
  daysSince,
  emptyState,
  filterProcedures,
  findGroup,
  formatHeaderDate,
  loadState,
  progress,
  saveState,
  statusLine,
  todayISO,
  todayList,
  toggleDone,
} from "./storage.js";

const noon = (iso) => new Date(`${iso}T12:00:00`);
const rejuran = { date: "2026-10-27", name: "리쥬란" };
const pico = { date: "2026-10-27", name: "피코토닝" };

describe("todayISO / daysSince / header", () => {
  it("uses the browser local calendar day", () => {
    expect(todayISO(noon("2026-10-28"))).toBe("2026-10-28");
    expect(formatHeaderDate(noon("2026-10-28"))).toBe("10/28(수)");
  });

  it("counts D+0 on the procedure day", () => {
    expect(daysSince("2026-10-28", noon("2026-10-28"))).toBe(0);
    expect(daysSince("2026-10-27", noon("2026-10-28"))).toBe(1);
  });
});

describe("groups and search", () => {
  it("maps Rejuran to booster, not a duplicate 스킨부스터 category name", () => {
    expect(findGroup("리쥬란").id).toBe("booster");
    expect(findGroup("스킨부스터")).toBeNull();
    expect(findGroup("피코토닝").id).toBe("toning");
  });

  it("filters chips by query", () => {
    expect(filterProcedures("리쥬").map((item) => item.name)).toEqual(["리쥬란"]);
  });
});

describe("todayList", () => {
  it("returns no todos without a procedure", () => {
    expect(todayList(null, noon("2026-10-28"))).toEqual({
      slots: [],
      dos: [],
      notes: [],
      n: null,
    });
  });

  it("returns booster early copy for Rejuran yesterday", () => {
    const list = todayList(rejuran, noon("2026-10-28"));
    expect(list.n).toBe(1);
    expect(list.slots.map((item) => item.id)).toEqual(["morning", "midday", "evening"]);
    expect(list.dos[0]).toContain("엠보 부위");
    expect(list.dos).toContain(UV_TODO);
    expect(list.dos[2]).toContain("얇게 2~3번 겹쳐 바르세요");
    expect(list.notes[0]).toContain("음주");
  });

  it("returns toning copy different from booster", () => {
    const list = todayList(pico, noon("2026-10-28"));
    expect(list.dos[0]).toContain("붉은 기");
    expect(list.notes.join(" ")).not.toContain("음주");
  });

  it("merges compound procedures with the stronger morning", () => {
    const list = todayList([rejuran, pico], noon("2026-10-28"));
    expect(list.dos[0]).toContain("엠보 부위");
    expect(list.dos[0]).not.toContain("붉은 기");
    expect(list.notes.join(" ")).toContain("음주");
    expect(list.notes.join(" ")).toContain("강한 마찰");
  });

  it("uses maintain copy when N is 7 or more", () => {
    const list = todayList(
      { date: "2026-10-21", name: "리쥬란" },
      noon("2026-10-28"),
    );
    expect(list.dos[0]).toBe("약산성 거품으로 세안하세요.");
    expect(list.slots.map((item) => item.id)).toEqual(["morning", "midday"]);
    expect(list.notes).toEqual([]);
  });
});

describe("status and headline", () => {
  it("shows name, D+N, and booster early headline", () => {
    const now = noon("2026-10-28");
    expect(statusLine(rejuran, now)).toBe("리쥬란 D+1");
    expect(statusLine([rejuran, pico], now)).toBe("리쥬란 D+1 · 피코토닝 D+1");
    expect(careHeadline(rejuran, now)).toContain("엠보싱");
    expect(careHeadline(pico, now)).toContain("피부 리듬");
  });
});

describe("loadState / saveState", () => {
  it("round-trips a procedure", () => {
    const memory = new Map();
    const storage = {
      getItem: (key) => memory.get(key) ?? null,
      setItem: (key, value) => memory.set(key, value),
    };
    const next = {
      procedures: [rejuran],
      checks: { day: "2026-10-28", done: [UV_TODO] },
      alarms: {},
    };
    saveState(next, storage);
    expect(memory.get(STORAGE_KEY)).toContain("리쥬란");
    expect(loadState(storage, noon("2026-10-28"))).toEqual(next);
  });

  it("returns empty checks for today when missing", () => {
    expect(loadState({ getItem: () => null }, noon("2026-10-28"))).toEqual({
      ...emptyState(),
      checks: { day: "2026-10-28", done: [] },
    });
  });
});

describe("progress / allDosClear", () => {
  it("counts completed dos only", () => {
    const now = noon("2026-10-28");
    const list = todayList(rejuran, now);
    let state = { procedure: rejuran, checks: { day: "2026-10-28", done: [] } };
    expect(progress(list, state, now)).toEqual({ done: 0, total: 3 });
    expect(allDosClear(list, state, now)).toBe(false);
    state = toggleDone(state, list.dos[0], now);
    expect(progress(list, state, now).done).toBe(1);
    for (const label of list.dos.slice(1)) {
      state = toggleDone(state, label, now);
    }
    expect(allDosClear(list, state, now)).toBe(true);
  });
});
