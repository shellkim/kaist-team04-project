export const STORAGE_KEY = "eunhyehyun.skin-checklist";

export const GROUPS = [
  {
    id: "booster",
    label: "스킨부스터·주사",
    names: ["리쥬란", "쥬베룩", "엑소좀", "물광주사"],
  },
  {
    id: "toning",
    label: "토닝·색소 레이저",
    names: ["피코토닝", "헬리오스", "IPL"],
  },
  {
    id: "ablative",
    label: "강한 레이저·박피",
    names: ["프락셀", "CO2", "점 빼기"],
  },
  {
    id: "toxin",
    label: "보톡스·필러",
    names: ["턱보톡스", "윤곽주사", "필러"],
  },
  {
    id: "energy",
    label: "에너지 리프팅",
    names: ["울쎄라", "슈링크", "인모드"],
  },
];

export const FORECAST_TITLE = "오늘의 피부 일기";
export const FORECAST_ICON = "🌤️";
export const FORECAST_LINE = "자외선 높음 · 습도 낮음";
export const FORECAST_ACTION =
  "오늘은 미스트를 가지고 나가서, 한번 씩 뿌려 주세요.";
export const FORECAST_METRICS = [
  { id: "uv", label: "자외선", value: "7", hint: "높음" },
  { id: "humidity", label: "습도", value: "35%", hint: "낮음" },
  { id: "temp", label: "기온", value: "18°C", hint: "건조" },
];
export const CLEAR_TOAST = "오늘도 자극 없이 완벽하게 케어하셨어요!";
export const UV_TODO = "무기자차 선크림을 2시간마다 덧바르세요.";
export const PERIODS = {
  morning: { id: "morning", label: "아침", time: "", alarm: true },
  midday: { id: "midday", label: "점심", time: "12:30", alarm: false },
  evening: { id: "evening", label: "저녁", time: "", alarm: true },
};
export const ALARM_MAKE = "알림 만들기";
export const ALARM_SAVE = "저장";
export const ADD_TITLE = "오늘 어떤 피부 관리를 받으셨나요?";
export const ADD_SUB =
  "하루에 여러 개를 함께 골라도 됩니다. 일자별 맞춤 케어 플랜을 짜드릴게요.";
export const GROUP_RANK = ["ablative", "booster", "energy", "toxin", "toning"];
export const START_CARE = "맞춤 케어 시작하기";
export const ADD_ANOTHER = "다른 시술 추가";
export const CARE_TITLE = "오늘의 맞춤 케어";
export const CARE_ICON = "📋";
export const AVOID_TITLE = "🚫 오늘 이것만은 피하기";
export const HOSPITAL =
  "💬 피부 상태가 평소와 다르게 불안하신가요? 시술받으신 병원에 문의하시면 가장 정확한 안심을 얻으실 수 있어요.";
export const DISCLAIMER =
  "이 앱은 개인용 케어 가이드이며 의료 진단이나 치료를 대신하지 않습니다. 병원 안내가 있는 경우 항상 병원 지침을 최우선으로 따라주세요.";
export const DEFAULT_HEADLINE = "오늘도 피부 리듬에 맞춰 천천히 가 봐요.";
export const BOOSTER_EARLY_HEADLINE = "오늘도 엠보싱 자극 없이 잘 케어해 봐요!";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MOISTURE_THICK = "보습 크림을 조금 더 두껍게 바르세요.";
const MOISTURE_LAYERS = "수분 크림을 얇게 2~3번 겹쳐 바르세요.";
const MOISTURE_COVER = "당기는 곳에 보습 크림을 덮어 주세요.";
const MOISTURE_OFTEN = "보습을 자주, 얇게 올려 주세요.";

function slot(period, text) {
  return text ? { ...PERIODS[period], text } : null;
}

function pack(n, notes, morning, midday, evening = "") {
  const slots = [slot("morning", morning), slot("midday", midday), slot("evening", evening)].filter(
    Boolean,
  );
  return { slots, dos: slots.map((item) => item.text), notes, n };
}

