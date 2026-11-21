import type { LessonSequence } from './load-course-pack';
import { call, code, emphasis, operator, token, foundationLesson, ladder, prediction, symbol, task } from './python-foundation';

const id = 'F01.02';
const concept = 'python.rebinding';
const batterySolution = 'def battery_after(start, used, restored):\n    saved = start - used\n    remaining = saved\n    remaining += restored\n    return saved + remaining';
export const f0102Exercises = [
  prediction(id, concept, 'stock = 12\nbefore = stock\nstock = stock - 5\nstock += 2\nprint(before - stock)', 3),
  task(id, concept, {
    key: 'modify', revision: '1.1.0', kind: 'modify', title: 'Keep the starting reading', entryPoint: 'starting_reading',
    prompt: ['A logger applies a correction but must report the reading ', emphasis('before the correction'), '. Update ',
      call('starting_reading()'), '. Both inputs are integers: ', symbol('reading'), ' is the original reading and ',
      symbol('correction'), ' is the signed adjustment. Return the original reading as an integer. With a reading of 6 and a correction of −2, the live reading becomes 4 and the function returns 6.'],
    starter: 'def starting_reading(reading, correction):\n    recorded = reading\n    reading += correction\n    return reading',
    hints: [{ level: 'H0', text: ['Trace a nonzero correction. Which name changes its binding and which name keeps its starting value?'] }],
    cases: [['decrease', [6, -2], 6], ['increase', [3, 5], 3], ['none', [10, 0], 10],
      ['zero', [0, 4], 0], ['negative', [-5, 5], -5], ['cross', [2, -8], 2]],
  }),
  task(id, concept, {
    key: 'build', kind: 'write', title: 'Score a checkpoint', entryPoint: 'checkpoint_difference',
    prompt: ['Complete ', call('checkpoint_difference()'), '. The starter takes a snapshot of ', symbol('start'), ' and updates the live reading by ',
      symbol('change'), '. Both inputs are signed integers. The score is ', emphasis('twice the updated reading minus the earlier snapshot'), '. Return the integer score. For (8, −3), the updated reading is 5, so return 2.'],
    starter: 'def checkpoint_difference(start, change):\n    checkpoint = start\n    start += change\n    pass  # Return the difference here.',
    hints: [{ level: 'H0', text: 'Which name refers to the earlier checkpoint after the update?' }],
    cases: [['decrease', [8, -3], 2], ['increase', [2, 6], 14], ['none', [7, 0], 7],
      ['zero', [0, -5], -10], ['negative', [-5, 2], -1], ['cross', [-2, 9], 16]],
  }),
  task(id, concept, {
    key: 'make', revision: '1.2.0', kind: 'write', title: 'Add the two battery measurements', entryPoint: 'battery_after',
    prompt: ['A technician measures the battery’s charge after a test and again after a top-up. The lab compares runs using a single score made from two charge measurements. Use the starting charge to work out the measurements. It is ', emphasis('not included'), ' in the score.\n\n',
      emphasis('Measurement 1'), ' is the charge after the test uses power. ', emphasis('Measurement 2'), ' is the charge after the top-up. The report adds these two measurements so every run contributes one number.\n\n',
      'Define ', call('battery_after()'), ' with ', symbol('start'), ' (starting charge), ', symbol('used'), ' (charge consumed in the test), and ', symbol('restored'), ' (charge added by the top-up), in that order. All are nonnegative integers and the test cannot use more than the starting charge. Return the score as an integer.\n\n',
      'Example: start at 5. The test uses 2, so the first measurement is 3. The top-up adds 1, so the second is 4. Return 7.'],
    coaching: { unusedCalculationQuestion: 'Which of the two recorded measurements is missing from the return value?' },
    hints: ladder('Mark the two moments at which a reading is recorded. Does the top-up affect both?',
      'Keep one name for the first recorded charge and another for the charge that changes.',
      'The test leaves 7 units. The snapshot stays at 7 when the live value is rebound to 9. The return uses both readings, so a top-up of zero would instead make the sum twice the first reading.', batterySolution),
    cases: [['ordinary', [10, 3, 2], 16], ['timeline', [5, 2, 1], 7], ['empty-after-test', [5, 5, 2], 2], ['no-top-up', [8, 3, 0], 10],
      ['no-use', [8, 0, 3], 19], ['all-zero', [0, 0, 0], 0], ['empty-start', [0, 0, 4], 4]],
  }),
  task(id, concept, {
    key: 'make-transfer', revision: '1.2.0', kind: 'transfer', title: 'Score two meter adjustments', entryPoint: 'calibration_score',
    prompt: ['A technician adjusts a meter twice and keeps the reading after the first adjustment as a checkpoint. Each ', emphasis('offset'), ' is a signed change: a positive value increases the current reading, a negative value decreases it, and zero leaves it unchanged.\n\n',
      'Start at ', symbol('initial'), '. After ', symbol('first_offset'), ', record the checkpoint. Apply ', symbol('second_offset'), ' to that reading to reach the final reading. Checkpoint accuracy has extra weight in the score: return twice the checkpoint reading minus the final reading.\n\n',
      'Define ', call('calibration_score()'), ' with those three signed integer inputs in that order. Return an integer. Example: (7, −2, 3) takes the meter from 7 to checkpoint 5, then to final reading 8. Twice 5 minus 8 gives a score of 2.'],
    hints: ladder('Identify the two readings that the score uses. The starting reading is only where the first adjustment begins.',
      'On paper, write the checkpoint before applying the second change. Which of the two values is doubled?',
      'The first adjustment moves 7 to 5. The next moves 5 to 8, but the checkpoint is still 5. The score uses both 5 and 8.',
      'def calibration_score(initial, first_offset, second_offset):\n    checkpoint = initial + first_offset\n    final_reading = checkpoint + second_offset\n    return 2 * checkpoint - final_reading'),
    cases: [['ordinary', [7, -2, 3], 2], ['equal', [3, 2, 0], 5], ['negative', [-4, 1, 5], -8],
      ['zero-checkpoint', [6, -6, -3], 3], ['all-zero', [0, 0, 0], 0], ['cross', [-3, 6, -2], 5]],
  }),
];

