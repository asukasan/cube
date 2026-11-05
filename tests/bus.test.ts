import test from "node:test";
import assert from "node:assert/strict";
import { MockBus } from "../src/bus.js";

const type = "org.cube-demo.game.finished.v1";
const subject = "session-001";

function event(id: string, eventType = type) {
  return { specversion: "1.0" as const, id, source: "urn:cube-demo:game", type: eventType, subject, data: { winner: "player-2" } };
}

test("two independently subscribed mock modules receive event", () => {
  const bus = new MockBus();
  bus.grant("game", "publish:" + type, subject);
  const calls: string[] = [];
  for (const name of ["score", "notification"]) {
    bus.grant(name, "subscribe:" + type, subject);
    bus.subscribe(name, type, subject, () => calls.push(name));
  }
  assert.equal(bus.publish("game", event("evt-1")), 2);
  assert.deepEqual(calls, ["score", "notification"]);
});

test("unauthorized actions are denied", () => {
  const bus = new MockBus();
  assert.throws(() => bus.subscribe("unauthorized", type, subject, () => {}), /Permission denied/);
  assert.throws(() => bus.publish("unauthorized", event("evt-1")), /Permission denied/);
});

test("replay is ignored, and revocation blocks delivery", () => {
  const bus = new MockBus();
  bus.grant("game", "publish:" + type, subject);
  bus.grant("score", "subscribe:" + type, subject);
  let count = 0;
  bus.subscribe("score", type, subject, () => count++);
  assert.equal(bus.publish("game", event("evt-1")), 1);
  assert.equal(bus.publish("game", event("evt-1")), 0);
  bus.revoke("score", "subscribe:" + type, subject);
  assert.equal(bus.publish("game", event("evt-2")), 0);
  assert.equal(count, 1);
});

test("incompatible event version is rejected", () => {
  const bus = new MockBus();
  const v2 = "org.cube-demo.game.finished.v2";
  bus.grant("game", "publish:" + v2, subject);
  assert.throws(() => bus.publish("game", event("evt-3", v2)), /Unsupported/);
});
