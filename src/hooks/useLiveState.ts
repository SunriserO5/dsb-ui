import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { defaultState } from "../defaultState";
import type { ConnectionStatus, LiveState } from "../types";

function getDefaultWsUrl() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const hostname = window.location.hostname || "localhost";

  if (window.location.port === "5173") {
    return `${protocol}//${hostname}:8787`;
  }

  return `${protocol}//${window.location.host}`;
}

const WS_URL = import.meta.env.VITE_WS_URL ?? getDefaultWsUrl();

export function useLiveState() {
  const [state, setState] = useState<LiveState>(defaultState);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const socketRef = useRef<WebSocket | null>(null);
  const retryRef = useRef<number | null>(null);

  useEffect(() => {
    let disposed = false;

    function connect() {
      setStatus("connecting");
      const socket = new WebSocket(WS_URL);
      socketRef.current = socket;

      socket.addEventListener("open", () => {
        if (!disposed) {
          setStatus("connected");
        }
      });

      socket.addEventListener("message", (event) => {
        const payload = JSON.parse(event.data);
        if (payload.type === "state") {
          setState(payload.state);
        }
      });

      socket.addEventListener("close", () => {
        if (disposed) {
          return;
        }
        setStatus("disconnected");
        retryRef.current = window.setTimeout(connect, 1200);
      });

      socket.addEventListener("error", () => {
        socket.close();
      });
    }

    connect();

    return () => {
      disposed = true;
      if (retryRef.current) {
        window.clearTimeout(retryRef.current);
      }
      socketRef.current?.close();
    };
  }, []);

  const updateState = useCallback((nextState: LiveState) => {
    const payload: LiveState = {
      ...nextState,
      updatedAt: new Date().toISOString(),
    };
    setState(payload);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "update", state: payload }));
    }
  }, []);

  return useMemo(
    () => ({ state, status, updateState }),
    [state, status, updateState],
  );
}
