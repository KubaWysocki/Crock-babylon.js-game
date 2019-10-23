module.exports = {
	'env': {
		'browser': true,
		'es6': true
	},
	'extends': 'eslint:recommended',
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	'parserOptions': {
		'ecmaVersion': 2018,
		'sourceType': 'module'
	},
	'rules': {
		'indent': [ 'error', 'tab' ],
		'linebreak-style': [ 'error', 'unix' ],
		'quotes': [ 'error', 'single' ],
		'semi': [ 'error', 'never'],
		'no-console': 'warn',
		'no-extra-parens': [ 'error', 'all' ],
		'no-multi-spaces': 'error',
		'array-bracket-spacing': [ 'error', 'always' ],
		'block-spacing': [ 'error', 'always' ],
		'comma-spacing': 'error',
		'computed-property-spacing': [ 'error', 'always' ],
		'eol-last': [ 'error', 'never' ],
		'indent': [ 'error', 'tab' ],
		'lines-between-class-members': 'error',
		'func-call-spacing': 'error'
	}
}