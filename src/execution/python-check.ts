const listTypes = [
  'def _enntor_list_data(value):',
  '    if type(value) is list:',
  '        return all(_enntor_list_data(item) for item in value)',
  '    return type(value) in (int, str)',
  '_enntor_invalid_types = []',
  'if not _enntor_list_data(_enntor_return):',
  '    _enntor_invalid_types.append("return")',
  'if not _enntor_list_data(_enntor_args):',
  '    _enntor_invalid_types.append("arguments")',
];

export function pythonCheckSource(entryPoint: string, observeArguments: boolean) {
  const observation = observeArguments ? '[_enntor_return, _enntor_args, _enntor_invalid_types]' : '_enntor_return';
  return [
    'import json as _enntor_json',
    '_enntor_args = _enntor_json.loads(_enntor_args_json)',
    '_enntor_return = ' + entryPoint + '(*_enntor_args)',
    ...(observeArguments ? listTypes : []),
    '_enntor_json.dumps(' + observation + ', allow_nan=False)',
  ].join('\n');
}
