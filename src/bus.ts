import type { EventEnvelope, Subscription } from "./contracts.js";

/**
 * Deliberately INSECURE in-memory mock: identities are trusted strings.
 * It demonstrates explicit permission checks and event semantics, NOT authentication.
 */
export class MockBus {
  private grants = new Map<string, Set<string>>();
  private subscriptions: Subscription[] = [];
  private seen = new Set<string>();

  grant(moduleId: string, action: string, subject: string): void {
    const key = moduleId + "|" + subject;
    const set = this.grants.get(key) ?? new Set<string>();
    set.add(action);
    this.grants.set(key, set);
  }

  revoke(moduleId: string, action: string, subject: string): void {
    this.grants.get(moduleId + "|" + subject)?.delete(action);
  }

  private allowed(moduleId: string, action: string, subject: string): boolean {
    return this.grants.get(moduleId + "|" + subject)?.has(action) ?? false;
  }

  subscribe(moduleId: string, eventType: string, subject: string, onEvent: Subscription["onEvent"]): () => void {
    if (!this.allowed(moduleId, "subscribe:" + eventType, subject)) {
      throw new Error("Permission denied: subscription");
    }
    const sub = { moduleId, eventType, subject, onEvent };
    this.subscriptions.push(sub);
    return () => { this.subscriptions = this.subscriptions.filter(s => s !== sub); };
  }

  publish(moduleId: string, event: EventEnvelope): number {
    if (!this.allowed(moduleId, "publish:" + event.type, event.subject)) {
      throw new Error("Permission denied: publication");
    }
    if (event.specversion !== "1.0" || !/\.v1$/.test(event.type)) {
      throw new Error("Unsupported event schema");
    }
    if (this.seen.has(event.source + "|" + event.id)) return 0;
    this.seen.add(event.source + "|" + event.id);
    let delivered = 0;
    for (const sub of [...this.subscriptions]) {
      if (sub.eventType !== event.type || sub.subject !== event.subject) continue;
      // Re-check authorization at delivery to support revocation.
      if (!this.allowed(sub.moduleId, "subscribe:" + sub.eventType, sub.subject)) continue;
      sub.onEvent(event);
      delivered++;
    }
    return delivered;
  }
}
