import {configure} from '@storybook/react';
import createStory from './stories-helper';
// configure([
//   require.context('../src', true, /\.story\.js$/)
// ], module);

function loadStories() {
  const req = require.context('D:\\Project\\untitled205\\src', true, /\.story\.js$/);
  return req.keys().map(filename => {
    const haha = req(filename).default;
    debugger;
    createStory.apply(null, haha);
  });
}

configure(loadStories, module);

