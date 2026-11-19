import type { LessonSequence } from './load-course-pack';
import { call, code, foundationLesson, ladder, prediction, symbol, task } from './python-foundation';

const id = 'F01.03';
const concept = 'python.identity-equality';
const rackSolution = 'def rack_badge(primary, spare, slot):\n    first = [primary]\n    replacement = [spare]\n    slots = [first, first, replacement]\n    selected = slots[slot]\n    return int(selected == first) + int(selected is first)';
export const f0103Exercises = [
  prediction(id, concept, 'front = [7]\nalias = front\nother = [7]\nprint(int(alias is front) + int(other is front))', 1),
  task(id, concept, {
    key: 'modify', kind: 'modify', title: 'Compare two readings by value', entryPoint: 'matching_readings',
    prompt: 'The two instruments each produce a separate one-item list. Change matching_readings(left, right) so it returns integer 1 when the two readings have equal contents and integer 0 otherwise. Inputs are signed integers. With (4, 4), return 1 even though the two lists are distinct.',
    starter: 'def matching_readings(left, right):\n    a = [left]\n    b = [right]\n    return int(a is b)',
    hints: [{ level: 'H0', text: 'The function creates two lists. Which question is about their entries rather than their identity?' }],
    cases: [['equal', [4, 4], 1], ['different', [4, 5], 0], ['zero', [0, 0], 1],
      ['negative', [-3, -3], 1], ['opposite', [3, -3], 0], ['reverse', [5, 4], 0]],
  }),
  task(id, concept, {
    key: 'build', kind: 'write', title: 'Check whether a slot is an alias', entryPoint: 'shared_slot',
    prompt: 'Complete shared_slot(reading, slot). The supplied entries contain an original list at position 0 and an independently created list with equal contents at position 1. Return integer 1 only if the selected entry is the original object, or 0 otherwise. The reading is a signed integer and slot is 0 or 1. For (6, 1), return 0.',
    starter: 'def shared_slot(reading, slot):\n    original = [reading]\n    entries = [original, [reading]]\n    selected = entries[slot]\n    pass  # Return the identity check as an integer.',
    hints: [{ level: 'H0', text: 'Draw one arrow from each slot to its list. An equal entry need not land at the same object.' }],
    cases: [['original', [6, 0], 1], ['other', [6, 1], 0], ['zero-original', [0, 0], 1],
      ['zero-other', [0, 1], 0], ['negative-original', [-4, 0], 1], ['negative-other', [-4, 1], 0]],
  }),
  task(id, concept, {
    key: 'make', kind: 'write', title: 'Classify a rack slot', entryPoint: 'rack_badge',
    prompt: ['A rack records a primary sample as a one-item list containing ', symbol('primary'), '. Slots 0 and 1 refer to that same list. Slot 2 refers to a separately created one-item list containing ',
      symbol('spare'), '. Define ', call('rack_badge()'), ' with signed integer readings primary and spare, followed by integer ',
      symbol('slot'), ' (0, 1, or 2). Return 2 for the primary object, 1 for a separate object with equal contents, and 0 otherwise. For (9, 9, 2), return 1. Use both a contents comparison and an identity comparison to practise the distinction.'],
    hints: ladder('Draw two list objects and three arrows from the slots. Which arrows lead to the same object?',
      'For these lists, sharing an object guarantees equal contents. Can two separate checks distinguish the three cases?',
      'The two comparison results can contribute one point each. Slot 2 in the example has equal contents but a different object, so only one check contributes.', rackSolution),
    cases: [['shared-zero', [9, 7, 0], 2], ['shared-one', [0, 5, 1], 2], ['equal-distinct', [9, 9, 2], 1],
      ['different', [9, 8, 2], 0], ['zero-distinct', [0, 0, 2], 1], ['negative-distinct', [-3, 3, 2], 0]],
  }),
  task(id, concept, {
    key: 'make-transfer', kind: 'transfer', title: 'Flag a duplicate without counting aliases', entryPoint: 'duplicate_flag',
    prompt: 'A report has three slots. Slots 0 and 1 share one list containing level. Slot 2 holds a new list containing replacement. Define duplicate_flag(level, replacement, left, right). The readings are signed integers and both slot indices are 0, 1 or 2. Compare the two selected lists by contents and identity. Return integer 1 only when the two lists are separate objects with equal contents, or 0 otherwise. For (5, 5, 0, 1) return 0. For (5, 5, 2, 1) return 1.',
    hints: [],
    cases: [['shared', [5, 5, 0, 1], 0], ['other-shared', [5, 5, 2, 2], 0], ['equal-forward', [5, 5, 1, 2], 1],
      ['equal-reverse', [5, 5, 2, 1], 1], ['unequal', [5, 8, 2, 0], 0], ['zero', [0, 0, 0, 2], 1]],
  }),
];

