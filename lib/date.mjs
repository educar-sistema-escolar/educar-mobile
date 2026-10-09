export function schoolDate(value) {
 const date=new Date(value);if(!Number.isFinite(date.getTime()))return 'Date unavailable';
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Argentina/Buenos_Aires',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
 const get=type=>parts.find(part=>part.type===type)?.value;return `${get('year')}-${get('month')}-${get('day')}`;
}
