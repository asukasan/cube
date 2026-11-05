export type EventEnvelope<T = unknown> = {
  specversion: "1.0";
  id: string;
  source: string;
  type: string;
  subject: string;
  data: T;
};

export type Subscription = {
  moduleId: string;
  eventType: string;
  subject: string;
  onEvent: (event: EventEnvelope) => void;
};
