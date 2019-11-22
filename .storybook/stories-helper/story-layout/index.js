import React from 'react';

export default class StoryLayout extends React.PureComponent {
  render() {
    const {children} = this.props;
    return (
      <div style={{ width: 750, margin: 'auto', height: '100vh'}}>
        <style>
          {
            `
              * {
                padding: 0;
                margin: 0;
                box-sizing: border-box;
              }
            `
          }
        </style>
        {children}
      </div>
    );
  }
}
