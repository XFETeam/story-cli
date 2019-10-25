import createStory from '../../../__storybook/stories-helper';
import React from 'react';
// import Button from '../index';

const Button = ({ children }) => <div>111{children}</div>;

createStory('按钮', [
  {
    key: '基本',
    component: <Button>测试</Button>
  }
],  require('./README.md')
);
