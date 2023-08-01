import React from 'react'

import Input from './components/Input'

export function wistiaVideoRender(config) {
  return {
    components: {
      input: (props) => <Input config={config} {...props} />,
    },
  }
}