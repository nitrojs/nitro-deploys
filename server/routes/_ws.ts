import { defineWebSocketHandler } from "nitro";

// Simple echo / ping-pong WebSocket handler used by the `websocket` test.
export default defineWebSocketHandler({
  upgrade(request) {
    // Capture query params from the upgrade URL so the client can verify them.
    const params = Object.fromEntries(new URL(request.url).searchParams);
    return {
      context: { params },
    };
  },
  open(peer) {
    console.log("[ws] open", peer.id, peer.context.params);
  },
  message(peer, message) {
    const text = message.text();
    if (text === "ping") {
      peer.send("pong");
    } else if (text === "params") {
      peer.send(JSON.stringify(peer.context.params));
    } else {
      peer.send(text);
    }
  },
  close(peer) {
    console.log("[ws] close", peer.id);
  },
  error(peer, error) {
    console.error("[ws] error", peer.id, error);
  },
});
