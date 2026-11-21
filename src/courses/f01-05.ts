import type { LessonSequence } from './load-course-pack';
import { call, code, emphasis, foundationLesson, ladder, listCase, operator, prediction, symbol, task, token } from './python-foundation';

const id = 'F01.05';
const concept = 'python.nested-copies';

export const f0105Exercises = [
  prediction(id, concept, 'original = [[6]]\npreview = original.copy()\npreview.append([8])\npreview[0].append(9)\nprint(len(original) + len(original[0]))', 3),
  task(id, concept, {
    key: 'modify', kind: 'modify', title: 'Keep preview edits away from the source', entryPoint: 'preview_row',
    prompt: ['A review screen previews an extra reading in the first group. Change ', call('preview_row()'), ' so the review returns the edited groups ',
      emphasis('without changing any of the caller’s groups'), '. ', symbol('rows'), ' is a nonempty list of lists of integers. Each group is its own list, and any group may be empty. ',
      symbol('reading'), ' is an integer. For ([[4], [9]], 7), return [[4, 7], [9]] and leave the caller’s groups at [[4], [9]].'],
    starter: 'def preview_row(rows, reading):\n    preview = rows.copy()\n    preview[0].append(reading)\n    return preview',
    hints: ladder('The preview already returns the expected contents. What also happens to the original first group?',
      'Compare the outer lists and their first rows separately. Which object is actually edited?',
      ['The first row is shared by a shallow copy. ', call('deepcopy()'),
        ' creates an independent first row, so adding 7 to the preview gives [[4, 7], [9]] while the source stays [[4], [9]].'],
      'from copy import deepcopy\ndef preview_row(rows, reading):\n    preview = deepcopy(rows)\n    preview[0].append(reading)\n    return preview'),
    cases: [
      listCase('two', [[[4], [9]], 7], [[4, 7], [9]]), listCase('empty-row', [[[]], 0], [[0]]),
      listCase('equal-rows', [[[5], [5]], 5], [[5, 5], [5]]), listCase('negative', [[[-1], []], -3], [[-1, -3], []]),
      listCase('later-empty', [[[2], [], []], 4], [[2, 4], [], []]), listCase('order', [[[1, 9], [6]], 7], [[1, 9, 7], [6]]),
    ],
  }),
  task(id, concept, {
    key: 'build', kind: 'write', title: 'Add a group to a planning preview', entryPoint: 'extend_preview',
    prompt: ['Complete ', call('extend_preview()'), '. ', symbol('rows'), ' is a possibly empty list of groups. Each group is a separate list of integers. ',
      'Return the existing groups in order followed by a new final group containing only the integer ', symbol('marker'),
      '. Leave the caller’s groups unchanged. For ([[2]], 5), return [[2], [5]] and leave the source as [[2]].'],
    starter: 'def extend_preview(rows, marker):\n    preview = rows.copy()\n    group = [marker]\n    pass  # Place the new group and return the preview.',
    hints: ladder('Does the new number belong inside a current group or in a separate group?',
      ['Only the outer preview needs a new entry. The scaffold gives that group the name ', symbol('group'), '.'],
      ['Append [5] to the outer preview and return it. The preview becomes [[2], [5]], and the shared existing row is left alone.'],
      'def extend_preview(rows, marker):\n    preview = rows.copy()\n    group = [marker]\n    preview.append(group)\n    return preview'),
    cases: [
      listCase('one', [[[2]], 5], [[2], [5]]), listCase('empty', [[], 0], [[0]]),
      listCase('empty-row', [[[]], -2], [[], [-2]]), listCase('duplicate', [[[4], [4]], 4], [[4], [4], [4]]),
      listCase('mixed', [[[], [8, 4]], 9], [[], [8, 4], [9]]), listCase('negative', [[[-5, 0]], -1], [[-5, 0], [-1]]),
    ],
  }),
  task(id, concept, {
    key: 'make', kind: 'write', title: 'Add route markers without changing the source', entryPoint: 'mark_route',
    prompt: ['A planning tool previews extra markers on a route. The route is divided into ordered legs, each represented by a list of marker IDs.\n\n',
      'Define ', call('mark_route()'), ' with ', symbol('legs'), ' (a nonempty list of lists of integers), ',
      symbol('departure'), ' (an integer), and ', symbol('arrival'), ' (an integer), in that order. Each leg has its own list, which may be empty.\n\n',
      'Return the route with the departure marker added to the end of its ', emphasis('first leg'),
      ' and the arrival marker added to the end of its ', emphasis('last leg'),
      '. For a one-leg route, that same leg gets both markers in departure-then-arrival order. Keep all entries, including duplicates. ',
      'Leave the caller’s route and every original inner list unchanged.\n\n',
      'With ([[4], [], [9]], 2, 7), return [[4, 2], [], [9, 7]]. With ([[]], 2, 7), return [[2, 7]].'],
    hints: ladder('Draw the first and last legs of a route with only one leg. What should appear in that leg after both updates?',
      'The returned route needs two inner-list edits, while the caller’s inner lists must keep their existing contents.',
      ['A ', call('deepcopy()'), ' gives the preview its own inner lists. On [[4], [], [9]], adding 2 and 7 to the respective ends gives [[4, 2], [], [9, 7]]. On a one-leg route, both updates go to one inner list.'],
      'from copy import deepcopy\ndef mark_route(legs, departure, arrival):\n    preview = deepcopy(legs)\n    preview[0].append(departure)\n    preview[-1].append(arrival)\n    return preview'),
    cases: [
      listCase('three', [[[4], [], [9]], 2, 7], [[4, 2], [], [9, 7]]), listCase('one-empty', [[[]], 2, 7], [[2, 7]]),
      listCase('one-full', [[[1, 3]], -1, 4], [[1, 3, -1, 4]]), listCase('duplicate', [[[1], [1]], 1, 1], [[1, 1], [1, 1]]),
      listCase('different-ends', [[[], [6]], 3, 0], [[3], [6, 0]]), listCase('last-empty', [[[3, 5], []], 9, -3], [[3, 5, 9], [-3]]),
    ],
  }),
  task(id, concept, {
    key: 'make-transfer', kind: 'transfer', title: 'Keep a pre-approval packing snapshot', entryPoint: 'approve_pack',
    prompt: ['Packing staff add a newly approved item to the first box. The activity log also needs the complete packing contents ', emphasis('before'),
      ' approval.\n\n', 'Define ', call('approve_pack()'), ' with ', symbol('boxes'), ' (a nonempty list of separate lists of integer item IDs) and ',
      symbol('item'), ' (an integer). Append the item ID to the end of the ', emphasis('caller’s first box'),
      ', even if that box is empty or already contains the same ID. Return the full contents of all boxes as they were before the approval.\n\n',
      'For ([[4], [8]], 3), the caller sees [[4, 3], [8]] and the return is [[4], [8]].'],
    hints: ladder('Which list should reflect the approval? Which list should show what was packed before?',
      'Think about the two states of the first box. The report needs its earlier contents while the caller retains the later contents.',
      ['Make an independent snapshot before approval. Adding 3 to the caller’s first box changes it to [4, 3]. The independently copied first box remains [4] in the report.'],
      'from copy import deepcopy\ndef approve_pack(boxes, item):\n    before = deepcopy(boxes)\n    boxes[0].append(item)\n    return before'),
    cases: [
      listCase('two', [[[4], [8]], 3], [[4], [8]], [[4, 3], [8]]), listCase('empty-row', [[[]], 0], [[]], [[0]]),
      listCase('duplicate', [[[6], [6]], 6], [[6], [6]], [[6, 6], [6]]), listCase('negative', [[[-1, 2]], -7], [[-1, 2]], [[-1, 2, -7]]),
      listCase('several', [[[2], [], [4, 1]], 5], [[2], [], [4, 1]], [[2, 5], [], [4, 1]]),
      listCase('zero', [[[0]], 8], [[0]], [[0, 8]]),
    ],
  }),
];

