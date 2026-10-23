import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App.jsx";
import { STORAGE_KEY } from "./storage.js";

afterEach(() => {
  cleanup();
  localStorage.removeItem(STORAGE_KEY);
});

describe("App flow", () => {
  it("blocks the decision card until one treatment exists", () => {
    render(<App />);
    expect(screen.getByText("마지막 시술 하나만 적어 주세요.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "지금 결정하기" })).toBeNull();
  });

  it("lets a user add a treatment and save a defer decision", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByPlaceholderText("보톡스, 스킨부스터, 리쥬란"), "스킨부스터");
    await user.type(screen.getByPlaceholderText("480000"), "480000");
    await user.type(screen.getByPlaceholderText("한 줄이면 됩니다"), "여름 전에 결이 거칠어서");
    await user.click(screen.getByRole("button", { name: "시술 저장" }));

    expect(screen.getByText(/마지막 시술: 스킨부스터/)).toBeTruthy();
    expect(screen.getAllByText(/48만 원/).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "지금 결정하기" }));
    await user.click(screen.getByRole("button", { name: "미룬다" }));
    await user.click(screen.getByLabelText("아직 이른 것 같다"));
    await user.click(screen.getByRole("button", { name: "결정 저장" }));

    expect(screen.getByText("저장된 한 줄")).toBeTruthy();
    expect(screen.getByText(/미룰 이유 — 아직 이른 것 같다/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "홈으로" }));
    expect(screen.getByText(/미룬다 · 아직 이른 것 같다/)).toBeTruthy();
  });
});
