import { useMemo, useState } from "react";
import {
  REASONS,
  buildSummary,
  choiceLabel,
  createId,
  emptyState,
  formatAmount,
  loadState,
  reasonText,
  saveState,
  sortNewest,
  spokenSummary,
  todayISO,
} from "./storage.js";

function persist(next) {
  saveState(next);
  return next;
}

export function App() {
  const [state, setState] = useState(() => loadState());
  const [screen, setScreen] = useState("home");
  const [savedSummary, setSavedSummary] = useState("");

  const treatments = useMemo(() => sortNewest(state.treatments), [state.treatments]);
  const decisions = useMemo(() => sortNewest(state.decisions), [state.decisions]);
  const latestTreatment = treatments[0];
  const latestDecision = decisions[0];

  function addTreatment(treatment) {
    setState((prev) =>
      persist({
        ...prev,
        treatments: [...prev.treatments, treatment],
      }),
    );
    setScreen("home");
  }

  function addDecision(decision) {
    setState((prev) =>
      persist({
        ...prev,
        decisions: [...prev.decisions, decision],
      }),
    );
    setSavedSummary(decision.summary);
    setScreen("saved");
  }

  if (treatments.length === 0) {
    return (
      <Shell>
        <EmptyTreatment onSave={addTreatment} />
      </Shell>
    );
  }

  if (screen === "add") {
    return (
      <Shell>
        <TreatmentForm
          title="시술 추가"
          onSave={addTreatment}
          onCancel={() => setScreen("home")}
        />
      </Shell>
    );
  }

  if (screen === "decide") {
    return (
      <Shell>
        <DecisionCard
          treatments={treatments}
          decisions={decisions}
          onSave={addDecision}
          onCancel={() => setScreen("home")}
        />
      </Shell>
    );
  }

  if (screen === "saved") {
    return (
      <Shell>
        <SavedView
          summary={savedSummary}
          spoken={spokenSummary({ treatments, decisions })}
          onHome={() => setScreen("home")}
        />
      </Shell>
    );
  }

  return (
    <Shell>
      <Home
        treatments={treatments}
        decisions={decisions}
        latestTreatment={latestTreatment}
        latestDecision={latestDecision}
        onDecide={() => setScreen("decide")}
        onAdd={() => setScreen("add")}
      />
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div className="page">
      <header className="brand">
        <p className="eyebrow">나만 보는 기록</p>
        <h1>지금 받을 이유 / 미룰 이유</h1>
      </header>
      {children}
    </div>
  );
}

function EmptyTreatment({ onSave }) {
  return (
    <section className="card">
      <p className="lede">병원 상담 전에, 내 이력으로 결정한다.</p>
      <p className="empty-prompt">마지막 시술 하나만 적어 주세요.</p>
      <TreatmentForm onSave={onSave} submitLabel="시술 저장" />
    </section>
  );
}

function Home({ treatments, decisions, latestTreatment, latestDecision, onDecide, onAdd }) {
  const summary = buildSummary({
    treatments,
    decisions,
    draft: latestDecision,
  });

  return (
    <section className="card">
      <p className="section-label">상담 전에 보는 요약</p>
      <pre className="summary">{summary}</pre>
      {latestDecision ? (
        <p className="spoken">{spokenSummary({ treatments, decisions: [latestDecision] })}</p>
      ) : (
        <p className="hint">아직 결정이 없습니다. 이력을 보고 이번엔 받을지 미룰지 남겨 주세요.</p>
      )}

      <article className="block">
        <p className="section-label">마지막 시술</p>
        <TreatmentLine treatment={latestTreatment} />
      </article>

      <article className="block">
        <p className="section-label">마지막 결정</p>
        {latestDecision ? (
          <p className="line">
            {latestDecision.date} · {choiceLabel(latestDecision.choice)} · {reasonText(latestDecision)}
          </p>
        ) : (
          <p className="muted">없음</p>
        )}
      </article>

      <div className="actions">
        <button type="button" className="primary" onClick={onDecide}>
          지금 결정하기
        </button>
        <button type="button" className="ghost" onClick={onAdd}>
          시술 추가
        </button>
      </div>
    </section>
  );
}

