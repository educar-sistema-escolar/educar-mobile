export function scopedValue<T>(snapshot: {session: unknown;childId:string;value:T}|null,session:unknown,childId:string,fallback:T):T;
