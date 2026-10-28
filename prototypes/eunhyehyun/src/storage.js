export const STORAGE_KEY = "eunhyehyun.decision-log.v1";

export const REASONS = [
  "효과가 떨어진 것 같다",
  "가까운 D-Day가 있다",
  "병원에서 권유받았다",
  "이벤트 / 가격 때문이다",
  "아직 이른 것 같다",
  "돈이 아깝다",
  "기타",
];

export function emptyState() {
  return { treatments: [], decisions: [] };
}

export function loadState(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return {
      treatments: Array.isArray(parsed.treatments) ? parsed.treatments : [],
      decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
    };
  } catch {
    return emptyState();
  }
}

export function saveState(state, storage = globalThis.localStorage) {
  storage?.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function sortNewest(items) {
  return [...items].sort((a, b) => {
    const byDate = String(b.date).localeCompare(String(a.date));
    if (byDate !== 0) return byDate;
    return String(b.createdAt).localeCompare(String(a.createdAt));
  });
}

export function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function todayISO(now = new Date()) {
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function daysAgo(dateISO, now = new Date()) {
  const then = new Date(`${dateISO}T00:00:00`);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((today - then) / 86_400_000));
}

export function formatAmount(amount) {
  if (amount === "" || amount == null) return "";
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) return "";
  if (n >= 10_000) {
    const man = n / 10_000;
    return Number.isInteger(man) ? `${man}만 원` : `${man.toFixed(1)}만 원`;
  }
  return `${n.toLocaleString("ko-KR")}원`;
}

export function reasonText(decision) {
  if (!decision) return "";
  if (decision.reason === "기타") return decision.customReason?.trim() || "기타";
  return decision.reason;
}

export function choiceLabel(choice) {
  return choice === "accept" ? "받는다" : "미룬다";
}

export function countChoices(decisions) {
  return decisions.reduce(
    (acc, item) => {
      if (item.choice === "accept") acc.accept += 1;
      if (item.choice === "defer") acc.defer += 1;
      return acc;
    },
    { accept: 0, defer: 0 },
  );
}

export function buildSummary({ treatments, decisions, draft }) {
  const latest = sortNewest(treatments)[0];
  const counts = countChoices(decisions);
  const lines = [];

  if (latest) {
    const amount = formatAmount(latest.amount);
    const amountPart = amount ? `, ${amount}` : "";
    lines.push(`마지막 시술: ${latest.name}, ${daysAgo(latest.date)}일 전${amountPart}`);
  }

  lines.push(`지금까지 남긴 결정: 받음 ${counts.accept} / 미룸 ${counts.defer}`);

  if (draft?.choice) {
    const verb = draft.choice === "accept" ? "받을 이유" : "미룰 이유";
    const why = reasonText(draft);
    lines.push(why ? `이번 초안: ${verb} — ${why}` : `이번 초안: ${choiceLabel(draft.choice)}`);
  } else if (decisions[0]) {
    const latestDecision = sortNewest(decisions)[0];
    lines.push(`이번 초안: ${choiceLabel(latestDecision.choice)} — ${reasonText(latestDecision)}`);
  }

  return lines.join("\n");
}

export function spokenSummary({ treatments, decisions }) {
  const latest = sortNewest(treatments)[0];
  const latestDecision = sortNewest(decisions)[0];
  if (!latest || !latestDecision) return "";

  const amount = formatAmount(latest.amount);
  const amountPart = amount ? `이고 ${amount}이었다` : "이었다";
  return `지난번 ${latest.name}는 ${daysAgo(latest.date)}일 전${amountPart}. ${reasonText(latestDecision)} 때문에 이번엔 ${choiceLabel(latestDecision.choice)}.`;
}