function TreatmentForm({ title, onSave, onCancel, submitLabel = "저장" }) {
  const [date, setDate] = useState(todayISO());
  const [name, setName] = useState("");
  const [clinic, setClinic] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim()) {
      setError("시술명을 적어 주세요.");
      return;
    }
    if (!date) {
      setError("날짜를 선택해 주세요.");
      return;
    }
    onSave({
      id: createId(),
      date,
      name: name.trim(),
      clinic: clinic.trim(),
      amount: amount === "" ? "" : Number(amount),
      note: note.trim(),
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {title ? <h2>{title}</h2> : null}
      <label>
        날짜
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </label>
      <label>
        시술명
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="보톡스, 스킨부스터, 리쥬란"
          required
        />
      </label>
      <label>
        병원명 <span className="optional">선택</span>
        <input value={clinic} onChange={(e) => setClinic(e.target.value)} />
      </label>
      <label>
        금액 <span className="optional">선택</span>
        <input
          type="number"
          min="0"
          step="1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="480000"
        />
      </label>
      <label>
        그때 왜 받았는지
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="한 줄이면 됩니다" />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <div className="actions">
        <button type="submit" className="primary">
          {submitLabel}
        </button>
        {onCancel ? (
          <button type="button" className="ghost" onClick={onCancel}>
            취소
          </button>
        ) : null}
      </div>
    </form>
  );
}

function DecisionCard({ treatments, decisions, onSave, onCancel }) {
  const recent = treatments.slice(0, 3);
  const [choice, setChoice] = useState("");
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [summary, setSummary] = useState(() =>
    buildSummary({ treatments, decisions, draft: null }),
  );
  const [error, setError] = useState("");

  function refreshSummary(nextChoice, nextReason, nextCustom) {
    setSummary(
      buildSummary({
        treatments,
        decisions,
        draft: nextChoice
          ? { choice: nextChoice, reason: nextReason, customReason: nextCustom }
          : null,
      }),
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!choice) {
      setError("받는다 또는 미룬다를 골라 주세요.");
      return;
    }
    if (!reason) {
      setError("이유를 골라 주세요.");
      return;
    }
    if (reason === "기타" && !customReason.trim()) {
      setError("기타 이유를 적어 주세요.");
      return;
    }
    const decision = {
      id: createId(),
      date: todayISO(),
      choice,
      reason,
      customReason: reason === "기타" ? customReason.trim() : "",
      summary: summary.trim(),
      createdAt: new Date().toISOString(),
    };
    onSave(decision);
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>지금 결정하기</h2>
      <p className="section-label">상담 전에 보는 요약</p>
      <textarea
        className="summary-edit"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        rows={4}
      />

      <p className="section-label">최근 이력</p>
      <ul className="history">
        {recent.map((item) => (
          <li key={item.id}>
            <TreatmentLine treatment={item} />
          </li>
        ))}
      </ul>

      <fieldset>
        <legend>이번엔</legend>
        <div className="choice-row">
          <ChoiceButton
            selected={choice === "accept"}
            onClick={() => {
              setChoice("accept");
              refreshSummary("accept", reason, customReason);
            }}
          >
            받는다
          </ChoiceButton>
          <ChoiceButton
            selected={choice === "defer"}
            onClick={() => {
              setChoice("defer");
              refreshSummary("defer", reason, customReason);
            }}
          >
            미룬다
          </ChoiceButton>
        </div>
      </fieldset>

      <fieldset>
        <legend>이유</legend>
        {REASONS.map((item) => (
          <label key={item} className="radio">
            <input
              type="radio"
              name="reason"
              value={item}
              checked={reason === item}
              onChange={() => {
                setReason(item);
                refreshSummary(choice, item, customReason);
              }}
            />
            {item}
          </label>
        ))}
        {reason === "기타" ? (
          <input
            value={customReason}
            onChange={(e) => {
              setCustomReason(e.target.value);
              refreshSummary(choice, "기타", e.target.value);
            }}
            placeholder="직접 입력"
          />
        ) : null}
      </fieldset>

      {error ? <p className="error">{error}</p> : null}
      <div className="actions">
        <button type="submit" className="primary">
          결정 저장
        </button>
        <button type="button" className="ghost" onClick={onCancel}>
          취소
        </button>
      </div>
    </form>
  );
}

function SavedView({ summary, spoken, onHome }) {
  return (
    <section className="card">
      <p className="section-label">저장된 한 줄</p>
      <pre className="summary">{summary}</pre>
      {spoken ? <p className="spoken">{spoken}</p> : null}
      <p className="hint">공유는 없습니다. 다음에 앱을 열면 이 문장이 홈에 있습니다.</p>
      <div className="actions">
        <button type="button" className="primary" onClick={onHome}>
          홈으로
        </button>
      </div>
    </section>
  );
}

function TreatmentLine({ treatment }) {
  const amount = formatAmount(treatment.amount);
  return (
    <div>
      <p className="line">
        {treatment.date} · {treatment.name}
        {amount ? ` · ${amount}` : ""}
        {treatment.clinic ? ` · ${treatment.clinic}` : ""}
      </p>
      {treatment.note ? <p className="muted">그때: {treatment.note}</p> : null}
    </div>
  );
}

function ChoiceButton({ selected, onClick, children }) {
  return (
    <button
      type="button"
      className={selected ? "choice selected" : "choice"}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
