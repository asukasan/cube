import test from 'node:test';
import assert from 'node:assert/strict';
import { ConventionalIntegration } from '../src/conventional.js';
import { MockBus } from '../src/bus.js';

const type = 'org.cube-demo.game.finished.v1';
const subject = 'session-001';
function msg(id: string, eventType = type) {
  return {
    specversion: '1.0' as const, id, source: 'urn:cube-demo:game',
    type: eventType, subject, data: { winner: 'player-2' }
  };
}

for (const [label, create] of [
  ['X EventEmitter baseline', () => new ConventionalIntegration()],
  ['Y Cube mock', () => new MockBus()]
] as const) {
  test(label + ': integration, replay and revocation', () => {
    const bus = create();
    bus.grant('game', 'publish:' + type, subject);
    bus.grant('score', 'subscribe:' + type, subject);
    const events: string[] = [];
    bus.subscribe('score', type, subject, event => events.push(event.id));
    assert.equal(bus.publish('game', msg('e1')), 1);
    assert.equal(bus.publish('game', msg('e1')), 0);
    assert.deepEqual(events, ['e1']);
    bus.revoke('score', 'subscribe:' + type, subject);
    assert.equal(bus.publish('game', msg('e2')), 0);
    assert.deepEqual(events, ['e1']);
  });
  test(label + ': unauthorized, incompatible version', () => {
    const bus = create();
    assert.throws(() => bus.subscribe('intruder', type, subject, () => {}), /Permission denied/);
    assert.throws(() => bus.publish('intruder', msg('e1')), /Permission denied/);
    const version2 = type.replace('.v1', '.v2');
    bus.grant('game', 'publish:' + version2, subject);
    assert.throws(() => bus.publish('game', msg('e3', version2)), /Unsupported/);
  });
}
