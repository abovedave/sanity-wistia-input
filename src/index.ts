import { definePlugin } from 'sanity'

import { wistiaVideo } from './schema'
import { wistiaVideoRender } from './plugin'

interface Config {
  token: string | null
}

export const wistiaInput = definePlugin<Config | void>((config = {}) => {
  return {
    name: 'sanity-plugin-sanity-wistia-input',
    schema:{ 
      types: [
        {
          ...wistiaVideo,
          ...wistiaVideoRender(config)
        }
      ]
    },
  }
})
