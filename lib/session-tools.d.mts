export function singleFlight<T>(operation: () => Promise<T>): () => Promise<T>;
export function parseMoney(value: string): number;
