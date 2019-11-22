import {configure, addParameters} from '@storybook/react';
import createStory from './stories-helper';

addParameters({
    options: {
        panelPosition: 'right'
    }
});

function loadStories() {
    const req = require.context('@src', true, /\.story\.js$/);
    return req.keys().map(filename => {
        const params = req(filename).default;
        createStory.apply(null, params);
    });
}

configure(loadStories, module);
