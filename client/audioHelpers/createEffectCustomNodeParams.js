export default (effect, i) => [effect, i ? i - 1 : 'output'];
