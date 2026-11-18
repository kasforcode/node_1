import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { config } from './config/index.js';
import { parseCsvLine, toCsvLine } from './utils/csv.js';

async function main() {
  const inputPath = path.resolve(process.cwd(), config.inputFile);
  const outputPath = path.resolve(process.cwd(), config.outputFile);
  if (!fs.existsSync(inputPath)) throw new Error(`Входной файл не найден: ${inputPath}`);

  await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
  const input = fs.createReadStream(inputPath, { encoding: 'utf8' });
  const output = fs.createWriteStream(outputPath, { encoding: 'utf8' });
  const lines = readline.createInterface({ input, crlfDelay: Infinity });
  let headers = [];
  let processed = 0;
  let accepted = 0;

  for await (const line of lines) {
    if (!line.trim()) continue;
    if (!headers.length) {
      headers = parseCsvLine(line);
      output.write(`${toCsvLine(headers)}\n`);
      continue;
    }
    processed += 1;
    const values = parseCsvLine(line);
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
    if (Number(row.age) >= config.minAge && row.city === config.cityFilter) {
      output.write(`${toCsvLine(headers.map((header) => row[header]))}\n`);
      accepted += 1;
    }
  }
  await new Promise((resolve, reject) => output.end(resolve).on('error', reject));
  console.log(`Обработано строк: ${processed}`);
  console.log(`Прошло фильтр: ${accepted}`);
}

main().catch((error) => {
  console.error(`Ошибка: ${error.message}`);
  process.exitCode = 1;
});
