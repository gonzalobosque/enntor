import type { LessonSequence } from './load-course-pack';
import { call, code, emphasis, foundationLesson, ladder, listCase, objectLabel, operator, prediction, symbol, task } from './python-foundation';

const id = 'F01.04';
const concept = 'python.mutation-rebinding';

export const f0104Exercises = [
  prediction(id, concept, 'queue = [2]\nwatched = queue\nqueue.append(5)\nqueue = [9]\nqueue.append(8)\nprint(len(watched))', 2),
  task(id, concept, {
    key: 'modify', kind: 'modify', title: 'Record a reading in a shared log', entryPoint: 'record_reading',
    prompt: ['Update ', call('record_reading()'), '. Its inputs are ', symbol('log'), ', a possibly empty list of integer readings, and ',
      symbol('reading'), ', an integer. Add the reading to the end of the ', emphasis('caller’s existing list'), ' and return the updated list contents. ',
      'For ([4], 7), return [4, 7]. A caller holding the original list must also see [4, 7] after the call. Keep duplicates.'],
    starter: 'def record_reading(log, reading):\n    log = log + [reading]\n    return log',
    hints: ladder('The starter can return the right contents while the caller still sees the old log. How many list objects are involved?',
      ['Track the object on each side of ', operator('='), ' and ask which object the caller can still reach.'],
      ['With input [4] and reading 7, ', call('append()'), ' extends the existing object. Returning that list gives [4, 7] and the caller sees the same change.'],
      'def record_reading(log, reading):\n    log.append(reading)\n    return log'),
    cases: [
      listCase('one', [[4], 7], [4, 7], [4, 7]), listCase('empty', [[], 0], [0], [0]),
      listCase('duplicate', [[3], 3], [3, 3], [3, 3]), listCase('negative', [[-5, 3], -2], [-5, 3, -2], [-5, 3, -2]),
      listCase('zero', [[0, 8], 0], [0, 8, 0], [0, 8, 0]), listCase('order', [[7, 4, 2], 9], [7, 4, 2, 9], [7, 4, 2, 9]),
    ],
  }),
  task(id, concept, {
    key: 'build', kind: 'write', title: 'Tag a sample', entryPoint: 'tag_sample',
    prompt: ['Complete ', call('tag_sample()'), '. ', symbol('tags'), ' is a possibly empty list of text labels. ',
      symbol('label'), ' is a nonempty string. Add a new label with ', code('"!"'), ' at the end of the text to the caller’s list. ',
      'Return the number of labels after the update as an integer. For (["A"], "B"), the caller sees ["A", "B!"] and the function returns 2.'],
    starter: 'def tag_sample(tags, label):\n    mark = label + "!"\n    # Save the mark in the existing list and report the count.\n    pass',
    hints: ladder('Which of the two inputs must be visibly different when the caller looks again?',
      ['The starter already gives ', symbol('mark'), ' the new text. That string can be an item in the existing list.'],
      ['For ["A"] and "B", the new item is "B!". ', call('append()'), ' changes the list and ', call('len()'), ' reads its new size.'],
      'def tag_sample(tags, label):\n    mark = label + "!"\n    tags.append(mark)\n    return len(tags)'),
    cases: [
      listCase('one', [['A'], 'B'], 2, ['A', 'B!']), listCase('empty', [[], 'start'], 1, ['start!']),
      listCase('duplicate', [['A!'], 'A'], 2, ['A!', 'A!']), listCase('symbol', [[], '!'], 1, ['!!']),
      listCase('several', [['x', 'y'], 'z'], 3, ['x', 'y', 'z!']), listCase('space', [[], 'cold room'], 1, ['cold room!']),
    ],
  }),
  task(id, concept, {
    key: 'make', kind: 'write', title: 'Replace the first board reading', entryPoint: 'update_board',
    prompt: ['A display and a logger share a board of integer readings. The display needs the first reading corrected. The logger needs both the old first reading and the last reading as it stands after the correction.\n\n',
      'Define ', call('update_board()'), ' with ', symbol('readings'), ' (a nonempty list of integers) and ', symbol('replacement'),
      ' (an integer). Change ', emphasis('only the first entry in the caller’s list'), '. Return two integers in a list, in this order: ',
      emphasis('first reading before the change'), ', ', emphasis('last reading after the change'),
      '. If the board has one entry, that entry is both first and last.\n\n',
      'For ([8, 4], 3), the board becomes [3, 4] and the return is [8, 4]. For ([8], 3), the board becomes [3] and the return is [8, 3].'],
    hints: ladder('In a one-entry board, which reported number belongs to which moment?',
      'The report uses one value from before the update and one from after it. The caller needs the revised board as well.',
      ['For [8] and replacement 3, save 8 before the change. Assigning at a list index changes the shared object. Reading its final entry afterward gives 3, so the report is [8, 3].'],
      'def update_board(readings, replacement):\n    previous = readings[0]\n    readings[0] = replacement\n    return [previous, readings[-1]]'),
    cases: [
      listCase('two', [[8, 4], 3], [8, 4], [3, 4]), listCase('one', [[8], 3], [8, 3], [3]),
      listCase('unchanged', [[7], 7], [7, 7], [7]), listCase('negative', [[-4, 12, -9], 0], [-4, -9], [0, 12, -9]),
      listCase('duplicate', [[3, 3, 3], 1], [3, 3], [1, 3, 3]), listCase('zero', [[0, 5], -5], [0, 5], [-5, 5]),
    ],
  }),
  task(id, concept, {
    key: 'make-transfer', kind: 'transfer', title: 'Add a stop to a shared itinerary', entryPoint: 'append_stop',
    prompt: ['A dispatcher adds a stop to the end of a shared itinerary. The handoff report identifies the previous last stop and how many stops the route now has.\n\n',
      'Define ', call('append_stop()'), ' with ', symbol('stops'), ' (a nonempty list of integer stop IDs) and ', symbol('new_stop'),
      ' (an integer ID). The caller’s list must include the new stop ', emphasis('after all existing stops'),
      ', including when the ID is already present. Return a two-integer list: the last ID ', emphasis('before'), ' the update and the stop count ',
      emphasis('after'), ' it. For ([6, 2], 9), the itinerary is [6, 2, 9] and the return is [2, 3].'],
    hints: ladder('Sketch the route before and after the dispatcher’s update. Which numbers belong in the report?',
      'The old last stop and the new length come from different states. The original route must reflect the addition.',
      ['With [6, 2], the previous last ID is 2. ', call('append()'), ' keeps both original entries and adds 9. The route now has length 3, so return [2, 3].'],
      'def append_stop(stops, new_stop):\n    previous = stops[-1]\n    stops.append(new_stop)\n    return [previous, len(stops)]'),
    cases: [
      listCase('two', [[6, 2], 9], [2, 3], [6, 2, 9]), listCase('one', [[0], 5], [0, 2], [0, 5]),
      listCase('duplicate', [[6, 2], 2], [2, 3], [6, 2, 2]), listCase('negative', [[-6, -2, 3], -5], [3, 4], [-6, -2, 3, -5]),
      listCase('longer', [[1, 15, 2, 4], 0], [4, 5], [1, 15, 2, 4, 0]), listCase('same', [[8], 8], [8, 2], [8, 8]),
    ],
  }),
];