export const f0103Lesson = foundationLesson({
  id, title: 'Identity and equality', prerequisites: ['F01.02'],
  objectives: ['Distinguish object identity from equality of contents.', 'Trace names that share a list and names that refer to distinct lists with equal entries.'],
  teachingBlocks: [
    { id: id + '.intro', type: 'paragraph', content: ['In the previous lesson, assignment bound a name to an existing object. For this lesson use small lists so it is clear when a new object is made. Each list display such as ', code('[3]'), ' creates a separate list, while assigning an existing list to another name shares its reference. The name is an alias.'] },
    { id: id + '.example', type: 'worked-example', language: 'python', code: 'main = [3]\nmirror = main\nseparate = [3]\nprint(main is mirror, main is separate, main == separate)',
      explanation: [symbol('main'), ' and ', symbol('mirror'), ' refer to one object, so the first comparison is true. ', symbol('separate'), ' refers to a new list, so the identity comparison is false. The two lists have matching entries and compare equal. Python prints ', code('True False True'), '. Change the separate list to ', code('[4]'), ' and equality becomes false while the identity relationships stay the same.'] },
    { id: id + '.index', type: 'worked-example', language: 'python', code: 'first = [2]\nitems = [first, [2]]\nprint(int(items[0] is first), int(items[1] is first))',
      explanation: ['An index starts at zero. ', code('items[0]'), ' retrieves the existing first list. ', code('items[1]'), ' retrieves the other list. ', call('int()'),
        ' turns true into 1 and false into 0, so the output is ', code('1 0'), '. Use this conversion for the integer result requested in the exercises.'] },
    { id: id + '.warning', type: 'warning', content: ['Use equality for numeric or string contents. Identity asks whether two names refer to the same object. Avoid experiments with identity of small integers because implementations may reuse them.'] },
  ],
  mentorTips: [{ id: id + '.tip', text: 'Draw labels with arrows to objects. Compare the arrows for identity and the entries for equality.', sourceRefs: ['P01'] }],
}, f0103Exercises);

export const f0103Sequence: LessonSequence = {
  learnTitle: 'Two questions about the same pair',
  titleAccent: 'equality',
  predictionCoaching: {
    explanation: ['The first comparison checks two names for the same list and contributes 1. The second compares separate lists by identity and contributes 0. Equal entries do not change the identity result.'],
    modifyFeedback: 'Try two equal readings. If equality should be true but the result is zero, ask whether the comparison is testing their entries or the two list objects.',
    hypothesis: {
      id: 'equal-implies-identical', answer: 2,
      possibleReasoning: 'You may have counted both comparisons as true because every list contains 7.',
      actualReasoning: 'The two list displays create separate objects. Only the alias shares the original object.',
      question: 'Did you use matching contents to decide identity?', confirm: 'Yes, I treated equal contents as the same object',
      confirmedFeedback: 'Trace arrows for identity first. Then check the entries as a separate question.',
      rejectedFeedback: 'Trace where each name gets its object. Check each comparison separately.',
      report: { confirmed: 'You confirmed using equal contents to decide identity.', rejected: 'You rejected the equal-contents explanation.',
        unconfirmed: 'Using equality to decide identity was a possible explanation.' },
    },
    followUp: { code: 'original = [5]\nreplacement = [5]\nslots = [original, replacement]\nprint(int(slots[1] is original))',
      expected: 0, hint: 'Find which object the second slot references. Decide identity before comparing contents.',
      explanation: 'The second slot holds the separate list. Identical entries do not make it the same object.' },
  },
  buildPlan: {
    prompt: 'The second slot contains a newly created list with the same reading. What does the identity check need to report?',
    options: [{ id: 'other', text: '0, because the slot contains a distinct list.' }, { id: 'same', text: '1, because the readings are equal.' }],
    correct: 'other', syntax: 'Start with the supplied selected and original names. The caller needs an integer result, so convert the comparison.',
    retry: 'Equal entries answer the contents question. Which object does the slot hold?',
    report: 'In Build, at least one plan counted equal entries as evidence of identity.',
  },
};
