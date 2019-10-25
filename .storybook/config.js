import {configure} from '@storybook/react';
import createStory from './stories-helper';


function loadStories() {
  const req = require.context('@src', true, /\.story\.js$/);
  return req.keys().map(filename => {
    const params = req(filename).default;
    createStory.apply(null, params);
  });
}

configure(loadStories, module);

