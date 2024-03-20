const path = require('node:path');

const fs = require('node:fs');

const data = fs.readFileSync(path.resolve(process.cwd(), 'raw.json'), 'utf8');

const json = JSON.parse(data);

const newData =JSON.stringify(json, null, 4);

fs.writeFileSync(path.resolve(process.cwd(), 'formatted.json'), newData)