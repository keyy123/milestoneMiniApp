module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
        "es2021": true,
        "node": true
	},
	"extends": "eslint:recommended",
	"overrides": [
	],
	"parserOptions": {
		"ecmaVersion": "latest"
	},
	"rules": {
		"indent": [
			"error",
			4
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
    ],
    curly: 2,
    eqeqeq: 2,
		"semi": [
			"error",
			"always"
		]
	}
};
