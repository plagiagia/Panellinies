import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { topics } from '../src/topics-data.ts';

const ids = new Set(topics.map(topic => topic.id));
assert.equal(ids.size, topics.length, 'Topic IDs must be unique');
for (const topic of topics) {
  assert.ok(topic.questions.length, `${topic.id} needs questions`);
  for (const question of topic.questions) {
    const html = readFileSync(`${topic.subject}-${question.year}.html`, 'utf8');
    assert.match(html, new RegExp(`id="${question.id}"`), `${topic.id}: missing ${question.id}`);
  }
  for (const related of topic.related) {
    assert.ok(topics.some(other => other.id === related && other.subject === topic.subject), `${topic.id}: invalid related topic ${related}`);
  }
}
console.log(`Validated ${topics.length} topics and their question links.`);
