export const getListenerName = (eventType: string): string =>
  `on${eventType[0].toUpperCase()}${eventType.slice(1)}`
