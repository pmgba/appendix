import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    rules: {
      "camelcase": ["off", {"properties": "always"}],
      "comma-spacing": ["warn", {"before": false, "after": true}],
      "curly": ["warn", "multi-line", "consistent"],
      "dot-notation": ["off", {"allowKeywords": true}],
      "eqeqeq": ["warn", "smart"],
      "indent": ["warn", 2, { "SwitchCase": 1 }],
      "key-spacing": ["warn", {"beforeColon": false, "afterColon": true}],
      "new-cap": ["error", {"newIsCap": true, "capIsNew": true}],
      "no-alert": ["error"],
      "no-empty": ["error", { "allowEmptyCatch": true }],
      "no-eval": ["error"],
      "no-extend-native": ["error"],
      "no-multi-spaces": ["error"],
      "no-octal-escape": ["error"],
      "no-script-url": ["error"],
      "no-shadow": ["error", {"hoist": "functions"}],
      "no-underscore-dangle": ["error"],
      "no-unused-vars": ["warn"],
      "no-var": ["error"],
      "prefer-const": ["warn"],
      "quotes": ["off", "single"],
      "semi": ["warn", "always"],
      "space-before-blocks": ["warn", "always"],
      "space-before-function-paren": ["warn", {"anonymous": "always", "named": "never"}],
      "space-infix-ops": ["error", {"int32Hint": false}],
      "strict": ["error", "global"]
    },
    languageOptions: {
      //globals: globals.browser
      globals: {"databook": true, ...globals.browser}
    },
  },
  pluginJs.configs.recommended,
];