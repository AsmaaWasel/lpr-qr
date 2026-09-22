// =====================================================
// WEBSOCKET SERVICE
// =====================================================

export type WebSocketMessage = {
  type: string;
  [key: string]: unknown;
};

type MessageHandler = (message: WebSocketMessage) => void;

class GateWebSocket {
  private socket: WebSocket | null = null;

  private handlers: Set<MessageHandler> = new Set();

  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  private reconnectAttempts = 0;

  private readonly url = "ws://localhost:8000/ws";

  private readonly maxReconnectAttempts = 10;

  private readonly reconnectDelay = 3000;

  // =====================================================
  // CONNECT
  // =====================================================

  connect() {
    // Browser only
    if (typeof window === "undefined") {
      return;
    }

    // Already connected / connecting
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    try {
      console.log("Connecting to WebSocket:", this.url);

      this.socket = new WebSocket(this.url);

      // =================================================
      // OPEN
      // =================================================

      this.socket.onopen = () => {
        console.log("WebSocket connected");

        this.reconnectAttempts = 0;
      };

      // =================================================
      // MESSAGE
      // =================================================

      this.socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          console.log("WebSocket message:", message);

          this.handlers.forEach((handler) => {
            handler(message);
          });
        } catch (error) {
          console.error(
            "Failed to parse WebSocket message:",
            error,
            event.data,
          );
        }
      };

      // =================================================
      // ERROR
      // =================================================

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      // =================================================
      // CLOSE
      // =================================================

      this.socket.onclose = () => {
        console.log("WebSocket disconnected");

        this.socket = null;

        this.reconnect();
      };
    } catch (error) {
      console.error("WebSocket connection failed:", error);

      this.reconnect();
    }
  }

  // =====================================================
  // RECONNECT
  // =====================================================

  private reconnect() {
    if (this.reconnectTimer) {
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Maximum WebSocket reconnect attempts reached");

      return;
    }

    this.reconnectAttempts++;

    console.log(`Reconnecting WebSocket... attempt ${this.reconnectAttempts}`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;

      this.connect();
    }, this.reconnectDelay);
  }

  // =====================================================
  // DISCONNECT
  // =====================================================

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);

      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.close();

      this.socket = null;
    }

    this.reconnectAttempts = 0;
  }

  // =====================================================
  // SUBSCRIBE
  // =====================================================

  subscribe(handler: MessageHandler) {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
  }

  // =====================================================
  // SEND
  // =====================================================

  send(message: WebSocketMessage) {
    if (!this.socket) {
      console.warn("WebSocket is not initialized");

      return false;
    }

    if (this.socket.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket is not connected");

      return false;
    }

    this.socket.send(JSON.stringify(message));

    return true;
  }

  // =====================================================
  // STATUS
  // =====================================================

  isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

export const gateWebSocket = new GateWebSocket();
