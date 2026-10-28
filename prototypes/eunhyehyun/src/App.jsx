import { useMemo, useState } from "react";
import {
  ADD_ANOTHER,
  ADD_SUB,
  ADD_TITLE,
  ALARM_MAKE,
  ALARM_SAVE,
  AVOID_TITLE,
  CARE_ICON,
  CARE_TITLE,
  CLEAR_TOAST,
  DISCLAIMER,
  FORECAST_ACTION,
  FORECAST_ICON,
  FORECAST_METRICS,
  FORECAST_TITLE,
  GROUPS,
  HOSPITAL,
  START_CARE,
  allDosClear,
  setAlarm,
  careHeadline,
  createId,
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

function persist(next) {
  saveState(next);
  return next;
}

export function App() {
  const [state, setState] = useState(() => loadState());
  const [modalOpen, setModalOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [alarmSlot, setAlarmSlot] = useState(null);
  const list = useMemo(() => todayList(state.procedures), [state.procedures]);
  const { done, total } = progress(list, state);
  const clear = allDosClear(list, state);

  function onToggle(label) {
    setState((prev) => {
      const next = persist(toggleDone(prev, label));
      const nextClear = allDosClear(todayList(next.procedures), next);
      queueMicrotask(() => setToastOpen(nextClear));
      return next;
    });
  }

  function onSaveProcedures(procedures) {
    setState((prev) =>
      persist({
        ...prev,
        procedures,
        checks: { day: todayISO(), done: [] },
      }),
    );
    setModalOpen(false);
  }

  if (!state.procedures?.length) {
    return (
      <div className="page">
        <header className="brand">
          <p className="eyebrow">{formatHeaderDate()}</p>
          <h1>{ADD_TITLE}</h1>
          <p className="lede">{ADD_SUB}</p>
        </header>
        <ProcedureForm defaultDate={todayISO()} onSave={onSaveProcedures} />
        <footer className="disclaimer">{DISCLAIMER}</footer>
      </div>
    );
  }

  return (
    <div className="page home">
      <header className="brand">
        <h1>
          {formatHeaderDate()} · {statusLine(state.procedures)}
        </h1>
        <p className="lede">{careHeadline(state.procedures)}</p>
      </header>

      <section className="card forecast" aria-label={FORECAST_TITLE}>
        <div className="forecast-head">
          <p className="section-label">
            <span className="section-icon" aria-hidden="true">
              {FORECAST_ICON}
            </span>
            {FORECAST_TITLE}
            <span className="tag">예시</span>
          </p>
        </div>
        <div className="metrics">
          {FORECAST_METRICS.map((metric) => (
            <div key={metric.id} className={`metric metric-${metric.id}`}>
              <p className="metric-label">{metric.label}</p>
              <p className="metric-value">{metric.value}</p>
              <p className="metric-hint">{metric.hint}</p>
            </div>
          ))}
        </div>
        <p className="forecast-action">{FORECAST_ACTION}</p>
      </section>

      <section className="card care" aria-label={CARE_TITLE}>
        {list.notes.length > 0 ? (
          <div className="avoid" aria-label={AVOID_TITLE}>
            <p className="avoid-title">{AVOID_TITLE}</p>
            <p className="avoid-body">{list.notes.join(" · ")}</p>
          </div>
        ) : null}

        <p className="section-label">
          <span className="section-icon" aria-hidden="true">
            {CARE_ICON}
          </span>
          {CARE_TITLE} ({done}/{total} 완료)
        </p>
        {clear ? (
          <p className="all-clear" role="status">
            오늘 케어 All Clear
          </p>
        ) : null}
        <ul className="todo-list">
          {list.slots.map((item) => {
            const checked = state.checks.done.includes(item.text);
            const customTime = state.alarms?.[item.id];
            return (
              <li key={item.id} className="slot">
                <div className="slot-meta">
                  <span className="slot-period">{item.label}</span>
                  {item.alarm ? (
                    <button
                      type="button"
                      className={customTime ? "slot-time" : "slot-bell"}
                      aria-label={`${item.label} ${ALARM_MAKE}`}
                      onClick={() => setAlarmSlot(item)}
                    >
                      <span aria-hidden="true">🔔</span>
                      {customTime ? customTime : null}
                    </button>
                  ) : (
                    <span className="slot-time">
                      <span aria-hidden="true">🔔</span>
                      {item.time}
                    </span>
                  )}
                </div>
                <label className={checked ? "todo done" : "todo"}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(item.text)}
                  />
                  <span>{item.text}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      {list.n != null && list.n <= 6 ? <p className="hospital">{HOSPITAL}</p> : null}

      <button type="button" className="fab" onClick={() => setModalOpen(true)}>
        <span className="fab-plus">+</span>
        {ADD_ANOTHER}
      </button>

      {modalOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setModalOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-labelledby="add-procedure-title"
            onClick={(event) => event.stopPropagation()}
          >
            <ProcedureForm
              titleId="add-procedure-title"
              defaultDate={todayISO()}
              onSave={onSaveProcedures}
              onCancel={() => setModalOpen(false)}
            />
          </div>
        </div>
      ) : null}

      {alarmSlot ? (
        <AlarmForm
          slot={alarmSlot}
          initial={state.alarms?.[alarmSlot.id] ?? ""}
          onSave={(time) => {
            setState((prev) => persist(setAlarm(prev, alarmSlot.id, time)));
            setAlarmSlot(null);
          }}
          onCancel={() => setAlarmSlot(null)}
        />
      ) : null}

      {toastOpen ? (
        <p className="toast" role="status">
          {CLEAR_TOAST}
        </p>
      ) : null}

      <footer className="disclaimer">{DISCLAIMER}</footer>
    </div>
  );
}

function AlarmForm({ slot, initial, onSave, onCancel }) {
  const [time, setTime] = useState(initial || "08:00");

  function submit(event) {
    event.preventDefault();
    if (!time) return;
    onSave(time);
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-labelledby="alarm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <form className="card form" onSubmit={submit}>
          <p className="section-label" id="alarm-title">
            {slot.label} {ALARM_MAKE}
          </p>
          <label>
            시각
            <input
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              required
            />
          </label>
          <p className="alarm-note">알림은 예시입니다. 실제 푸시는 보내지 않습니다.</p>
          <div className="form-actions split">
            <button type="button" className="ghost" onClick={onCancel}>
              닫기
            </button>
            <button type="submit">{ALARM_SAVE}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProcedureForm({ titleId, defaultDate, onSave, onCancel }) {
  const [date, setDate] = useState(defaultDate);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const matches = filterProcedures(query);

  function toggleName(name) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name],
    );
  }

  function submit(event) {
    event.preventDefault();
    if (!date || selected.length === 0) return;
    const createdAt = new Date().toISOString();
    onSave(
      selected.map((name) => ({
        id: createId(),
        date,
        name,
        groupId: findGroup(name).id,
        createdAt,
      })),
    );
  }

  return (
    <form className="card form add-procedure" onSubmit={submit}>
      <p className="section-label" id={titleId}>
        받으신 시술
      </p>
      <label>
        시술 찾기
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="리쥬란, 피코토닝…"
        />
      </label>
      {GROUPS.map((group) => {
        const names = group.names.filter((name) =>
          matches.some((item) => item.name === name),
        );
        if (names.length === 0) return null;
        return (
          <fieldset key={group.id} className="chip-group">
            <legend>{group.label}</legend>
            <div className="chips">
              {names.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={selected.includes(name) ? "chip selected" : "chip"}
                  aria-pressed={selected.includes(name)}
                  onClick={() => toggleName(name)}
                >
                  {name}
                </button>
              ))}
            </div>
          </fieldset>
        );
      })}
      <label>
        시술받은 날
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
        />
      </label>
      <div className={onCancel ? "form-actions split" : "form-actions"}>
        {onCancel ? (
          <button type="button" className="ghost" onClick={onCancel}>
            닫기
          </button>
        ) : null}
        <button type="submit" disabled={selected.length === 0}>
          {START_CARE}
        </button>
      </div>
    </form>
  );
}
