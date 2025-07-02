const createStrategy = require('./5-strategy-interfaces');

const strategy = createStrategy('agent', ['notify', 'multicast']);

console.log(strategy);