export const f0105Lesson = {
  ...foundationLesson({
    id, title: 'Copy, shallow copy and nested lists', prerequisites: ['F01.04'],
    objectives: ['Distinguish assignment, slicing, list construction and shallow copying from deep copying.', 'Choose an appropriate copy and verify whether editing a nested list reaches the source.'],
    teachingBlocks: [
      { id: id + '.intro', type: 'paragraph', content: ['A stock planner wants to try changes without affecting the source data. When each entry is itself a list, draw two levels: an outer list of slots, and the inner lists the slots point to. A slot can point to the same inner list as a slot in another outer list.'] },
      { id: id + '.shallow', type: 'worked-example', language: 'python',
        code: 'source = [[4], [8]]\nalias = source\nsliced = source[:]\nbuilt = list(source)\npreview = source.copy()\nprint(alias is source, sliced is source, built is source, preview is source)\nprint(sliced[0] is source[0], built[0] is source[0], preview[0] is source[0])\npreview.append([9])\npreview[0].append(7)\nprint(source, preview)',
        explanation: [operator('='), ' gives ', symbol('alias'), ' the same reference. The full slice ', code('[:]'), ', ',
          call('list()'), ' and ', call('copy()'), ' each make a new outer list with the same inner references. That is a ',
          emphasis('shallow copy'), '. Adding [9] to the outer preview leaves the source at two rows. Adding 7 to the first inner row reaches the source too, because both outer lists point to that row.'],
      },
      { id: id + '.deep', type: 'worked-example', language: 'python',
        code: 'from copy import deepcopy\nsource = [[]]\npreview = deepcopy(source)\nprint(preview == source, preview[0] is source[0])\npreview[0].append(5)\nprint(source, preview)',
        explanation: ['The import makes ', call('deepcopy()'), ' available from Python’s standard library. For these nested lists, it copies the outer list and the inner lists. The contents initially compare equal, but even the empty first rows are different objects. Appending 5 changes only the preview. Use a shallow copy for outer-only edits and consider a deep copy when inner lists must be independent.'],
      },
      { id: id + '.warning', type: 'warning', content: [emphasis('Equal before the edit'), ' does not tell you whether lists share a reference. Test the inner edit you plan to make.'] },
    ],
    mentorTips: [
      { id: id + '.tip-outer', text: 'Picture two outer boxes pointing to the same inner list when you make a shallow copy.', sourceRefs: ['P02'] },
      { id: id + '.tip-mutation', text: 'Change a nested item on purpose to test isolation. Initial equality cannot show that isolation.', sourceRefs: ['P02'] },
    ],
  }, f0105Exercises),
  estimatedMinutes: 22,
};

