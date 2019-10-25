import React from 'react';
import {storiesOf} from '@storybook/react';
import StoryLayout from './story-layout';
import {addReadme} from 'storybook-readme';
import {jsxDecorator} from 'storybook-addon-jsx';

/**
 * 创建 story
 * @param name - 故事名
 * @param keyValues - 故事 key value 键值对, 结构为: [{key, component}]
 * @param README
 */
export default function createStory(name, keyValues, README) {
    const story = storiesOf(name, module)
        .addDecorator(addReadme)
        .addDecorator(jsxDecorator)
        .addDecorator(story => story());
    keyValues.forEach(({key, component}) => {
        story.add(key, () => component, {
            readme: {
                sidebar: README,
            },
            jsx: {
                onBeforeRender: domString => {
                    try {
                        return domString.match(/{$(.|\n)+?type(.|\n)+?}/igm)[0].match(/content: <>(.+)<\/>?,/)[1];
                    } catch (e) {
                        return domString
                    }
                },
                indent_size: 2
            }
        });
    });
}