export const f0104Lesson = {
  ...foundationLesson({
    id, title: 'Mutable and immutable types', prerequisites: ['F01.03'],
    objectives: ['Distinguish list mutation from integer and string rebinding.', 'Predict whether aliases see the effects of a list update.'],
    teachingBlocks: [
      { id: id + '.intro', type: 'paragraph', content: [
        'Two screens can hold references to one list. An edit to that object appears on both screens. Point just one screen at another list and the other screen stays where it was. ',
        emphasis('Mutation'), ' changes an existing object. ', emphasis('Rebinding'), ' changes where a name points. Use two separate questions: which object does each name point to, and what does that object contain? ',
        'A function parameter refers to the object the caller passed. Edits to a passed list are visible to any caller that still refers to it.',
      ] },
      { id: id + '.list', type: 'worked-example', language: 'python',
        code: 'board = [4]\nmirror = board\nboard.append(7)\nprint(mirror, board is mirror)\nboard = [9]\nboard[0] = 2\nprint(mirror, board[-1], board is mirror)',
        explanation: [call('append()'), ' adds an item to the same list, so ', symbol('mirror'), ' sees [4, 7]. Assigning a new list to ',
          symbol('board'), ' moves only that name. Assignment to ', code('board[0]'),
          ' changes the first entry of its new list. Index ', code('-1'), ' reads the last entry of a nonempty list, including a list of length one.'],
      },
      { id: id + '.values', type: 'worked-example', language: 'python',
        code: 'count = 7\nold_count = count\ncount += 1\nlabel = "A"\nold_label = label\nlabel += "!"\nactions = []\nvisible = actions\nactions += [1]\nprint(old_count, count, old_label, label, len(visible))\nfresh = actions + [2]\nprint(visible, fresh, visible is fresh)',
        explanation: ['Integers and strings are immutable. ', operator('+='), ' binds ', symbol('count'), ' and ', symbol('label'),
          ' to new values. Their other names still refer to 7 and "A". The same operator extends a list in place, even when the list starts out empty. ',
          symbol('visible'), ' still refers to the extended list, so ', call('len()'), ' returns 1. Using ', operator('+'), ' on two lists makes a separate list. Here ', symbol('visible'), ' still sees [1], while ',
          symbol('fresh'), ' contains [1, 2].'],
      },
      { id: id + '.warning', type: 'warning', content: ['Check both the operation and the type. Assignment to a name moves its reference. Assignment to a list position changes an existing object.'] },
    ],
    mentorTips: [
      { id: id + '.tip-rebind', text: 'To predict what an alias sees, distinguish editing its object from moving one name to another object.', sourceRefs: ['P02'] },
      { id: id + '.tip-arrows', text: 'For an in-place method, draw each alias as an arrow to the list it can observe.', sourceRefs: ['P03'] },
    ],
  }, f0104Exercises),
  estimatedMinutes: 20,
};

