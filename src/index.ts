import { definePlugin } from 'sanity'

import { wistiaMedia } from './schema'
import { wistiaMediaRender } from './plugin'

interface Config {
  token: string | null
}

export const wistiaInput = definePlugin<Config | void>((config = {}) => {
  return {
    name: 'sanity-plugin-sanity-wistia-input',
    schema:{ 
      types: [
        {
          ...wistiaMedia,
          ...wistiaMediaRender(config)
        }
      ]
    },
  }
})
