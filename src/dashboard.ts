import './main';
import { topics } from './topics-data';
import { readStudy, studyKey } from './study-state';

const unique = new Map(topics.flatMap(topic => topic.questions.map(question => [studyKey(`${topic.subject}-${question.year}`, question.id), { ...question, subject: topic.subject }] as const)));
const refresh = () => {
  const entries = [...unique].map(([key, question]) => ({ ...question, ...readStudy(key) }));
  document.querySelector('#done-count')!.textContent = String(entries.filter(e => e.done).length);
  document.querySelector('#saved-count')!.textContent = String(entries.filter(e => e.saved).length);
  document.querySelector('#concept-count')!.textContent = String(topics.length);
  const review = document.querySelector('#review-list')!;
  const saved = entries.filter(e => e.saved);
  if (!saved.length) {
    review.innerHTML = '<p class="review-empty">Σημείωσε μια άσκηση «Για επανάληψη» και θα τη βρεις εδώ.</p>';
    return;
  }
  review.replaceChildren();
  saved.forEach(question => {
    const link = document.createElement('a'); link.className = 'review-link';
    link.href = `/${question.subject}-${question.year}.html?focus=1#${question.id}`;
    const labels: Record<string, string> = { a: 'Α', b: 'Β', c: 'Γ', d: 'Δ' };
    link.textContent = `${question.subject === 'math' ? 'Μαθηματικά' : 'Φυσική'} ${question.year} · ${labels[question.id[0]]}${question.id.slice(1)} — ${question.description} →`;
    review.append(link);
  });
};
refresh(); window.addEventListener('pageshow', refresh);
const slider = document.querySelector<HTMLInputElement>('#slope-input')!;
function graph() {
  const x = Number(slider.value), px = 160 + x * 60, py = 170 - x * x * 36;
  const point = document.querySelector('#graph-point')!; point.setAttribute('cx', String(px)); point.setAttribute('cy', String(py));
  const tangent = document.querySelector('#tangent')!;
  for (const [attribute, value] of Object.entries({ x1: px - 55, x2: px + 55, y1: py + 66 * x, y2: py - 66 * x })) tangent.setAttribute(attribute, String(value));
  document.querySelector('#slope-value')!.textContent = `${x.toFixed(1)} · κλίση ${(2 * x).toFixed(1)}`;
}
slider.addEventListener('input', graph); graph();
document.querySelectorAll<HTMLButtonElement>('[data-answer]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-answer]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  document.querySelector('#lab-feedback')!.textContent = button.dataset.answer === 'negative'
    ? 'Σωστά! f′(x) = 2x. Για x < 0, η εφαπτομένη κατεβαίνει από αριστερά προς τα δεξιά.'
    : 'Δοκίμασε ξανά. Σύρε το σημείο αριστερά από το 0. Η εφαπτομένη ανεβαίνει ή κατεβαίνει;';
}));
