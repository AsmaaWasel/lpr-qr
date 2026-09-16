"use client";

import { useEffect, useRef } from "react";

import { gateWebSocket, WebSocketMessage } from "@/services/websocket";

type UseGateWebSocketProps = {
  onMessage?: (message: WebSocketMessage) => void;
};

export function useGateWebSocket({ onMessage }: UseGateWebSocketProps = {}) {
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    gateWebSocket.connect();

    const unsubscribe = gateWebSocket.subscribe((message) => {
      onMessageRef.current?.(message);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    send: gateWebSocket.send.bind(gateWebSocket),
    isConnected: gateWebSocket.isConnected(),
  };
}
