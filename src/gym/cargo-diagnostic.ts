import { pythonLanguage } from '@codemirror/lang-python';
import type { WorkoutDiagnostic } from '../execution/diagnostics';
import { diagnoseExecution, failedReturnCases } from '../execution/diagnostics';
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

function cargoPattern(source: string, entryPoint: string) {
  if (source.length > 8192) return undefined;
  const [fn, ...rest] = children(pythonLanguage.parser.parse(source).topNode);
  if (fn?.name !== 'FunctionDefinition' || rest.length) return undefined;
  const text = (node: PythonNode) => source.slice(node.from, node.to);
  const functionName = fn.getChild('VariableName');
  const signature = fn.getChild('ParamList');
  const body = fn.getChild('Body');
  if (!functionName || text(functionName) !== entryPoint || !signature || !body) return undefined;

  const parameters = signature.getChildren('VariableName').map(text);
  if (parameters.length !== 2 || parameters[0] === parameters[1]) return undefined;
  const [gross, pallets] = parameters;
  const [, statement, ...more] = children(body);
  if (statement?.name !== 'ReturnStatement' || more.length) return undefined;
  const [, result] = children(statement);
  if (!result) return undefined;
  const expression = ungroup(result);
  function binary(node: PythonNode, operator: string) {
    const bare = ungroup(node);
    const [left, op, right] = children(bare);
    if (bare.name === 'BinaryExpression' && left && op && right && text(op) === operator) {
      return [ungroup(left), ungroup(right)] as const;
    }
    return undefined;
  }
  const nameIs = (node: PythonNode, value: string) => node.name === 'VariableName' && text(node) === value;
  const four = (node: PythonNode) => node.name === 'Number' && text(node) === '4';
  const product = binary(expression, '*');
  if (product) {
    const difference = four(product[0]) ? binary(product[1], '-') : four(product[1]) ? binary(product[0], '-') : undefined;
    if (difference && nameIs(difference[0], gross) && nameIs(difference[1], pallets)) return 'grouping';
  }
  const difference = binary(expression, '-');
  if (difference && nameIs(difference[1], gross)) {
    const packaged = binary(difference[0], '*');
    if (packaged && ((nameIs(packaged[0], pallets) && four(packaged[1])) ||
      (four(packaged[0]) && nameIs(packaged[1], pallets)))) return 'reversed';
  }
  return undefined;
}

export const diagnoseCargo: WorkoutDiagnostic = (exercise, submission, previous = []) => {
  const execution = diagnoseExecution(exercise, submission);
  if (execution) return execution;
  if (submission.grade?.verdict !== 'failed') return undefined;
  const observations = failedReturnCases(exercise, submission);
  const missing = observations.find((item) => item.kind === 'missing-return');
  if (missing) return {
    observation: missing,
    nudge: { id: 'find-missing-return', question: 'This call produced no numeric return value. Follow the path through your function. Where does the caller receive the result?' },
  };

  if (exercise.id === cargoWorkout.id && exercise.version === cargoWorkout.version && exercise.execution?.entryPoint) {
    const pattern = cargoPattern(submission.source, exercise.execution.entryPoint);
    const negative = observations.find((item) => item.caseId === 'multiple-pallets' &&
      typeof item.actual === 'number' && item.expected > 0 && item.actual === -item.expected);
    const zero = observations.find((item) => item.caseId === 'no-pallets' &&
      typeof item.actual === 'number' && item.expected > 0 && item.actual === -item.expected);
    if (negative && zero && pattern === 'reversed') return {
      observation: negative,
      hypothesis: { id: 'reversed-subtraction', question: 'You may have started with the pallet weight instead of the full scale reading. Is that how you worked it out?' },
      nudge: { id: 'compare-no-pallets', question: 'What should the cargo weigh when there are no pallets? Compare that with what your function gives for that case.' },
    };
    const grouped = observations.find(({ inputs: [gross, pallets], actual }) => actual === (gross - pallets) * 4);
    if (pattern === 'grouping' && grouped) return {
      observation: { ...grouped, kind: 'grouping' },
      hypothesis: { id: 'grouped-before-conversion', question: 'You may have combined a weight and a pallet count before checking their units. Is that what you intended?' },
      nudge: { id: 'compare-units', question: 'Take one intermediate result in this case. Does it represent kilograms or a count of pallets?' },
    };
  }

  // Prefer a failed case that hasn't already been the focus of previous checks.
  const tried = new Set(previous.flatMap((entry) => entry.grade?.evidence.filter(({ passed }) => !passed).map(({ id }) => id) ?? []));
  const first = observations.find(({ caseId }) => !tried.has(caseId)) ?? observations[0];
  if (!first) return undefined;
  const edge = exercise.grading.publicCases[0]?.id !== first.caseId &&
    submission.grade.evidence.some(({ passed }) => passed);
  return {
    observation: edge ? { ...first, kind: 'edge-case' } : first,
    nudge: edge ? { id: 'trace-boundary-case', question: 'What changes in this boundary case compared with one that already passes?' }
      : { id: 'trace-one-case', question: 'Pick this one case and work it out using the exercise requirements. Where does your result first differ from what the task asks for?' },
  };
};
