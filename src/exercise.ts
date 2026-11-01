import { topics } from './topics-data';
import { readStudy, writeStudy, studyKey, type Highlight } from './study-state';

const paper = location.pathname.match(/^\/(math|physics)-(2025|2026)\.html$/);
if (paper) initialize(paper[1], paper[2]);

function initialize(subject: string, year: string) {
  const questions = Array.from(document.querySelectorAll<HTMLElement>('.question[id]'));
  const sections = Array.from(document.querySelectorAll<HTMLElement>('.exam-section'));
  if (!questions.length) return;
  let focus = new URLSearchParams(location.search).get('focus') === '1';
  let current = Math.max(0, questions.findIndex(q => `#${q.id}` === location.hash));
  const tools = document.createElement('div'); tools.className = 'study-toolbar';
  tools.innerHTML = '<div><strong>Το εργαστήριό σου</strong><small>Σημειώσεις & πρόοδος σε αυτόν τον browser</small></div><span class="study-count"></span><button type="button" class="focus-toggle">Συγκέντρωση</button>';
  document.querySelector('.exam-nav')!.after(tools);
  const count = tools.querySelector<HTMLElement>('.study-count')!;
  const toggle = tools.querySelector<HTMLButtonElement>('button')!;
  const pager = document.createElement('div'); pager.className = 'exercise-pager';
  pager.innerHTML = '<button type="button">← Προηγούμενη</button><span aria-live="polite"></span><button type="button">Επόμενη →</button>';
  document.querySelector('.exam-end')!.before(pager);
  const [previous, next] = Array.from(pager.querySelectorAll('button'));
  const update = () => {
    const done = questions.filter(q => readStudy(studyKey(`${subject}-${year}`, q.id)).done).length;
    count.textContent = `${done} / ${questions.length} μελετήθηκαν`;
    toggle.textContent = focus ? 'Όλο το διαγώνισμα' : 'Μία άσκηση τη φορά';
    toggle.setAttribute('aria-pressed', String(focus));
    document.querySelector('.exam-page')!.classList.toggle('focused', focus);
    questions.forEach((q, i) => { q.hidden = focus && i !== current; });
    sections.forEach(s => { s.hidden = focus && !s.contains(questions[current]); });
    pager.hidden = !focus;
    pager.querySelector('span')!.textContent = `${current + 1} / ${questions.length}`;
    previous.disabled = current === 0; next.disabled = current === questions.length - 1;
  };
  const move = (index: number) => {
    current = index; update();
    history.replaceState(null, '', `${location.pathname}${focus ? '?focus=1' : ''}#${questions[current].id}`);
    questions[current].scrollIntoView({ block: 'center', behavior: 'smooth' });
    questions[current].focus({ preventScroll: true });
  };
  previous.addEventListener('click', () => move(current - 1));
  next.addEventListener('click', () => move(current + 1));
  toggle.addEventListener('click', () => { focus = !focus; move(current); });
  window.addEventListener('hashchange', () => {
    const target = document.getElementById(location.hash.slice(1));
    const index = questions.findIndex(q => q === target || target?.contains(q));
    if (index >= 0) { current = index; update(); target?.scrollIntoView(); }
  });

  questions.forEach(question => {
    question.tabIndex = -1;
    const key = studyKey(`${subject}-${year}`, question.id);
    const state = readStudy(key);
    const content = document.createElement('div'); content.className = 'question-content';
    Array.from(question.childNodes).filter(node => !(node instanceof Element && node.matches('.discussion'))).forEach(node => content.append(node));
    question.prepend(content);
    const tags = document.createElement('div'); tags.className = 'exercise-tags';
    topics.filter(t => t.subject === subject && t.questions.some(q => q.year === Number(year) && q.id === question.id)).forEach(topic => {
      const link = document.createElement('a'); link.href = `/topics.html?subject=${subject}#topic-${topic.id}`; link.textContent = topic.name; tags.append(link);
    });
    question.prepend(tags);
    const controls = document.createElement('div'); controls.className = 'exercise-tools';
    controls.innerHTML = '<div class="exercise-actions"><button type="button" data-action="done"></button><button type="button" data-action="saved"></button></div><div class="highlight-tools"><span>Επίλεξε λέξεις και τόνισε:</span><button type="button" data-color="yellow">Κίτρινο</button><button type="button" data-color="green">Πράσινο</button><button type="button" data-action="clear">Καθαρισμός</button></div><details class="personal-note"><summary>Το σημειωματάριό μου</summary><label>Η σκέψη σου, μια απορία, το επόμενο βήμα<textarea maxlength="6000" rows="3" placeholder="Γράψε εδώ τις σημειώσεις σου…"></textarea></label></details><p class="save-status" role="status"></p>';
    content.after(controls);
    const status = controls.querySelector<HTMLElement>('.save-status')!;
    const done = controls.querySelector<HTMLButtonElement>('[data-action="done"]')!;
    const saved = controls.querySelector<HTMLButtonElement>('[data-action="saved"]')!;
    const renderState = () => {
      done.textContent = state.done ? '✓ Μελετήθηκε' : 'Το μελέτησα'; done.setAttribute('aria-pressed', String(state.done));
      saved.textContent = state.saved ? '✓ Για επανάληψη' : '+ Για επανάληψη'; saved.setAttribute('aria-pressed', String(state.saved));
      question.classList.toggle('is-done', state.done);
    };
    const save = () => { status.textContent = writeStudy(key, state) ? 'Αποθηκεύτηκε σε αυτόν τον browser.' : 'Δεν αποθηκεύτηκε. Ο browser δεν επιτρέπει αποθήκευση.'; renderState(); update(); };
    done.addEventListener('click', () => { state.done = !state.done; save(); });
    saved.addEventListener('click', () => { state.saved = !state.saved; save(); });
    const note = controls.querySelector('textarea')!; note.value = state.note;
    note.addEventListener('input', () => { state.note = note.value; save(); });
    let selection: Highlight | null = null;
    document.addEventListener('selectionchange', () => {
      const selected = window.getSelection();
      if (!selected || selected.isCollapsed || !selected.rangeCount) return;
      const range = selected.getRangeAt(0);
      if (!content.contains(range.startContainer) || !content.contains(range.endContainer)) { selection = null; return; }
      const prefix = document.createRange(); prefix.selectNodeContents(content); prefix.setEnd(range.startContainer, range.startOffset);
      selection = { start: prefix.toString().length, end: prefix.toString().length + range.toString().length, text: range.toString(), color: 'yellow' };
    });
    controls.querySelectorAll<HTMLButtonElement>('[data-color]').forEach(button => {
      button.addEventListener('pointerdown', e => e.preventDefault());
      button.addEventListener('click', () => {
        if (!selection) { status.textContent = 'Επίλεξε πρώτα κείμενο μέσα στην άσκηση.'; return; }
        const highlight = { ...selection, color: button.dataset.color as Highlight['color'] };
        state.highlights = state.highlights.filter(h => h.end <= highlight.start || h.start >= highlight.end);
        state.highlights.push(highlight); paintHighlights(content, state.highlights); selection = null; window.getSelection()?.removeAllRanges(); save();
      });
    });
    controls.querySelector('[data-action="clear"]')!.addEventListener('click', () => { state.highlights = []; paintHighlights(content, []); save(); });
    paintHighlights(content, state.highlights); renderState();
  });
  update();
}

export function paintHighlights(content: HTMLElement, highlights: Highlight[]) {
  content.querySelectorAll('mark.study-highlight').forEach(mark => mark.replaceWith(...Array.from(mark.childNodes)));
  content.normalize();
  const text = content.textContent || '';
  for (const highlight of highlights) {
    if (text.slice(highlight.start, highlight.end) !== highlight.text) continue;
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    const nodes: { node: Text; offset: number }[] = []; let offset = 0;
    while (walker.nextNode()) { const node = walker.currentNode as Text; nodes.push({ node, offset }); offset += node.length; }
    for (const { node, offset: start } of nodes) {
      const from = Math.max(0, highlight.start - start), to = Math.min(node.length, highlight.end - start);
      if (from >= to) continue;
      const range = document.createRange(); range.setStart(node, from); range.setEnd(node, to);
      const mark = document.createElement('mark'); mark.className = `study-highlight ${highlight.color}`; range.surroundContents(mark);
    }
  }
}
