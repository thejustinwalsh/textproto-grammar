const getAliases = () => {
    const packageJson = require('./package.json');
    const {
        contributes: {
            languages: [{
                id: languageId = 'textproto',
                aliases: languageAliases = [],
            }],
        },
    } = packageJson;
    const aliases = languageAliases
        .map((x) => x.toLowerCase())
        .filter((x) => x !== languageId);
    return aliases;
};

/** @type LanguageFn */
const textproto = (hljs) => {
    /** @type Mode */
    const HERE_DOCS = {
        begin: /<<\s*(?=[A-Z_a-z]+)/,
        starts: {
            contains: [
                hljs.END_SAME_AS_BEGIN({
                    begin: /([A-Z_a-z]+)/,
                    end: /([A-Z_a-z]+)/,
                    className: 'string',
                }),
            ],
        },
    };
    return {
        name: 'Protocol Buffer Text Format',
        aliases: getAliases(),
        contains: [
            hljs.QUOTE_STRING_MODE,
            hljs.NUMBER_MODE,
            hljs.HASH_COMMENT_MODE,
            {
                className: 'object',
                begin: /{/,
                end: /}/,
                contains: [
                    hljs.QUOTE_STRING_MODE,
                    hljs.NUMBER_MODE,
                    hljs.HASH_COMMENT_MODE,
                    HERE_DOCS,
                ],
            },
            HERE_DOCS,
        ],
    };
};

module.exports.activate = () => ({
    extendMarkdownIt(/** @type MarkdownIt */md) {
        const { highlight: defaultHighlight } = md.options;
        md.use(require('markdown-it-highlightjs/core'), {
            hljs: require('highlight.js/lib/core'),
            register: {
                textproto,
            },
        });
        const { highlight: coreHighlight } = md.options;
        // eslint-disable-next-line no-param-reassign
        md.options.highlight = (code, lang) => coreHighlight(code, lang)
            || defaultHighlight(code, lang);
        return md;
    },
});
