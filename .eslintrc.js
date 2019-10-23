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
		'indent': [ 'error', 4 ],
		'linebreak-style': 'error',
		'quotes': [ 'error', 'single' ],
		'prefer-template': 'warn',
		'semi': [ 'error', 'never'],
		'no-console': 'warn',
		'no-extra-parens': 'error', 
		'no-multi-spaces': 'error',
		'no-trailing-spaces': 'error',
		'space-before-function-paren': [ 'error', 'never' ],
		'space-before-blocks': [ 'error', 'never' ],
		'space-in-parens': [ 'error', 'always' ],
		'array-bracket-spacing': [ 'error', 'always' ],
		'block-spacing': 'error',
		'comma-spacing': 'error',
		'computed-property-spacing': [ 'error', 'always' ],
		'func-call-spacing': 'error',
		'rest-spread-spacing': 'error',
		'arrow-spacing': 'error',
		'object-curly-spacing': [ 'error', 'always' ],
		'eol-last': [ 'error', 'never' ],
		'lines-between-class-members': 'error',
	}
}