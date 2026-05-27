import type { SupportTimer } from "../types";

export function parseTimerText(value: string) {
  const parts = value
    .trim()
    .split(":")
    .map((part) => Number(part));

  if (parts.some((part) => !Number.isFinite(part) || part < 0)) {
    return null;
  }

  if (parts.length === 1) {
    return Math.floor(parts[0] * 60 * 1000);
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return Math.floor((minutes * 60 + seconds) * 1000);
  }

  if (parts.length === 3) {
    const [minutes, seconds, centiseconds] = parts;
    return Math.floor((minutes * 60 + seconds) * 1000 + centiseconds * 10);
  }

  return null;
}

export function formatTimer(ms: number) {
  const normalized = Math.max(0, Math.floor(ms));
  const minutes = Math.floor(normalized / 60000);
  const restSeconds = Math.floor((normalized % 60000) / 1000);
  const centiseconds = Math.floor((normalized % 1000) / 10);

  return [minutes, restSeconds, centiseconds]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

export function getTimerMs(timer: SupportTimer, now = Date.now()) {
  if (!timer.running || !timer.startedAt) {
    return timer.baseMs;
  }

  const startedAt = Date.parse(timer.startedAt);
  if (!Number.isFinite(startedAt)) {
    return timer.baseMs;
  }

  return Math.max(0, timer.baseMs - Math.max(0, now - startedAt));
}
