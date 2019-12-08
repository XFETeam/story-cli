import React from 'react';

export default class StoryLayout extends React.PureComponent {
    render() {
        const { children } = this.props;
        return (
            <div id="story-layout">
                <style>
                    {
                        `
                          * {
                            padding: 0;
                            margin: 0;
                            box-sizing: border-box;
                          }
                          
                          #story-layout {
                            width: 750px;
                            margin: auto;
                            height: 100vh;
                          }
                          
                          @media all and (max-width: 750px) {
                            #story-layout {
                              width: 100%
                            }
                          }
                        `
                    }
                </style>
                {children}
            </div>
        );
    }
}
