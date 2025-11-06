import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
	{
		"env": {
			"browser": true,
			"es2021": true,
			"node": true
		},
		"extends": "eslint:recommended",
		"overrides": [],
		"parserOptions": {
			"ecmaVersion": "latest",
			"sourceType": "module"
		},
		"rules": {
			"indent": [
				"error",
				2
			],
			"quotes": [
				"error",
				"single"
			],
			"semi": [
				"error",
				"always"
			],
			"no-case-declarations": "off"
		}
	}
];