export const f0102Lesson = foundationLesson({
  id, title: 'Variables and reassignment', prerequisites: ['F01.01'],
  objectives: ['Trace the binding of a name across assignments and integer updates.', 'Retain an earlier reading while updating a live name.'],
  teachingBlocks: [
    { id: id + '.intro', type: 'paragraph', content: ['In the previous lesson, you followed the expression on the right of an assignment. Now keep a row of state after each assignment. Python evaluates the right-hand expression first, then binds the left-hand name. An integer cannot change in place. An integer update rebinds the name to the result.'] },
    { id: id + '.example', type: 'worked-example', language: 'python', code: 'level = 9\ncheckpoint = level\nlevel = level - 4\nlevel += 2\nprint(checkpoint, level)',
      explanation: ['Read the assignments forward. After line 1, ', symbol('level'), ' refers to 9. After line 2, both names refer to 9. After line 3, ', symbol('checkpoint'), ' still refers to 9 and ', symbol('level'), ' refers to 5. The last update takes 5 to 7. The printed pair is ', code('9 7'), '. With a zero adjustment the numeric readings could agree, so use a nonzero change to check whether your trace distinguishes the two bindings.'] },
    { id: id + '.warning', type: 'warning', content: ['Assigning an integer to a second name does not connect the two names forever. Track each left-hand name independently when updates follow.'] },
  ],
  mentorTips: [{ id: id + '.tip', text: 'Draw a row after each assignment. Save which names still point to the earlier value.', sourceRefs: ['P01'] }],
}, f0102Exercises);
f0102Lesson.version = '1.3.0';

