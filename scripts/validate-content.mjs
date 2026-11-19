import { validateContent } from './content/validate.mjs';

try {
  const reports = await validateContent(process.argv.slice(2));
  console.log(reports.join('\n\n'));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
