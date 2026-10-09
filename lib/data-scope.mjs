export function scopedValue(snapshot, session, childId, fallback) {return session && snapshot?.session===session && snapshot.childId===childId ? snapshot.value : fallback;}
