import { addParameters, configure } from '@storybook/react';
import createStory from './stories-helper';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

addParameters({
    options: {
        panelPosition: 'right'
    },
    viewport: {
        defaultViewport: STORY_VIEWPORT || 'desktop',
        viewports: {
            desktop: {
                name: 'desktop',
                styles: {
                    border: 0,
                    margin: '0!important',
                    width: '100%',
                    height: '100%',
                }
            },
            ...INITIAL_VIEWPORTS
        },
    }
});

function loadStories() {
    // noinspection JSUnresolvedFunction
    const req = require.context('@src', true, /\.story\.js$/);
    req.keys().forEach(filename => {
        const params = req(filename).default;
        createStory.apply(null, params);
    });
    return req;
}

configure(loadStories, module);
