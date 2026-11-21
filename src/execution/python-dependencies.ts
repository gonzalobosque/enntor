import { pythonLanguage } from '@codemirror/lang-python';

type Node = ReturnType<typeof pythonLanguage.parser.parse>['topNode'];

function children(node: Node) {
  const nodes: Node[] = [];
  for (let cursor = node.firstChild; cursor; cursor = cursor.nextSibling) {
    if (cursor.name !== 'Comment') nodes.push(cursor);
  }
  return nodes;
}

// Only make a dependency claim for a single straight-line arithmetic function.
// Branches, calls, tuple assignment, attributes and other forms use the case fallback.
export function unusedCalculation(source: string, entryPoint: string | undefined) {
  if (!entryPoint || source.length > 8192) return undefined;
  const text = (node: Node) => source.slice(node.from, node.to);
  const [fn, ...other] = children(pythonLanguage.parser.parse(source).topNode);
  if (fn?.name !== 'FunctionDefinition' || other.length) return undefined;
  const name = fn.getChild('VariableName');
  const body = fn.getChild('Body');
  if (!name || text(name) !== entryPoint || !body) return undefined;
  function arithmetic(node: Node, depth = 0): boolean {
    if (depth > 32) return false;
    if (node.name === 'VariableName' || node.name === 'Number') return true;
    if (node.name === 'ParenthesizedExpression') {
      const parts = children(node);
      return parts.length === 3 && arithmetic(parts[1], depth + 1);
    }
    const [left, op, right, ...rest] = children(node);
    return node.name === 'BinaryExpression' && !!left && !!op && !!right && !rest.length &&
      ['+', '-', '*', '//', '%', '/'].includes(text(op)) && arithmetic(left, depth + 1) && arithmetic(right, depth + 1);
  }
  function names(node: Node): string[] {
    return node.name === 'VariableName' ? [text(node)] : children(node).flatMap(names);
  }
  const statements = children(body).slice(1);
  const returned = statements.pop();
  const result = returned && children(returned)[1];
  if (returned?.name !== 'ReturnStatement' || !result || !arithmetic(result)) return undefined;
  const calculations: { name: string; statement: number }[] = [];
  const expressions: Node[] = [];
  for (const [index, statement] of statements.entries()) {
    const [target, op, value, ...rest] = children(statement);
    if (target?.name !== 'VariableName' || !op || !value || rest.length || !arithmetic(value)) return undefined;
    if (statement.name === 'AssignStatement' && text(op) === '=') {
      expressions.push(value);
      if (value.name !== 'VariableName' && value.name !== 'Number') calculations.push({ name: text(target), statement: index });
    } else if (statement.name === 'UpdateStatement' && ['+=', '-=', '*=', '//=', '%=', '/='].includes(text(op))) {
      expressions.push(statement);
    } else return undefined;
  }
  expressions.push(result);
  const unused = calculations.filter(({ name, statement }) =>
    !expressions.slice(statement + 1).some(node => names(node).includes(name)));
  return unused.length === 1 ? unused[0].name : undefined;
}
