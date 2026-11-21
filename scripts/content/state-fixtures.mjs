// The reference programs are the executable H4 explanations in the lesson.
// These probes and counterexamples are authored separately from the task code.
const wrong = (source, misses) => ({ wrong: source, misses });

export const stateFixtures = {
  'F01.04': {
    outputs: { 'F01.04.list': '[4, 7] True\n[4, 7] 2 False', 'F01.04.values': '7 8 A A! 1\n[1] [1, 2] False' },
    traces: {
      'F01.04.edit-or-rebind': "['a' if active is watched else 'b', str(len(watched)), str(len(active))]",
    },
    exercises: {
      modify: wrong('def record_reading(log, reading):\n    return log + [reading]', 'one'),
      build: wrong('def tag_sample(tags, label):\n    tags.append(label)\n    return len(tags)', 'one'),
      make: wrong('def update_board(readings, replacement):\n    previous = readings[0]\n    last = readings[-1]\n    readings[0] = replacement\n    return [previous, last]', 'one'),
      transfer: wrong('def append_stop(stops, new_stop):\n    stops.append(new_stop)\n    return [stops[-1], len(stops)]', 'two'),
    },
    alternatives: {
      modify: 'def record_reading(log, reading):\n    log += [reading]\n    return log',
      make: 'def update_board(readings, replacement):\n    report = [readings[0]]\n    readings[0] = replacement\n    report.append(readings[-1])\n    return report',
      transfer: 'def append_stop(stops, new_stop):\n    report = [stops[-1], len(stops) + 1]\n    stops += [new_stop]\n    return report',
    },
  },
  'F01.05': {
    outputs: {
      'F01.05.shallow': 'True False False False\nTrue True True\n[[4, 7], [8]] [[4, 7], [8], [9]]',
      'F01.05.deep': 'True False\n[[]] [[5]]',
    },
    traces: {
      'F01.05.copy-depth': "['yes' if view is source else 'no', 'yes' if view[0] is source[0] else 'no', str(len(source[0]))]",
    },
    exercises: {
      modify: wrong('def preview_row(rows, reading):\n    view = rows[:]\n    view[0].append(reading)\n    return view', 'empty-row'),
      build: wrong('def extend_preview(rows, marker):\n    rows.append([marker])\n    return rows', 'empty'),
      make: wrong('def mark_route(legs, departure, arrival):\n    preview = legs.copy()\n    preview[0].append(departure)\n    preview[-1].append(arrival)\n    return preview', 'one-empty'),
      transfer: wrong('def approve_pack(boxes, item):\n    before = list(boxes)\n    boxes[0].append(item)\n    return before', 'two'),
    },
    alternatives: {
      build: 'def extend_preview(rows, marker):\n    return rows + [[marker]]',
      make: 'from copy import deepcopy\n\ndef mark_route(legs, departure, arrival):\n    revised = deepcopy(legs)\n    revised[0] = revised[0] + [departure]\n    revised[-1] = revised[-1] + [arrival]\n    return revised',
      transfer: 'def approve_pack(boxes, item):\n    before = boxes.copy()\n    before[0] = list(boxes[0])\n    boxes[0].append(item)\n    return before',
    },
  },
  'F01.06': {
    outputs: { 'F01.06.calls': '[[4, 7]] [[4, 7, 9]] 8', 'F01.06.replace': 'False False [[4]] [[9]]' },
    traces: {
      'F01.06.multi-call-state': "['yes' if working[0] is source[0] else 'no', str(len(source[0])), str(globals().get('score', 'unbound'))]",
    },
    exercises: {
      modify: wrong('from copy import deepcopy\n\ndef compare_batches(rows, reading):\n    before = deepcopy(rows)\n    rows[0].append(reading)\n    first = len(rows[0])\n    rows[0].append(reading + 1)\n    second = len(rows[0])\n    return [before, (first + second) * 2]', 'two'),
      build: wrong('from copy import deepcopy\n\ndef count_updates(log, morning, evening):\n    first = deepcopy(log)\n    second = deepcopy(log)\n    first[0].append(morning)\n    second[0].append(evening)\n    return len(first[0]) + 2 * len(second[0])', 'empty-first'),
      make: wrong('from copy import deepcopy\n\ndef simulate_rounds(rounds, extra, reset):\n    working = deepcopy(rounds)\n    working[0].append(extra)\n    before = working\n    working[0] = [reset]\n    return [before, working]', 'keep-all-rows'),
      transfer: wrong('def publish_rounds(rounds, increase, extra):\n    rounds[0][0] += 2 * increase\n    checkpoint = rounds.copy()\n    rounds[0][0] += extra\n    return [checkpoint, rounds[0][0]]', 'returns-to-start'),
    },
    alternatives: {
      make: 'def simulate_rounds(rounds, extra, reset):\n    first = [[*rounds[0], extra]] + rounds[1:]\n    second = [[reset]] + rounds[1:]\n    return [first, second]',
      transfer: 'def publish_rounds(rounds, increase, extra):\n    rounds[0][0] += increase + increase\n    before = [list(rounds[0])] + rounds[1:]\n    rounds[0][0] += extra\n    return [before, rounds[0][0]]',
    },
  },
};
