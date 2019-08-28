const dotenv = require('dotenv');
const path = require('path');

const dotenvPath = path.resolve('.env');

const dotenvFiles = [
  `${dotenvPath}.${process.env.NODE_ENV}.local`,
  `${dotenvPath}.local`,
  `${dotenvPath}.${process.env.NODE_ENV}`,
  `${dotenvPath}`,
];
dotenvFiles.forEach(dotenvFile => {
  dotenv.config({ path: dotenvFile, silent: false });
});

function middleware(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === '0' || value === 0) return 0;
  return value || null;
}

module.exports = () => {
  const env = {};
  Object.keys(process.env).forEach(key => {
    if (process.env[key]) {
      env[`process.env.${key}`] = JSON.stringify(middleware(process.env[key]));
    }
  });

  env['process.env.NODE_ENV'] = JSON.stringify(process.env.NODE_ENV);
  return env;
};
