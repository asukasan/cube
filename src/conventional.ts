import { EventEmitter } from 'node:events';
import type { EventEnvelope } from './contracts.js';

/** Conventional baseline X: Node EventEmitter + app-specific permission checks.
 * Same trusted-string assumptions as MockBus Y; NOT real authentication.
 */
export class ConventionalIntegration {
  private bus = new EventEmitter();
  private permissions = new Map<string, Set<string>>();
  private seen = new Set<string>();
  private deliveries = 0;

  grant(principal: string, action: string, subject: string): void {
    const key = principal + '|' + subject;
    const set = this.permissions.get(key) ?? new Set<string>();
    set.add(action);
    this.permissions.set(key, set);
  }
  revoke(principal: string, action: string, subject: string): void {
    this.permissions.get(principal + '|' + subject)?.delete(action);
  }
  private allowed(principal: string, action: string, subject: string): boolean {
    return this.permissions.get(principal + '|' + subject)?.has(action) ?? false;
  }
  subscribe(principal: string, type: string, subject: string, fn: (event: EventEnvelope) => void): () => void {
    if (!this.allowed(principal, 'subscribe:' + type, subject)) {
      throw new Error('Permission denied: subscription');
    }
    const listener = (message: EventEnvelope): void => {
      if (message.subject !== subject) return;
      if (this.allowed(principal, 'subscribe:' + type, subject)) {
        this.deliveries++;
        fn(message);
      }
    };
    this.bus.on(type, listener);
    return () => this.bus.off(type, listener);
  }
  publish(principal: string, event: EventEnvelope): number {
    if (!this.allowed(principal, 'publish:' + event.type, event.subject)) {
      throw new Error('Permission denied: publication');
    }
    if (event.specversion !== '1.0' || !/\.v1$/.test(event.type)) {
      throw new Error('Unsupported event schema');
    }
    const key = event.source + '|' + event.id;
    if (this.seen.has(key)) return 0;
    this.seen.add(key);
    this.deliveries = 0;
    this.bus.emit(event.type, event);
    return this.deliveries;
  }
}