export const f0102Sequence: LessonSequence = {
  draftsFromLesson: '1.1.0',
  resumeFrom: { '1.2.0': { [id + '.make']: '1.1.0', [id + '.make-transfer']: '1.1.0' } },
  equivalentExerciseVersions: { [id + '.modify']: ['1.0.0'], [id + '.make']: ['1.1.0', '1.0.0'], [id + '.make-transfer']: ['1.1.0', '1.0.0'] },
  trace: {
    id: id + '.state-trace', version: '1.0.0', title: 'Trace both bindings',
    prompt: ['Record the value each name refers to ', emphasis('just after'), ' each assignment. Enter ', token('unbound'), ' if a name has not been assigned yet.'],
    source: f0102Exercises[0].starterCode!.split('\n').slice(0, 4).join('\n'),
    columns: ['stock', 'before'],
    rows: [
      { label: 'Line 1', expected: ['12', 'unbound'] }, { label: 'Line 2', expected: ['12', '12'] },
      { label: 'Line 3', expected: ['7', '12'] }, { label: 'Line 4', expected: ['9', '12'] },
    ],
    help: {
      concept: 'Give each name its own column. A change in one column does not automatically change the other.',
      guidance: ['Evaluate the expression on the right, then move only the name on the left. On line 4, ', operator('+='), ' uses the value of ', symbol('stock'), ' from line 3.'],
      worked: [
        'Only stock has been assigned, so before has no binding yet.',
        'The assignment gives before the value currently bound to stock.',
        'Subtract five from stock and rebind it. The assignment does not target before.',
        'Add two to the current stock. Before still holds the earlier reading.',
      ],
    },
    mistake: { id: 'snapshot-followed-rebinding', message: 'Your last two rows move both names together. Which name appears on the left of each update?',
      cells: [{ row: 2, column: 0, value: '7' }, { row: 2, column: 1, value: '7' },
        { row: 3, column: 0, value: '9' }, { row: 3, column: 1, value: '9' }] },
  },
  learnTitle: 'Trace the name that changes',
  titleAccent: 'reassignment',
  predictionCoaching: {
    explanation: ['Start the stock trace with 12. ', symbol('before'), ' retains that reading. ', symbol('stock'), ' drops to 7 and then rises to 9. The expression compares 12 and 9, so Python prints 3.'],
    modifyFeedback: 'Try a nonzero correction. If the function returns the new reading, identify which name is handed back to the caller.',
    hypothesis: {
      id: 'snapshot-followed-rebinding', answer: 0,
      possibleReasoning: 'A result of zero could come from treating both names as if they pointed to the final reading of 9.',
      actualReasoning: 'Only stock is rebound by the two updates. Before still refers to 12, so the difference is 3.',
      question: 'Did you trace both names as changing?', confirm: 'Yes, I changed both names',
      confirmedFeedback: 'Try a state table with a separate column for each name.',
      rejectedFeedback: 'Trace both updates, then substitute the final value of each name in the print expression.',
      report: { confirmed: 'You confirmed tracing both names as changing.', rejected: 'You rejected the shared-update explanation.',
        unconfirmed: 'Treating both names as updated was a possible explanation.' },
    },
    followUp: { code: 'live = 4\nsnapshot = live\nlive += 6\nlive -= 1\nprint(live - snapshot)', expected: 5,
      hint: 'Fill the snapshot column once and update the live column twice.',
      explanation: 'The live reading is 9 and the snapshot is 4, so the difference is 5.' },
  },
  buildPlan: {
    prompt: 'The checkpoint stores the reading before the update. The score is twice the updated reading minus the checkpoint reading. The checkpoint is 8 and the update changes the reading by −3, to 5. Which value is doubled, and what score does that give?',
    example: { input: [8, -3], expected: 2 },
    options: [{ id: 'change', text: 'Double 5. The score is 2.' }, { id: 'reverse', text: 'Double 8. The score is 11.' }],
    correct: 'change', syntax: 'Keep the saved value distinct from the live name. Use the supplied bindings to calculate the score.',
    retry: 'The checkpoint is the earlier value. Which value does the rule double?',
    report: 'In Build, at least one plan doubled the earlier checkpoint instead of the updated reading.',
  },
};
