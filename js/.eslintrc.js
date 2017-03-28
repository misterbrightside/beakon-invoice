module.exports = {
    "extends": "airbnb",
    "parser": "babel-eslint",
    "plugins": [
        "lodash",
        "transform-class-properties",
        "react",
        "jsx-a11y",
        "import"
    ],
    "presets": ["es2015", "latest"],
    "env": {
    	"browser": true,
        "jquery": true,
        "XLSX": true
    },
    "rules": {
    	"react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    },
};