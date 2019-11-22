import React from 'react';
import {storiesOf} from '@storybook/react';
import StoryLayout from './story-layout';
import {addReadme} from 'storybook-readme';

/**
 * 创建 story
 * @param name - 故事名
 * @param keyValues - 故事 key value 键值对, 结构为: [{key, component}]
 * @param README
 */
export default function createStory(name, keyValues, README) {
    const story = storiesOf(name, module)
        .addDecorator(addReadme)
        .addDecorator(story => <StoryLayout>{story()}</StoryLayout>);
    keyValues.forEach(({key, component}) => {
        story.add(key, () => component, {
            readme: {
                sidebar: README,
            }
        });
    });
}