export function emptyState() {
  return {
    procedures: [],
    checks: { day: "", done: [] },
    alarms: {},
  };
}

export function todayISO(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatHeaderDate(now = new Date()) {
  return `${now.getMonth() + 1}/${now.getDate()}(${WEEKDAYS[now.getDay()]})`;
}

export function daysSince(dateISO, now = new Date()) {
  const then = new Date(`${dateISO}T00:00:00`);
  if (Number.isNaN(then.getTime())) return null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((today - then) / 86_400_000);
}

export function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function findGroup(name) {
  return GROUPS.find((group) => group.names.includes(name)) ?? null;
}

export function allProcedures() {
  return GROUPS.flatMap((group) =>
    group.names.map((name) => ({ name, groupId: group.id, groupLabel: group.label })),
  );
}

export function filterProcedures(query) {
  const q = query.trim().toLowerCase();
  if (!q) return allProcedures();
  return allProcedures().filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.groupLabel.toLowerCase().includes(q),
  );
}

function isAllowedProcedure(procedure) {
  return Boolean(procedure && findGroup(procedure.name));
}

export function asProcedureList(input) {
  if (Array.isArray(input)) return input.filter(isAllowedProcedure);
  if (isAllowedProcedure(input)) return [input];
  return [];
}

function rankOf(procedure) {
  const id = findGroup(procedure.name)?.id;
  const index = GROUP_RANK.indexOf(id);
  return index === -1 ? GROUP_RANK.length : index;
}

export function statusLine(input, now = new Date()) {
  const list = asProcedureList(input);
  if (list.length === 0) return "";
  return list
    .map((procedure) => {
      const n = daysSince(procedure.date, now);
      if (n == null || n < 0) return procedure.name;
      if (n >= 7) return `${procedure.name} 유지`;
      return `${procedure.name} D+${n}`;
    })
    .join(" · ");
}

export function careHeadline(input, now = new Date()) {
  const list = asProcedureList(input);
  const boosterEarly = list.some((procedure) => {
    const group = findGroup(procedure.name);
    const n = daysSince(procedure.date, now);
    return group?.id === "booster" && n != null && n >= 0 && n <= 2;
  });
  if (boosterEarly) return BOOSTER_EARLY_HEADLINE;
  return DEFAULT_HEADLINE;
}

function planFor(procedure, now = new Date()) {
  const n = daysSince(procedure.date, now);
  if (n == null || n < 0) return { slots: [], dos: [], notes: [], n };
  const groupId = findGroup(procedure.name).id;

  if (n >= 7) {
    return pack(n, [], "약산성 거품으로 세안하세요.", UV_TODO);
  }

  const early = n <= 2;
  const plans = {
    booster: early
      ? pack(
          n,
          ["음주 (열감·붓기)", "사우나 (열감)"],
          "약산성 거품으로 세안하세요. 엠보 부위는 문지르지 마세요.",
          UV_TODO,
          MOISTURE_LAYERS,
        )
      : pack(n, ["음주 (열감·붓기)"], "약산성 거품으로 가볍게 세안하세요.", UV_TODO),
    toning: early
      ? pack(
          n,
          ["사우나 (열감)", "강한 마찰"],
          "미온수로 짧게 세안하세요. 붉은 기는 문지르지 마세요.",
          UV_TODO,
          MOISTURE_THICK,
        )
      : pack(n, ["사우나 (열감)"], "미온수로 세안하고, 당기면 보습하세요.", UV_TODO),
    ablative: early
      ? pack(
          n,
          ["사우나 (열감)", "운동으로 땀 흘리기", "음주 (열감·붓기)"],
          "세안은 손끝으로만 하세요. 문지르지 마세요.",
          UV_TODO,
          MOISTURE_OFTEN,
        )
      : pack(n, ["사우나 (열감)"], "미온수로 짧게 세안하세요.", UV_TODO),
    toxin: early
      ? pack(
          n,
          ["시술 당일 눕기·숙이기", "사우나 (열감)", "음주 (열감·붓기)"],
          "세안은 살살 하세요. 시술 부위는 누르지 마세요.",
          UV_TODO,
          MOISTURE_THICK,
        )
      : pack(n, ["사우나 (열감)"], "평소처럼 세안하되, 세게 문지르지 마세요.", UV_TODO),
    energy: early
      ? pack(
          n,
          ["사우나 (열감)", "강한 마사지"],
          "열감이 있으면 차갑게 식히고, 미온수로 세안하세요.",
          UV_TODO,
          MOISTURE_THICK,
        )
      : pack(n, ["사우나 (열감)"], "미온수로 세안하고 보습하세요.", UV_TODO),
  };

  return plans[groupId];
}

