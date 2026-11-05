import { MockBus } from "./bus.js";

const bus = new MockBus();
const subject = "session-001";
const finished = "org.cube-demo.game.finished.v1";

bus.grant("game", "publish:" + finished, subject);
bus.grant("score", "subscribe:" + finished, subject);
bus.grant("notification", "subscribe:" + finished, subject);

bus.subscribe("score", finished, subject, event => {
  console.log("score module saw:", event.data);
});
bus.subscribe("notification", finished, subject, event => {
  console.log("notification module saw:", event.data);
});

bus.publish("game", {
  specversion: "1.0",
  id: "evt-001",
  source: "urn:cube-demo:game",
  type: finished,
  subject,
  data: { winner: "player-2" }
});
