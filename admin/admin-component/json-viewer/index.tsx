import React from 'react'
{/* <JSONTree data={json} /> */}

import { JSONTree } from 'react-json-tree';
// import { Map } from 'immutable';


const theme = {
    scheme: 'monokai',
    base00: '#272822',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',
    base07: '#f9f8f5',
    base08: '#f92672',
    base09: '#fd971f',
    base0A: '#f4bf75',
    base0B: '#a6e22e',
    base0C: '#a1efe4',
    base0D: '#66d9ef',
    base0E: '#ae81ff',
    base0F: '#cc6633',
  };

interface data {
    array?: number[];
}  
const JsonViewer = (props : data ) => {
  return (
    <>
        <div className='bg-[002b36] h-[500px] overflow-scroll'>
            <JSONTree 
            data={ (props.array !== undefined && (props.array).length > 0) ? props.array : [] } 
            // theme={{
            //     // extend: theme,
            //     // underline keys for literal values
            //     valueLabel: {
            //       textDecoration: 'underline',
            //     },
            //     // switch key for objects to uppercase when object is expanded.
            //     // `nestedNodeLabel` receives additional argument `expandable`
            //     nestedNodeLabel: ({ style }, keyPath, nodeType, expanded) => ({
            //       style: {
            //         ...style,
            //         textTransform: expanded ? 'uppercase' : style.textTransform,
            //       },
            //     }),
            //   }}
            
            invertTheme={false} />
        </div>
    </>
    
  )
}

export default JsonViewer