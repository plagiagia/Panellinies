import { topics } from './topics-data';
import { topicGroups } from './topic-groups';
import { readStudy, studyKey } from './study-state';

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
  for (const group of topicGroups.filter(group => group.subject === subject.value)) {
    const grouped = visible.filter(topic => group.ids.includes(topic.id));
    if (!grouped.length) continue;
    const section = document.createElement('section'); section.className = 'topic-group';
    const heading = document.createElement('h2'); heading.textContent = group.name;
    const intro = document.createElement('p'); intro.textContent = group.description;
    section.append(heading, intro); list.append(section);
  for (const topic of grouped) {
    const details = document.createElement('details');
    details.className = 'topic-card';
    details.id = `topic-${topic.id}`;
    const summary = document.createElement('summary');
    const completed = topic.questions.filter(q => readStudy(studyKey(`${topic.subject}-${q.year}`, q.id)).done).length;
    summary.dataset.progress = `${completed}/${topic.questions.length}`;
    summary.textContent = `${topic.name} · ${topic.questions.length} ερωτήσεις`;
    details.append(summary);
    const questions = document.createElement('ul');
    questions.className = 'topic-questions';
    for (const question of topic.questions) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `/${topic.subject}-${question.year}.html?focus=1#${question.id}`;
      if (readStudy(studyKey(`${topic.subject}-${question.year}`, question.id)).done) link.classList.add('question-done');
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
    section.append(details);
  }
  }
}

subject.addEventListener('change', render);
search.addEventListener('input', render);
render();
const anchored = document.getElementById(location.hash.slice(1)) as HTMLDetailsElement | null;
if (anchored?.matches('.topic-card')) { anchored.open = true; anchored.scrollIntoView(); }
