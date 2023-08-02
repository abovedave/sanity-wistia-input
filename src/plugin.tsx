import { ObjectInputProps } from 'sanity'

import Input from './components/Input'

import { Config } from './types'

export function wistiaMediaRender(config: Config) {
  return {
    components: {
      input: (props: ObjectInputProps) => <Input config={config} {...props} />,
    },
  }
}