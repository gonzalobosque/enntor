const fixture = (reference, wrong, misses) => ({ reference, wrong, misses });
export const fixtures = {
  'F01.01': {
    outputs: { 'F01.01.example': '14' },
    exercises: {
      modify: fixture('def total(base, extra):\n    return (base + extra) * 3',
        'def total(base, extra):\n    return base + extra * 3', 'ordinary'),
      build: fixture('def available(capacity, reserved):\n    return capacity * 2 - reserved',
        'def available(capacity, reserved):\n    return (capacity - reserved) * 2', 'all-reserved'),
      make: fixture('def receipt(tickets, price):\n    return tickets * price + 4',
        'def receipt(tickets, price):\n    return tickets * (price + 4)', 'zero-tickets'),
      transfer: fixture('def adjust_score(score, penalty):\n    return score * 2 - penalty',
        'def adjust_score(score, penalty):\n    return (score - penalty) * 2', 'grouping'),
    },
  },
  'F01.02': {
    outputs: { 'F01.02.example': '9 7' },
    exercises: {
      modify: fixture('def starting_reading(reading, correction):\n    recorded = reading\n    reading += correction\n    return recorded',
        'def starting_reading(reading, correction):\n    recorded = reading\n    recorded += correction\n    return recorded', 'zero'),
      build: fixture('def checkpoint_difference(start, change):\n    checkpoint = start\n    start += change\n    return start * 2 - checkpoint',
        'def checkpoint_difference(start, change):\n    checkpoint = start\n    start += change\n    return checkpoint * 2 - start', 'decrease'),
      make: fixture('def battery_after(start, used, restored):\n    snapshot = start - used\n    live = snapshot\n    live += restored\n    return snapshot + live',
        'def battery_after(start, used, restored):\n    live = start - used + restored\n    return live * 2', 'empty-after-test'),
      transfer: fixture('def calibration_score(initial, first_offset, second_offset):\n    checkpoint = initial + first_offset\n    final = checkpoint + second_offset\n    return checkpoint * 2 - final',
        'def calibration_score(initial, first_offset, second_offset):\n    checkpoint = initial + first_offset\n    final = checkpoint + second_offset\n    return checkpoint - final * 2', 'zero-checkpoint'),
    },
  },
  'F01.03': {
    outputs: { 'F01.03.example': 'True False True', 'F01.03.index': '1 0' },
    exercises: {
      modify: fixture('def matching_readings(left, right):\n    a = [left]\n    b = [right]\n    return int(a == b)',
        'def matching_readings(left, right):\n    a = [left]\n    b = [right]\n    return int(a is b)', 'equal'),
      build: fixture('def shared_slot(reading, slot):\n    original = [reading]\n    entries = [original, [reading]]\n    return int(entries[slot] is original)',
        'def shared_slot(reading, slot):\n    original = [reading]\n    entries = [original, [reading]]\n    return int(entries[slot] == original)', 'other'),
      make: fixture('def rack_badge(primary, spare, slot):\n    first = [primary]\n    slots = [first, first, [spare]]\n    selected = slots[slot]\n    return int(selected == first) + int(selected is first)',
        'def rack_badge(primary, spare, slot):\n    first = [primary]\n    slots = [first, first, [spare]]\n    return 2 * int(slots[slot] == first)', 'equal-distinct'),
      transfer: fixture('def duplicate_flag(level, replacement, left, right):\n    first = [level]\n    slots = [first, first, [replacement]]\n    a, b = slots[left], slots[right]\n    return int(a == b) - int(a is b)',
        'def duplicate_flag(level, replacement, left, right):\n    first = [level]\n    slots = [first, first, [replacement]]\n    return int(slots[left] == slots[right])', 'shared'),
    },
  },
};
