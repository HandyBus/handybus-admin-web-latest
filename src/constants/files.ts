import path from 'path';

export const CWD_PATH = process.cwd();
export const DATA_PATH = path.join(CWD_PATH, 'src/data');
export const REGIONS_PATH = path.join(DATA_PATH, 'regions.json');