export const f0105Sequence: LessonSequence = {
  learnTitle: 'Draw the outer list and its rows separately',
  titleAccent: 'nested lists',
  offerTransferPractice: true,
  predictionCoaching: {
    explanation: [symbol('preview'), ' has a new outer list, so adding [8] there leaves the original with one row. Its first row is shared. Adding 9 there makes that row contain two entries. The two lengths add up to 3.'],
    followUp: {
      code: 'from copy import deepcopy\nsource = [[6]]\npreview = deepcopy(source)\npreview[0].append(9)\nprint(len(source[0]))', expected: 1,
      hint: ['Check whether a ', call('deepcopy()'), ' shares its first row with the source.'],
      explanation: [symbol('preview'), ' has a separate inner list, so ', symbol('source'), ' keeps one entry in its first row.'],
    },
  },
  trace: {
    id: id + '.copy-depth', version: '1.0.0', title: 'Which objects are shared?',
    prompt: ['After each shown line, compare ', symbol('view'), ' and ', symbol('source'), '. Give ', token('yes'), ' or ',
      token('no'), ' for whether they refer to the same outer list and whether their first rows refer to the same inner list. In the last column enter the ',
      emphasis('number of items in the source’s first row'), ' as an integer.'],
    source: 'from copy import deepcopy\nsource = [[4]]\nview = source\nview = source[:]\nview[0].append(7)\nview = deepcopy(source)\nview[0].append(9)',
    columns: ['Same outer list?', 'Same first row object?', 'Source first row length'],
    rows: [
      { label: 'Line 3', expected: ['yes', 'yes', '1'] }, { label: 'Line 5', expected: ['no', 'yes', '2'] },
      { label: 'Line 7', expected: ['no', 'no', '2'] },
    ],
    help: {
      concept: 'Draw the outer lists above their first rows, then follow each arrow before counting entries.',
      guidance: ['The slice creates a new outer list. ', call('deepcopy()'), ' separates both levels. Check what each edit can reach.'],
      worked: [
        [symbol('view'), ' points to the same object as ', symbol('source'), ', so it also sees the same first row [4].'],
        ['The outer lists are separate, but they still share the first row. The edit makes that row [4, 7] in both.'],
        ['The deep copy has its own first row. Appending 9 there leaves the source row [4, 7].'],
      ],
    },
    mistake: { id: 'shallow-separated-inner', message: 'Your row for line 5 shows separate inner objects. At which level did the full slice create a new list?', cells: [
      { row: 1, column: 0, value: 'no' }, { row: 1, column: 1, value: 'no' }, { row: 1, column: 2, value: '1' },
    ] },
  },
  buildPlan: {
    prompt: ['The planning preview keeps its existing groups and adds one new group at the end. The source stays unchanged. Starting with [[2]] and marker 5, which result adds a ',
      emphasis('separate group'), '?'],
    example: { input: [[[2]], 5], expected: [[2], [5]] },
    options: [{ id: 'outer', text: 'Return [[2], [5]]. Leave the source as [[2]].' },
      { id: 'inner', text: 'Return [[2, 5]]. Leave the source as [[2]].' },
      { id: 'source', text: 'Return [[2], [5]]. Also add [5] to the source.' }],
    correct: 'outer',
    syntax: ['The scaffold makes a new outer list with ', call('copy()'),
      '. Since no existing row changes, sharing those inner lists is sufficient for this task.'],
    retry: 'The example needs a second group in the preview and still has one group in the source.',
    report: 'The planning choice distinguishes an outer-list update from an inner-list edit.',
  },
};