export const f0104Sequence: LessonSequence = {
  learnTitle: 'What changed: the object or the name?',
  titleAccent: 'immutable types',
  offerTransferPractice: true,
  predictionCoaching: {
    explanation: [symbol('queue'), ' and ', symbol('watched'), ' first refer to the same list. The first ', call('append()'),
      ' adds 5 to it. Rebinding ', symbol('queue'), ' to [9] leaves ', symbol('watched'), ' at [2, 5], so the next append changes only the new list.'],
    followUp: {
      code: 'values = [3]\nseen = values\nvalues = values + [4]\nvalues.append(6)\nprint(len(seen))', expected: 1,
      hint: ['Does ', operator('+'), ' change the initial list or build a new one?'],
      explanation: [symbol('seen'), ' stays with [3]. The addition makes a new list and ', symbol('values'), ' is rebound before the append.'],
    },
  },
  trace: {
    id: id + '.edit-or-rebind', version: '1.0.0', title: 'Follow the edit and the rebind',
    prompt: ['Line 1 creates object ', objectLabel('A'), '. Line 4 creates object ', objectLabel('B'),
      '. For each row, choose the object label for ', symbol('active'), ' and enter the ', emphasis('number of items'),
      ' visible through ', symbol('watched'), ' and ', symbol('active'), ' just after that line. Enter lengths as integers.'],
    source: 'active = [2]\nwatched = active\nactive.append(5)\nactive = [9]\nactive += [8]',
    columns: ['Object label for active (A/B)', 'Length via watched', 'Length via active'],
    labelChoices: { column: 0, options: ['A', 'B'] },
    rows: [{ label: 'Line 3', expected: ['a', '2', '2'] }, { label: 'Line 4', expected: ['b', '2', '1'] }, { label: 'Line 5', expected: ['b', '2', '2'] }],
    help: {
      concept: ['What would you draw differently when a name points to a new list versus when new entries appear inside an existing list?'],
      guidance: [call('append()'), ' edits its list. The assignment on line 4 moves just one arrow. On line 5, check which list that arrow now points to.'],
      worked: [
        ['Both names point to ', objectLabel('A'), ', which now contains [2, 5].'],
        [symbol('active'), ' now points to ', objectLabel('B'), ' with [9]. ', symbol('watched'), ' still sees ', objectLabel('A'), '.'],
        ['The list at ', objectLabel('B'), ' now contains [9, 8]. The list at ', objectLabel('A'), ' did not change.'],
      ],
    },
    mistake: { id: 'alias-followed-rebind', message: 'Your line 4 answer shows a one-item list through both names. Which name is the assignment’s target?', cells: [
      { row: 1, column: 0, value: 'a' }, { row: 1, column: 1, value: '1' }, { row: 1, column: 2, value: '1' },
    ] },
  },
  buildPlan: {
    prompt: ['The function adds a label to the caller’s existing list, then returns the count. With ["A"] and "B", the caller sees ["A", "B!"] and receives 2. ',
      emphasis('Why can the caller see the new label?')],
    example: { input: [['A'], 'B'], expected: 2 },
    options: [{ id: 'shared', text: 'The function and caller refer to the same list, and that list changes in place.' },
      { id: 'replaced', text: 'Returning the new count makes Python replace the caller’s list.' },
      { id: 'text', text: 'Changing the text of the new label also changes the caller’s list.' }],
    correct: 'shared',
    syntax: ['The scaffold builds the new string. Make the caller’s list change, then use ', call('len()'), ' to report its current length.'],
    retry: 'The return is an integer. Follow the list reference to see what the caller can observe.',
    report: 'The tagging plan explains why a caller sees edits to a shared list.',
  },
};
