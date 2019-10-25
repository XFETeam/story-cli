import {configure} from '@storybook/react';
import createStory from './stories-helper';


function loadStories() {
  const req = require.context('@src', true, /\.story\.js$/);
  debugger;
  return req.keys().map(filename => {
    const params = req(filename).default;
    // console.log(111111111);
    console.log(process.env.STORYBOOK_WATCH_DIR);
    createStory.apply(null, params);
  });
}

configure(loadStories, module);

