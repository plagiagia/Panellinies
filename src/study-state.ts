export type Highlight = { start: number; end: number; color: 'yellow' | 'green'; text: string };
export type StudyEntry = { done: boolean; saved: boolean; note: string; highlights: Highlight[] };
const empty = (): StudyEntry => ({ done: false, saved: false, note: '', highlights: [] });
export const studyKey = (paper: string, id: string) => `study:v1:${paper}:${id}`;
export function readStudy(key: string): StudyEntry {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    if (!value || typeof value !== 'object') return empty();
    return { done: value.done === true, saved: value.saved === true, note: typeof value.note === 'string' ? value.note : '',
      highlights: Array.isArray(value.highlights) ? value.highlights.filter((h: Highlight) => h && Number.isInteger(h.start) && Number.isInteger(h.end) && h.start >= 0 && h.end > h.start && typeof h.text === 'string' && ['yellow', 'green'].includes(h.color)) : [] };
  } catch { return empty(); }
}
export function writeStudy(key: string, value: StudyEntry): boolean {
  try { localStorage.setItem(key, JSON.stringify(value)); window.dispatchEvent(new Event('study-change')); return true; }
  catch { return false; }
}
