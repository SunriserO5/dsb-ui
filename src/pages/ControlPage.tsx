import {
  Circle,
  Clock3,
  ListPlus,
  Palette,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Save,
  ScreenShare,
  TimerReset,
  Waves,
} from "lucide-react";
import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { useLiveState } from "../hooks/useLiveState";
import { caerulaAssets, themeList } from "../theme/assets";
import type { LiveState, Scene, SupportTimer, ThemeId } from "../types";
import { ImagePicker } from "../ui/ImagePicker";
import { ImageUploader } from "../ui/ImageUploader";
import { formatTimer, getTimerMs, parseTimerText } from "../utils/timer";

type TimerKey = "supportTimer" | "standbyTimer";

function setAt<T>(items: T[], index: number, value: T) {
  return items.map((item, itemIndex) => (itemIndex === index ? value : item));
}

export function ControlPage() {
  const { state, status, updateState } = useLiveState();
  const isConnected = status === "connected";
  const [supportTimerInput, setSupportTimerInput] = useState("00:00:00");
  const [standbyTimerInput, setStandbyTimerInput] = useState("00:00:00");
  const [now, setNow] = useState(Date.now());

  const supportTimerText = useMemo(
    () => formatTimer(getTimerMs(state.match.supportTimer, now)),
    [state.match.supportTimer, now],
  );
  const standbyTimerText = useMemo(
    () => formatTimer(getTimerMs(state.match.standbyTimer, now)),
    [state.match.standbyTimer, now],
  );

  useEffect(() => {
    if (state.match.supportTimer.running || state.match.standbyTimer.running) {
      const interval = window.setInterval(() => setNow(Date.now()), 33);
      return () => window.clearInterval(interval);
    }
  }, [
    state.match.supportTimer.running,
    state.match.supportTimer.startedAt,
    state.match.standbyTimer.running,
    state.match.standbyTimer.startedAt,
  ]);

  useEffect(() => {
    if (state.match.supportTimer.running) {
      return;
    }

    setSupportTimerInput(supportTimerText);
  }, [
    state.match.supportTimer.running,
    state.match.supportTimer.baseMs,
    supportTimerText,
  ]);

  useEffect(() => {
    if (state.match.standbyTimer.running) {
      return;
    }

    setStandbyTimerInput(standbyTimerText);
  }, [
    state.match.standbyTimer.running,
    state.match.standbyTimer.baseMs,
    standbyTimerText,
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

  function setTheme(theme: ThemeId) {
    patch({ theme });
  }

  function updateTimer(timerKey: TimerKey, timer: SupportTimer) {
    patch({
      match: {
        ...state.match,
        [timerKey]: timer,
      },
    });
  }

  function setTimerFromInput(
    timerKey: TimerKey,
    input: string,
    fallbackText: string,
    setInput: (value: string) => void,
  ) {
    const ms = parseTimerText(input);
    if (ms === null) {
      setInput(fallbackText);
      return;
    }

    updateTimer(timerKey, {
      baseMs: ms,
      startedAt: null,
      running: false,
    });
  }

  function startTimer(
    timerKey: TimerKey,
    input: string,
    fallbackText: string,
    setInput: (value: string) => void,
  ) {
    const timer = state.match[timerKey];
    const inputMs = parseTimerText(input);
    const baseMs = timer.running
      ? getTimerMs(timer)
      : inputMs ?? getTimerMs(timer);
    if (baseMs <= 0) {
      setInput(fallbackText);
      return;
    }

    updateTimer(timerKey, {
      baseMs,
      startedAt: new Date().toISOString(),
      running: true,
    });
  }

  function pauseTimer(timerKey: TimerKey) {
    updateTimer(timerKey, {
      baseMs: getTimerMs(state.match[timerKey]),
      startedAt: null,
      running: false,
    });
  }

  function resetTimer(timerKey: TimerKey) {
    updateTimer(timerKey, {
      baseMs: 0,
      startedAt: null,
      running: false,
    });
  }

  function renderTimerEditor(
    timerKey: TimerKey,
    input: string,
    text: string,
    setInput: (value: string) => void,
  ) {
    const timer = state.match[timerKey];

    return (
      <div className="timer-editor">
        <input
          value={timer.running ? text : input}
          onChange={(event) => setInput(event.target.value)}
          onBlur={() => setTimerFromInput(timerKey, input, text, setInput)}
          disabled={timer.running}
          inputMode="numeric"
          placeholder="00:00:00"
        />
        <button
          type="button"
          onClick={() => setTimerFromInput(timerKey, input, text, setInput)}
        >
          <TimerReset size={16} />
          <span>设置</span>
        </button>
        {timer.running ? (
          <button type="button" onClick={() => pauseTimer(timerKey)}>
            <Pause size={16} />
            <span>暂停</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => startTimer(timerKey, input, text, setInput)}
          >
            <Play size={16} />
            <span>开始</span>
          </button>
        )}
        <button type="button" onClick={() => resetTimer(timerKey)}>
          <RotateCcw size={16} />
          <span>清零</span>
        </button>
      </div>
    );
  }

  return (
    <main className="control-page">
      <section className="control-shell">
        <header className="control-header">
          <div className="control-title">
            <img src={caerulaAssets.icon} alt="" />
            <div>
            <p className="control-kicker">Caerula Arbor</p>
            <h1>导播控制台</h1>
            </div>
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

        <section className="control-panel theme-panel" aria-label="主题切换">
          <div className="panel-title">
            <Palette size={18} />
            <h2>直播主题</h2>
          </div>
          <div className="theme-switcher">
            {themeList.map((theme) => (
              <button
                type="button"
                key={theme.id}
                className={state.theme === theme.id ? "theme-button active" : "theme-button"}
                style={{ "--theme-preview": theme.accent } as CSSProperties}
                onClick={() => setTheme(theme.id)}
              >
                <span>{theme.shortName}</span>
                <strong>{theme.name}</strong>
              </button>
            ))}
          </div>
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
              {renderTimerEditor(
                "supportTimer",
                supportTimerInput,
                supportTimerText,
                setSupportTimerInput,
              )}
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
            <ImageUploader
              label="选手头像"
              value={state.player.avatarUrl}
              onChange={(avatarUrl) =>
                patch({ player: { ...state.player, avatarUrl } })
              }
            />
            <label>
              <span>待机提示</span>
              <textarea
                value={state.match.standbyPrompt}
                onChange={(event) =>
                  patch({ match: { ...state.match, standbyPrompt: event.target.value } })
                }
              />
            </label>
            <label>
              <span>待机倒计时</span>
              {renderTimerEditor(
                "standbyTimer",
                standbyTimerInput,
                standbyTimerText,
                setStandbyTimerInput,
              )}
            </label>
          </section>

          <section className="control-panel team-editor">
            <div className="panel-title">
              <ListPlus size={18} />
              <h2>右侧信息栏</h2>
            </div>
            <div className="avatar-editor-grid">
              <ImageUploader
                label="战队头像"
                value={state.team.avatarUrl}
                onChange={(avatarUrl) =>
                  patch({ team: { ...state.team, avatarUrl } })
                }
              />
              <ImagePicker
                label="开局干员头像"
                value={state.team.openingOperatorAvatarUrl}
                onChange={(openingOperatorAvatarUrl) =>
                  patch({ team: { ...state.team, openingOperatorAvatarUrl } })
                }
              />
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
                <dt>待机倒计时</dt>
                <dd>{standbyTimerText}</dd>
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
