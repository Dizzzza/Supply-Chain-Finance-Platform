const jwt = require('jsonwebtoken');

const SECRET_KEY = '9D8E3F61ADF9812E22482DCD7262D';

const token = jwt.sign({ role: 'frontend' }, SECRET_KEY);
console.log(token)