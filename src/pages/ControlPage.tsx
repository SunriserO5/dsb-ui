import {
  Circle,
  Clock3,
  ListPlus,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Save,
  ScreenShare,
  TimerReset,
  Waves,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLiveState } from "../hooks/useLiveState";
import type { LiveState, Scene } from "../types";
import { formatTimer, getTimerMs, parseTimerText } from "../utils/timer";

function setAt<T>(items: T[], index: number, value: T) {
  return items.map((item, itemIndex) => (itemIndex === index ? value : item));
}

export function ControlPage() {
  const { state, status, updateState } = useLiveState();
  const isConnected = status === "connected";
  const [timerInput, setTimerInput] = useState("00:00:00");
  const [now, setNow] = useState(Date.now());

  const timerText = useMemo(
    () => formatTimer(getTimerMs(state.match.supportTimer, now)),
    [state.match.supportTimer, now],
  );

  useEffect(() => {
    if (state.match.supportTimer.running) {
      const interval = window.setInterval(() => setNow(Date.now()), 33);
      return () => window.clearInterval(interval);
    }
  }, [state.match.supportTimer.running, state.match.supportTimer.startedAt]);

  useEffect(() => {
    if (state.match.supportTimer.running) {
      return;
    }

    setTimerInput(timerText);
  }, [
    state.match.supportTimer.baseMs,
    state.match.supportTimer.running,
    timerText,
  ]);

  function patch(patchState: Partial<LiveState>) {
    updateState({
      ...state,
      ...patchState,
      match: { ...state.match, ...patchState.match },
      player: { ...state.player, ...patchState.player },
      team: { ...state.team, ...patchState.team },
    });
  }

  function setScene(scene: Scene) {
    patch({ scene });
  }

  function setTimerFromInput() {
    const ms = parseTimerText(timerInput);
    if (ms === null) {
      setTimerInput(timerText);
      return;
    }

    patch({
      match: {
        ...state.match,
        supportTimer: {
          baseMs: ms,
          startedAt: null,
          running: false,
        },
      },
    });
  }

  function startTimer() {
    const inputMs = parseTimerText(timerInput);
    const baseMs = state.match.supportTimer.running
      ? getTimerMs(state.match.supportTimer)
      : inputMs ?? getTimerMs(state.match.supportTimer);
    if (baseMs <= 0) {
      setTimerInput(timerText);
      return;
    }

    patch({
      match: {
        ...state.match,
        supportTimer: {
          baseMs,
          startedAt: new Date().toISOString(),
          running: true,
        },
      },
    });
  }

  function pauseTimer() {
    patch({
      match: {
        ...state.match,
        supportTimer: {
          baseMs: getTimerMs(state.match.supportTimer),
          startedAt: null,
          running: false,
        },
      },
    });
  }

  function resetTimer() {
    patch({
      match: {
        ...state.match,
        supportTimer: {
          baseMs: 0,
          startedAt: null,
          running: false,
        },
      },
    });
  }

  return (
    <main className="control-page">
      <section className="control-shell">
        <header className="control-header">
          <div>
            <p className="control-kicker">Caerula Arbor</p>
            <h1>导播控制台</h1>
          </div>
          <div className={`connection-pill ${status}`}>
            <Circle size={14} fill="currentColor" />
            <span>{isConnected ? "已连接" : status === "connecting" ? "连接中" : "未连接"}</span>
          </div>
        </header>

        <section className="control-panel scene-panel" aria-label="场景切换">
          <button
            type="button"
            className={state.scene === "live" ? "scene-button active" : "scene-button"}
            onClick={() => setScene("live")}
          >
            <ScreenShare size={22} />
            <span>比赛画面</span>
          </button>
          <button
            type="button"
            className={state.scene === "standby" ? "scene-button active" : "scene-button"}
            onClick={() => setScene("standby")}
          >
            <Waves size={22} />
            <span>待机画面</span>
          </button>
        </section>

        <div className="control-grid">
          <section className="control-panel">
            <div className="panel-title">
              <Radio size={18} />
              <h2>赛事信息</h2>
            </div>
            <label>
              <span>赛事标题</span>
              <input
                value={state.match.eventTitle}
                onChange={(event) =>
                  patch({ match: { ...state.match, eventTitle: event.target.value } })
                }
              />
            </label>
            <label>
              <span>阶段标题</span>
              <input
                value={state.match.roundTitle}
                onChange={(event) =>
                  patch({ match: { ...state.match, roundTitle: event.target.value } })
                }
              />
            </label>
            <label>
              <span>本场解说</span>
              <input
                value={state.match.caster}
                onChange={(event) =>
                  patch({ match: { ...state.match, caster: event.target.value } })
                }
              />
            </label>
            <label>
              <span>支援倒计时</span>
              <div className="timer-editor">
                <input
                  value={state.match.supportTimer.running ? timerText : timerInput}
                  onChange={(event) => setTimerInput(event.target.value)}
                  onBlur={setTimerFromInput}
                  disabled={state.match.supportTimer.running}
                  inputMode="numeric"
                  placeholder="00:00:00"
                />
                <button type="button" onClick={setTimerFromInput}>
                  <TimerReset size={16} />
                  <span>设置</span>
                </button>
                {state.match.supportTimer.running ? (
                  <button type="button" onClick={pauseTimer}>
                    <Pause size={16} />
                    <span>暂停</span>
                  </button>
                ) : (
                  <button type="button" onClick={startTimer}>
                    <Play size={16} />
                    <span>开始</span>
                  </button>
                )}
                <button type="button" onClick={resetTimer}>
                  <RotateCcw size={16} />
                  <span>清零</span>
                </button>
              </div>
            </label>
          </section>

          <section className="control-panel">
            <div className="panel-title">
              <Save size={18} />
              <h2>当前选手</h2>
            </div>
            <label>
              <span>选手名称</span>
              <input
                value={state.player.name}
                onChange={(event) =>
                  patch({ player: { ...state.player, name: event.target.value } })
                }
              />
            </label>
            <label>
              <span>所属队伍</span>
              <input
                value={state.player.team}
                onChange={(event) => {
                  const team = event.target.value;
                  updateState({
                    ...state,
                    updatedAt: new Date().toISOString(),
                    player: { ...state.player, team },
                    team: { ...state.team, name: team },
                  });
                }}
              />
            </label>
            <label>
              <span>头像占位文字</span>
              <input
                value={state.player.avatarLabel}
                onChange={(event) =>
                  patch({ player: { ...state.player, avatarLabel: event.target.value } })
                }
              />
            </label>
            <label>
              <span>待机提示</span>
              <textarea
                value={state.match.standbyPrompt}
                onChange={(event) =>
                  patch({ match: { ...state.match, standbyPrompt: event.target.value } })
                }
              />
            </label>
          </section>

          <section className="control-panel team-editor">
            <div className="panel-title">
              <ListPlus size={18} />
              <h2>右侧信息栏</h2>
            </div>
            {state.team.members.map((member, index) => (
              <div className="member-row" key={`${member.label}-${index}`}>
                <input
                  aria-label={`条目 ${index + 1} 标题`}
                  value={member.label}
                  onChange={(event) =>
                    patch({
                      team: {
                        ...state.team,
                        members: setAt(state.team.members, index, {
                          ...member,
                          label: event.target.value,
                        }),
                      },
                    })
                  }
                />
                <input
                  aria-label={`条目 ${index + 1} 内容`}
                  value={member.value}
                  onChange={(event) =>
                    patch({
                      team: {
                        ...state.team,
                        members: setAt(state.team.members, index, {
                          ...member,
                          value: event.target.value,
                        }),
                      },
                    })
                  }
                />
              </div>
            ))}
          </section>

          <section className="control-panel status-panel">
            <div className="panel-title">
              <Clock3 size={18} />
              <h2>同步状态</h2>
            </div>
            <dl>
              <div>
                <dt>当前场景</dt>
                <dd>{state.scene === "live" ? "比赛画面" : "待机画面"}</dd>
              </div>
              <div>
                <dt>最后同步</dt>
                <dd>{new Date(state.updatedAt).toLocaleTimeString("zh-CN")}</dd>
              </div>
              <div>
                <dt>状态服务</dt>
                <dd>{isConnected ? "ws://localhost:8787" : "等待重连"}</dd>
              </div>
            </dl>
          </section>
        </div>
      </section>
    </main>
  );
}