function slotById(plan, id) {
  return plan.slots.find((item) => item.id === id) ?? null;
}

function mergePlans(plans) {
  const valid = plans.filter((plan) => plan.n != null && plan.n >= 0);
  if (valid.length === 0) {
    return { slots: [], dos: [], notes: [], n: plans[0]?.n ?? null };
  }
  const notes = [];
  for (const plan of valid) {
    for (const note of plan.notes) {
      if (!notes.includes(note)) notes.push(note);
    }
  }
  const morning = valid.map((plan) => slotById(plan, "morning")).find(Boolean);
  const midday = valid.map((plan) => slotById(plan, "midday")).find(Boolean);
  const evening = valid.map((plan) => slotById(plan, "evening")).find(Boolean);
  const slots = [morning, midday, evening].filter(Boolean);
  return {
    slots,
    dos: slots.map((item) => item.text),
    notes,
    n: Math.min(...valid.map((plan) => plan.n)),
  };
}

export function todayList(input, now = new Date()) {
  const list = asProcedureList(input);
  if (list.length === 0) {
    return { slots: [], dos: [], notes: [], n: null };
  }
  const ranked = [...list].sort((a, b) => rankOf(a) - rankOf(b));
  return mergePlans(ranked.map((procedure) => planFor(procedure, now)));
}

export function progress(list, state, now = new Date()) {
  const today = todayISO(now);
  const total = list.dos.length;
  const done =
    state.checks?.day === today
      ? list.dos.filter((label) => state.checks.done.includes(label)).length
      : 0;
  return { done, total };
}

export function loadState(storage = globalThis.localStorage, now = new Date()) {
  const today = todayISO(now);
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...emptyState(), checks: { day: today, done: [] } };
    }
    const parsed = JSON.parse(raw);
    const fromArray = Array.isArray(parsed.procedures) ? parsed.procedures : [];
    const fromLegacy = isAllowedProcedure(parsed.procedure) ? [parsed.procedure] : [];
    const procedures = (fromArray.length ? fromArray : fromLegacy).filter(isAllowedProcedure);
    const done =
      parsed.checks?.day === today && Array.isArray(parsed.checks.done)
        ? parsed.checks.done.filter((item) => typeof item === "string")
        : [];
    const alarms = {};
    if (parsed.alarms && typeof parsed.alarms === "object") {
      for (const key of Object.keys(PERIODS)) {
        const value = parsed.alarms[key];
        if (typeof value === "string" && /^\d{2}:\d{2}$/.test(value)) {
          alarms[key] = value;
        }
      }
    }
    return { procedures, checks: { day: today, done }, alarms };
  } catch {
    return { ...emptyState(), checks: { day: today, done: [] } };
  }
}

export function saveState(state, storage = globalThis.localStorage) {
  storage?.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function setAlarm(state, period, time) {
  if (!PERIODS[period]) return state;
  const alarms = { ...(state.alarms ?? {}) };
  if (time) alarms[period] = time;
  else delete alarms[period];
  return { ...state, alarms };
}

export function toggleDone(state, label, now = new Date()) {
  const today = todayISO(now);
  const done = state.checks?.day === today ? [...state.checks.done] : [];
  const index = done.indexOf(label);
  if (index >= 0) done.splice(index, 1);
  else done.push(label);
  return { ...state, checks: { day: today, done } };
}

export function allDosClear(list, state, now = new Date()) {
  const { done, total } = progress(list, state, now);
  return total > 0 && done === total;
}
