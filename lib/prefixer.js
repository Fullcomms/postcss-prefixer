const postcss = require('postcss');
const Tokenizer = require('css-selector-tokenizer');
const {
  parseAttrSelector,
  attrStringify,
  itMatchesOne,
} = require('./utils');


const prefixNode = (node, prefix) => {
  if (['class', 'id'].includes(node.type)) {
    return Object.assign({}, node, { name: `${prefix}${node.name}` });
  }

  if (['attribute'].includes(node.type) && node.content) {
    const {
      type, operator, head, classes, foot,
    } = parseAttrSelector(node);

    if (!['class', 'id'].includes(type)) return node;

    return Object.assign({}, node, {
      content: attrStringify({
        type,
        operator,
        head,
        classes: classes.map((cls) => `${prefix}${cls}`),
        foot,
      }),
    });
  }

  return node;
};

const interateSelectorNodes = (selector, options) => Object.assign({}, selector, {
  nodes: selector.nodes.map((node) => {
    if (['selector', 'nested-pseudo-class'].includes(node.type)) {
      return interateSelectorNodes(node, options);
    }

    // Check for ignored selector
    if (itMatchesOne(options.ignore, Tokenizer.stringify(node))) return node;

    // Check for included selector
    if (!itMatchesOne(options.include, Tokenizer.stringify(node))) return node;

    return prefixNode(node, options.prefix);
  }),
});


const prefixer = (options) => (css) => {
  const { prefix, ignore, include } = Object.assign({}, {
    prefix: '',
    ignore: [],
    include: []
  }, options);

  if (typeof prefix !== 'string') {
    throw new Error('@postcss-prefix: prefix option should be of type string.');
  }

  if (!Array.isArray(ignore)) {
    throw new Error('@postcss-prefix: ignore options should be an Array.');
  }

  if (!Array.isArray(include)) {
    throw new Error('@postcss-prefix: include options should be an Array.');
  }

  if (!prefix.length) return;


  css.walkRules((rule) => {
    const parsed = Tokenizer.parse(rule.selector);
    const selector = interateSelectorNodes(parsed, { prefix, ignore, include });

    /* eslint no-param-reassign: "off" */
    rule.selector = Tokenizer.stringify(selector);
  });
};

module.exports = postcss.plugin('postcss-prefixer', prefixer);
