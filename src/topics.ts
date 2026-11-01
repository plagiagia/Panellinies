import { topics } from './topics-data';

const subject = document.querySelector<HTMLSelectElement>('#topic-subject')!;
const search = document.querySelector<HTMLInputElement>('#topic-search')!;
const list = document.querySelector<HTMLElement>('#topic-list')!;
const empty = document.querySelector<HTMLElement>('#topic-empty')!;
const initialSubject = new URLSearchParams(location.search).get('subject');
if (initialSubject === 'math' || initialSubject === 'physics') subject.value = initialSubject;

const normalize = (value: string) => value.toLocaleLowerCase('el').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function render() {
  const query = normalize(search.value.trim());
  const visible = topics.filter(topic => topic.subject === subject.value && normalize(topic.name).includes(query));
  list.replaceChildren();
  empty.hidden = visible.length > 0;
  for (const topic of visible) {
    const details = document.createElement('details');
    details.className = 'topic-card';
    details.id = `topic-${topic.id}`;
    const summary = document.createElement('summary');
    summary.textContent = `${topic.name} · ${topic.questions.length} ερωτήσεις`;
    details.append(summary);
    const questions = document.createElement('ul');
    questions.className = 'topic-questions';
    for (const question of topic.questions) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `/${topic.subject}-${question.year}.html#${question.id}`;
      const labels: Record<string, string> = { a: 'Α', b: 'Β', c: 'Γ', d: 'Δ' };
      link.textContent = `${question.year} · ${labels[question.id[0]]}${question.id.slice(1)} — ${question.description} ↗`;
      item.append(link);
      questions.append(item);
    }
    details.append(questions);
    if (topic.related.length) {
      const related = document.createElement('div');
      related.className = 'topic-related';
      related.append('Σχετικές έννοιες: ');
      topic.related.forEach(id => {
        const target = topics.find(item => item.id === id && item.subject === topic.subject);
        if (!target) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = target.name;
        button.addEventListener('click', () => {
          search.value = '';
          render();
          const destination = document.getElementById(`topic-${id}`) as HTMLDetailsElement | null;
          if (destination) { destination.open = true; destination.scrollIntoView({ behavior: 'smooth', block: 'start' }); destination.querySelector('summary')?.focus(); }
        });
        related.append(button);
      });
      details.append(related);
    }
    list.append(details);
  }
}

subject.addEventListener('change', render);
search.addEventListener('input', render);
render();
