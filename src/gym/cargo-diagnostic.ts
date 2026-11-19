import { pythonLanguage } from '@codemirror/lang-python';
import type { DiagnosticObservation, WorkoutDiagnostic } from './diagnostic';
import { cargoWorkout } from './f01-workout';

type PythonNode = ReturnType<typeof pythonLanguage.parser.parse>['topNode'];

function children(node: PythonNode) {
  const parts: PythonNode[] = [];
  for (let child = node.firstChild; child; child = child.nextSibling) {
    if (child.name !== 'Comment') parts.push(child);
  }
  return parts;
}

function ungroup(node: PythonNode): PythonNode {
  let current = node;
  while (current.name === 'ParenthesizedExpression') {
    const inner = children(current)[1];
    if (!inner) break;
    current = inner;
  }
  return current;
}

function reversedSubtraction(source: string, entryPoint: string) {
  if (source.length > 8192) return false;
  const [fn, ...rest] = children(pythonLanguage.parser.parse(source).topNode);
  if (fn?.name !== 'FunctionDefinition' || rest.length) return false;
  const text = (node: PythonNode) => source.slice(node.from, node.to);
  const functionName = fn.getChild('VariableName');
  const signature = fn.getChild('ParamList');
  const body = fn.getChild('Body');
  if (!functionName || text(functionName) !== entryPoint || !signature || !body) return false;

  const parameters = signature.getChildren('VariableName').map(text);
  if (parameters.length !== 2 || parameters[0] === parameters[1]) return false;
  const [gross, pallets] = parameters;
  const [, statement, ...more] = children(body);
  if (statement?.name !== 'ReturnStatement' || more.length) return false;
  const [, result] = children(statement);
  if (!result) return false;
  const expression = ungroup(result);
  const [left, op, right] = children(expression);
  if (expression.name !== 'BinaryExpression' || !left || !op || !right || text(op) !== '-') return false;
  const packaging = ungroup(left);
  const total = ungroup(right);
  if (total.name !== 'VariableName' || text(total) !== gross || packaging.name !== 'BinaryExpression') return false;
  const [a, mul, b] = children(packaging);
  if (!a || !mul || !b || text(mul) !== '*') return false;
  const isPallets = (node: PythonNode) => ungroup(node).name === 'VariableName' && text(ungroup(node)) === pallets;
  const isFour = (node: PythonNode) => ungroup(node).name === 'Number' && text(ungroup(node)) === '4';
  return (isPallets(a) && isFour(b)) || (isFour(a) && isPallets(b));
}

export const diagnoseCargo: WorkoutDiagnostic = (exercise, submission) => {
  if (exercise.id !== cargoWorkout.id || exercise.version !== cargoWorkout.version ||
      submission.grade?.verdict !== 'failed') return undefined;
  const observations = exercise.grading.publicCases.flatMap((test, index): DiagnosticObservation[] => {
    const run = submission.runs?.[index];
    if (run?.status !== 'completed' || !submission.grade?.evidence.some(({ id, passed }) => id === test.id && !passed) ||
        typeof test.expected !== 'number' || !Array.isArray(test.input) ||
        !test.input.every((value): value is number => typeof value === 'number')) return [];
    const actual = run.value;
    return [{ kind: typeof actual === 'number' && actual < 0 && test.expected > 0
      ? 'negative-for-positive' : 'unexpected-result',
      caseId: test.id, inputs: test.input, actual: typeof actual === 'number' ? actual : JSON.stringify(actual) ?? 'no value',
      expected: test.expected }];
  });

  const negative = observations.find((item) => item.caseId === 'multiple-pallets' &&
    typeof item.actual === 'number' && item.expected > 0 && item.actual === -item.expected);
  const zero = observations.find((item) => item.caseId === 'no-pallets' &&
    typeof item.actual === 'number' && item.expected > 0 && item.actual === -item.expected);
  if (negative && zero && exercise.execution?.entryPoint &&
      reversedSubtraction(submission.source, exercise.execution.entryPoint)) {
    return {
      observation: negative,
      hypothesis: { id: 'reversed-subtraction', question: 'You may have started with the pallet weight instead of the full scale reading. Is that how you worked it out?' },
      nudge: { id: 'compare-no-pallets', question: 'What should the cargo weigh when there are no pallets? Compare that with what your function gives for that case.' },
    };
  }

  const first = observations[0];
  if (!first) return undefined;
  return {
    observation: first,
    nudge: { id: 'trace-one-case', question: 'Pick this one case and work out what the scale reading represents. At which point does your calculation stop matching what the dispatch record needs?' },
  };
};
