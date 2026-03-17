import {ObjectInputProps, PreviewProps} from 'sanity'
import {Config} from './types'

import Input from './components/Input'
import Preview from './components/Preview'

export function wistiaMediaRender(config: Config) {
  return {
    components: {
      input: (props: ObjectInputProps) => <Input config={config} {...props} />,
      preview: (props: PreviewProps) => <Preview {...(props as PreviewProps & {subtitle?: string})} />,
    },
  }
}
