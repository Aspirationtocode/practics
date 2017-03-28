require('../views/index.pug');
require('../views/about.pug');

import css from '../styles/main.styl';

import math from './modules/math';

console.log(`Hello from app.js and webpack-dev-server ${math.sum(1, 3 ** 3)} times!`);
