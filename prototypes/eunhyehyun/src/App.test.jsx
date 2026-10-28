import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App.jsx";
import {
  ADD_TITLE,
  CLEAR_TOAST,
  FORECAST_ACTION,
  START_CARE,
  STORAGE_KEY,
  todayISO,
} from "./storage.js";

afterEach(() => {
  cleanup();
  localStorage.removeItem(STORAGE_KEY);
});

function yesterdayISO() {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  return todayISO(now);
}

describe("P0 aftercare checklist", () => {
  it("asks for a procedure with chips, not admin labels", () => {
    render(<App />);
    expect(screen.getByText(ADD_TITLE)).toBeTruthy();
    expect(screen.getByRole("button", { name: "리쥬란" })).toBeTruthy();
    expect(screen.getByRole("button", { name: START_CARE })).toBeTruthy();
    expect(screen.queryByText("카테고리")).toBeNull();
    expect(screen.queryByLabelText("이름")).toBeNull();
    expect(screen.queryByRole("button", { name: "저장" })).toBeNull();
    expect(screen.queryByText(/오늘의 맞춤 케어/)).toBeNull();
  });

  it("shows specific copy and progress after picking Rejuran", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "리쥬란" }));
    fireEvent.change(screen.getByLabelText("시술받은 날"), {
      target: { value: yesterdayISO() },
    });
    await user.click(screen.getByRole("button", { name: START_CARE }));

    expect(screen.getByText(/리쥬란 D\+1/)).toBeTruthy();
    expect(screen.getByText(/엠보싱/)).toBeTruthy();
    expect(screen.getByText("7")).toBeTruthy();
    expect(screen.getByText("35%")).toBeTruthy();
    expect(screen.getByText("18°C")).toBeTruthy();
    expect(screen.getByText(FORECAST_ACTION)).toBeTruthy();
    expect(screen.getByText(/얇게 2~3번 겹쳐 바르세요/)).toBeTruthy();
    expect(screen.getByText(/0\/3 완료/)).toBeTruthy();
    expect(screen.getByText("아침")).toBeTruthy();
    expect(screen.getByText("12:30")).toBeTruthy();
    expect(screen.queryByText("08:00")).toBeNull();
    expect(screen.queryByText("22:00")).toBeNull();
    await user.click(screen.getByRole("button", { name: "아침 알림 만들기" }));
    fireEvent.change(screen.getByLabelText("시각"), { target: { value: "07:30" } });
    await user.click(screen.getByRole("button", { name: "저장" }));
    expect(screen.getByText("07:30")).toBeTruthy();
    expect(screen.getByText(/엠보 부위/)).toBeTruthy();
    expect(screen.getByText(/오늘 이것만은 피하기/)).toBeTruthy();
    expect(screen.getByText(/음주/)).toBeTruthy();
    expect(screen.queryByRole("checkbox", { name: /음주/ })).toBeNull();
    expect(screen.queryByText("수분 크림을 두껍게 올리기")).toBeNull();
    expect(screen.queryByRole("button", { name: "알림 설정" })).toBeNull();

    await user.click(screen.getAllByRole("checkbox")[0]);
    expect(screen.getByText(/1\/3 완료/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /다른 시술 추가/ }));
    await user.click(screen.getByRole("button", { name: "피코토닝" }));
    fireEvent.change(screen.getByLabelText("시술받은 날"), {
      target: { value: yesterdayISO() },
    });
    await user.click(screen.getByRole("button", { name: START_CARE }));

    expect(screen.getByText(/붉은 기/)).toBeTruthy();
    expect(screen.queryByText(/엠보 부위/)).toBeNull();
    expect(screen.queryByText(/음주/)).toBeNull();
  });

  it("lets the add form keep two procedures together", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "리쥬란" }));
    await user.click(screen.getByRole("button", { name: "피코토닝" }));
    fireEvent.change(screen.getByLabelText("시술받은 날"), {
      target: { value: yesterdayISO() },
    });
    await user.click(screen.getByRole("button", { name: START_CARE }));

    expect(screen.getByText(/리쥬란 D\+1/)).toBeTruthy();
    expect(screen.getByText(/피코토닝 D\+1/)).toBeTruthy();
    expect(screen.getByText(/엠보 부위/)).toBeTruthy();
    expect(screen.getByText(/강한 마찰/)).toBeTruthy();
  });

  it("All Clears when dos are done", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "리쥬란" }));
    fireEvent.change(screen.getByLabelText("시술받은 날"), {
      target: { value: yesterdayISO() },
    });
    await user.click(screen.getByRole("button", { name: START_CARE }));

    const boxes = screen.getAllByRole("checkbox");
    for (const box of boxes) {
      await user.click(box);
    }
    expect(screen.getByText("오늘 케어 All Clear")).toBeTruthy();
    expect(screen.getByText(/3\/3 완료/)).toBeTruthy();
    expect(screen.getByText(CLEAR_TOAST)).toBeTruthy();
    expect(screen.getByText(/불안하신가요/)).toBeTruthy();
  });
});
