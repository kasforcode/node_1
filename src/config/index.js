import 'dotenv/config';

const required = ['INPUT_FILE', 'OUTPUT_FILE', 'MIN_AGE', 'CITY_FILTER'];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Не задана переменная окружения ${key}`);
}

export const config = {
  inputFile: process.env.INPUT_FILE,
  outputFile: process.env.OUTPUT_FILE,
  minAge: Number(process.env.MIN_AGE),
  cityFilter: process.env.CITY_FILTER
};

if (!Number.isFinite(config.minAge)) throw new Error('MIN_AGE должен быть числом');
