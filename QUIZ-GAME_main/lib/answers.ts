// lib/answers.ts

/** Storage key for all Q&A */
const STORAGE_KEY = 'answers';

/** Guard: only touch localStorage in the browser */
const isBrowser = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export type Answers = Record<string, string>; // e.g. { q1: 'Kangaroo Jumper', ... }

/** Read whole answers object ({} if none) */
export function getAnswers(): Answers {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const obj = raw ? JSON.parse(raw) : {};
    return obj && typeof obj === 'object' ? (obj as Answers) : {};
  } catch {
    return {};
  }
}

/** Save/overwrite a single answer (e.g. id='q5', value='City Explorer') */
export function saveAnswer(id: string, value: string): boolean {
  if (!isBrowser()) return false;
  try {
    const cur = getAnswers();
    const next = { ...cur, [id]: value };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    // fire a same-tab event for listeners (optional)
    window.dispatchEvent(new CustomEvent<Answers>('answers:change', { detail: next }));
    return true;
  } catch {
    return false;
  }
}

/** Merge multiple answers at once */
export function saveAnswers(partial: Answers): boolean {
  if (!isBrowser()) return false;
  try {
    const cur = getAnswers();
    const next = { ...cur, ...partial };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent<Answers>('answers:change', { detail: next }));
    return true;
  } catch {
    return false;
  }
}

/** Remove one answer */
export function removeAnswer(id: string): boolean {
  if (!isBrowser()) return false;
  const cur = getAnswers();
  if (!(id in cur)) return true;
  const { [id]: _omit, ...rest } = cur;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    window.dispatchEvent(new CustomEvent<Answers>('answers:change', { detail: rest }));
    return true;
  } catch {
    return false;
  }
}

/** Clear all */
export function clearAnswers(): boolean {
  if (!isBrowser()) return false;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent<Answers>('answers:change', { detail: {} }));
    return true;
  } catch {
    return false;
  }
}

/** Optional: subscribe to changes in this tab + other tabs */
export function onAnswersChange(handler: (answers: Answers) => void): () => void {
  if (!isBrowser()) return () => {};
  const storageListener = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) handler(getAnswers());
  };
  const customListener = (e: Event) =>
    handler((e as CustomEvent<Answers>).detail ?? getAnswers());
  window.addEventListener('storage', storageListener);
  window.addEventListener('answers:change', customListener as EventListener);
  return () => {
    window.removeEventListener('storage', storageListener);
    window.removeEventListener('answers:change', customListener as EventListener);
  };
}

/** Known quiz keys (optional) */
export const QUIZ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'] as const;
export type QuizKey = (typeof QUIZ_KEYS)[number];
