const fs = require('fs');
const path = require('path');

fs.writeFileSync(require.resolve('@storybook/core/dist/server/build-dev.js'), fs.readFileSync(path.resolve(__dirname, 'build-dev.tpl.js')).toString());
