import type { LessonSequence } from './load-course-pack';
import { call, code, emphasis, objectLabel, operator, token, foundationLesson, ladder, prediction, symbol, task } from './python-foundation';

const id = 'F01.03';
const concept = 'python.identity-equality';
const rackSolution = 'def rack_badge(primary, spare, slot):\n    first = [primary]\n    replacement = [spare]\n    slots = [first, first, replacement]\n    selected = slots[slot]\n    return int(selected == first) + int(selected is first)';
export const f0103Exercises = [
  prediction(id, concept, 'front = [7]\nalias = front\nother = [7]\nprint(int(alias is front) + int(other is front))', 1),
  task(id, concept, {
    key: 'modify', kind: 'modify', title: 'Compare two readings by value', entryPoint: 'matching_readings',
    prompt: ['The two instruments each produce a separate one-item list. Update ', call('matching_readings()'), ' so it returns integer 1 when the lists have ',
      emphasis('equal contents'), ' and integer 0 otherwise. ', symbol('left'), ' and ', symbol('right'),
      ' are signed integers. With (4, 4), return 1 even though the two lists are distinct.'],
    starter: 'def matching_readings(left, right):\n    a = [left]\n    b = [right]\n    return int(a is b)',
    hints: [{ level: 'H0', text: 'The function creates two lists. Which question is about their entries rather than their identity?' }],
    cases: [['equal', [4, 4], 1], ['different', [4, 5], 0], ['zero', [0, 0], 1],
      ['negative', [-3, -3], 1], ['opposite', [3, -3], 0], ['reverse', [5, 4], 0]],
  }),
  task(id, concept, {
    key: 'build', kind: 'write', title: 'Check whether a slot is an alias', entryPoint: 'shared_slot',
    prompt: ['Complete ', call('shared_slot()'), '. Slot 0 holds the original list and slot 1 holds a separate list with equal contents. Return integer 1 only if the selected entry is the ',
      emphasis('original object'), ', or 0 otherwise. ', symbol('reading'), ' is a signed integer and ', symbol('slot'), ' is 0 or 1. For (6, 1), return 0.'],
    starter: 'def shared_slot(reading, slot):\n    original = [reading]\n    entries = [original, [reading]]\n    selected = entries[slot]\n    pass  # Return the identity check as an integer.',
    hints: [{ level: 'H0', text: 'Draw one arrow from each slot to its list. An equal entry need not land at the same object.' }],
    cases: [['original', [6, 0], 1], ['other', [6, 1], 0], ['zero-original', [0, 0], 1],
      ['zero-other', [0, 1], 0], ['negative-original', [-4, 0], 1], ['negative-other', [-4, 1], 0]],
  }),
  task(id, concept, {
    key: 'make', revision: '1.2.0', kind: 'write', title: 'Classify a rack slot', entryPoint: 'rack_badge',
    prompt: ['Define ', call('rack_badge()'), '. The first two inputs, ', symbol('primary'), ' and ', symbol('spare'),
      ', are signed integer readings. The third input, ', symbol('slot'), ', is 0, 1 or 2.\n\n',
      'Slots 0 and 1 refer to the same list, containing the primary reading. Slot 2 refers to a separate list containing the spare reading.\n\n',
      'Return 2 if the selected slot holds the primary list, 1 if it holds a separate list with equal contents, or 0 if the contents differ. Return an integer. Example: (9, 9, 2) returns 1.'],
    hints: ladder('Draw two list objects and three arrows from the slots. Which arrows lead to the same object?',
      'For these lists, sharing an object guarantees equal contents. Can two separate checks distinguish the three cases?',
      'The two comparison results can contribute one point each. Slot 2 in the example has equal contents but a different object, so only one check contributes.', rackSolution),
    cases: [['shared-zero', [9, 7, 0], 2], ['shared-one', [0, 5, 1], 2], ['equal-distinct', [9, 9, 2], 1],
      ['different', [9, 8, 2], 0], ['zero-distinct', [0, 0, 2], 1], ['negative-distinct', [-3, 3, 2], 0]],
  }),
  task(id, concept, {
    key: 'make-transfer', revision: '1.3.0', kind: 'transfer', title: 'Count duplicates across two handoffs', entryPoint: 'duplicate_flag',
    prompt: ['Define ', call('duplicate_flag()'), '. The archive keeps one list containing ', symbol('level'), ' throughout. The first three inputs are signed integers. ', symbol('restore'), ' is 0 or 1.\n\n',
      emphasis('Update 1'), ': the desk receives a new list containing ', symbol('first'), '.\n',
      emphasis('Update 2'), ': if restore is 1, the desk receives the archive list itself. If restore is 0, it receives a new list containing ', symbol('second'), '.\n\n',
      'After each update, count one duplicate only if the desk list is a ', emphasis('separate object with equal contents'), '. Return the total as an integer. (5, 5, 5, 0) returns 2. (5, 5, 5, 1) returns 1 because the second update shares the archive object.'],
    hints: ladder('After each update, ask two separate questions: do the entries match, and are the desk and archive pointing to the same object?',
      'Keep the archive reference available while the desk changes. Evaluate the two updates separately and count only separate lists with matching entries.',
      'A new list with the archived reading counts as one duplicate. Reattaching the archive list makes the two references identical, so this update adds no duplicate.',
      'def duplicate_flag(level, first, second, restore):\n    archive = [level]\n    desk = [first]\n    total = int(desk == archive) - int(desk is archive)\n    desk = [[second], archive][restore]\n    return total + int(desk == archive) - int(desk is archive)'),
    cases: [['two-duplicates', [5, 5, 5, 0], 2], ['restored', [5, 5, 5, 1], 1], ['first-only', [5, 5, 2, 0], 1],
      ['second-only', [5, 2, 5, 0], 1], ['no-duplicates', [5, 2, 4, 0], 0], ['restored-after-change', [0, -1, 0, 1], 0]],
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
f0103Lesson.version = '1.3.0';

export const f0103Sequence: LessonSequence = {
  draftsFromLesson: '1.1.0',
  resumeFrom: {
    '1.2.0': { [id + '.make-transfer']: '1.2.0' },
    '1.1.0': { [id + '.make']: '1.1.0', [id + '.make-transfer']: '1.1.0' },
  },
  equivalentExerciseVersions: { [id + '.make']: ['1.1.0', '1.0.0'], [id + '.make-transfer']: ['1.2.0', '1.1.0'] },
  trace: {
    id: id + '.reference-trace', version: '1.0.0', title: 'Trace references and contents',
    prompt: ['Line 1 creates a list we call object ', objectLabel('A'), '. Line 3 creates a separate list we call object ', objectLabel('B'),
      '. Both contain ', code('3'), '. ', symbol('first'), ' and ', symbol('second'),
      ' are variable names that refer to those objects.\n\nIn each row, choose the ', emphasis('object label'), ' (',
      objectLabel('A'), ' or ', objectLabel('B'), ') that ', symbol('second'), ' refers to. Use the labels here rather than a variable name or the list contents. Then answer yes or no for ',
      symbol('second'), ' ', operator('is'), ' ', symbol('first'), ' and ', symbol('second'), ' ', operator('=='), ' ', symbol('first'), '.'],
    source: 'first = [3]\nsecond = first\nsecond = [3]\nsecond = first',
    columns: ['Object label for second (A/B)', 'Same object?', 'Equal contents?'],
    labelChoices: { column: 0, options: ['A', 'B'] },
    rows: [{ label: 'Line 2', expected: ['a', 'yes', 'yes'] }, { label: 'Line 3', expected: ['b', 'no', 'yes'] },
      { label: 'Line 4', expected: ['a', 'yes', 'yes'] }],
    help: {
      concept: 'Draw an arrow from each name to a list. Check the arrows for identity and the entries for equality.',
      guidance: 'A name on the right reuses its arrow target. A list display makes a different object, even if the entries match.',
      worked: [
        [symbol('second'), ' receives the reference already held by ', symbol('first'), ', so both names refer to ', objectLabel('A'), '.'],
        ['The new list has the same entry as ', objectLabel('A'), ', but ', symbol('second'), ' now refers to ', objectLabel('B'), '.'],
        ['The assignment gives ', symbol('second'), ' the reference to ', objectLabel('A'), ' again.'],
      ],
    },
    mistake: { id: 'equal-implies-identical', message: ['Your line 3 comparison treats the equal entry as the same object. Check where object ', objectLabel('B'), ' was created.'],
      cells: [{ row: 1, column: 0, value: 'b' }, { row: 1, column: 1, value: 'yes' }, { row: 1, column: 2, value: 'yes' }] },
  },
  transferTrace: {
    id: id + '.handoff-trace', version: '1.0.0', title: 'Trace the handoff',
    prompt: ['Compare ', symbol('desk'), ' with ', symbol('archive'), ' after each indicated line. Answer ', token('yes'), ' or ', token('no'),
      ' for identity (', operator('is'), ') and equality (', operator('=='), '). Follow both names when the archive is rebound.'],
    source: 'archive = [8]\ndesk = archive\narchive = [8]\nbackup = archive\ndesk = backup\ndesk = [4]',
    columns: ['Same object?', 'Equal contents?'],
    help: {
      concept: 'Track the object behind each name before comparing their entries.',
      guidance: 'After rebinding archive, keep the prior arrow from desk until a line assigns to desk. Then follow the reference held by backup.',
      worked: [
        'Archive now points to a new list. Desk still points to the original list with the same entry.',
        'Backup holds the new archive reference. Assigning it to desk reconnects the two names.',
        'Desk now points to another list, and its entry differs from the archive entry.',
      ],
    },
    rows: [{ label: 'Line 3', expected: ['no', 'yes'] }, { label: 'Line 5', expected: ['yes', 'yes'] },
      { label: 'Line 6', expected: ['no', 'no'] }],
  },
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
    prompt: 'Slot 0 holds the original list. Slot 1 holds a separate list with the same reading. Return 1 only when the selected slot is the original object, and 0 otherwise. For reading 6 and slot 1, which result follows?',
    example: { input: [6, 1], expected: 0 },
    options: [{ id: 'other', text: '0, because the slot contains a distinct list.' }, { id: 'same', text: '1, because the readings are equal.' }],
    correct: 'other', syntax: 'Start with the supplied selected and original names. The caller needs an integer result, so convert the comparison.',
    retry: 'Equal entries answer the contents question. Which object does the slot hold?',
    report: 'In Build, at least one plan counted equal entries as evidence of identity.',
  },
};
