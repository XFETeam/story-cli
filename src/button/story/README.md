# Remind 提醒

> 用于替换 alert, 起到一个弹出提醒的功能

## 基本用法

```javascript
import remind from '@src/components/remind';
createStory(
  'Remind 提醒',
  [
    {
      key: '基本',
      component: (
        <React.Fragment>
          <button onClick={() => remind('你很棒棒哦~')}>点我</button>
          <button onClick={() => remind('你很棒棒哦~', 2000)}>点我, 2秒后自动关闭</button>
        </React.Fragment>
      )
    }
  ],
  require('./README.md')
);
```

## API

当前~~~组件~~~函数签名: `remind(text, duration, componentContext)`

- {string} text - 提示文本
- {number} [duration] - 展示 duration 毫秒后关闭
- {object} [componentContext] - 组件环境变量, 当传入时可以再 componentContext 销毁时自动销毁当前组件

## 作者
艾伦
