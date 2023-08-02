import { definePlugin } from 'sanity'

import { Config } from './types'
import { wistiaMedia } from './schema'
import { wistiaMediaRender } from './plugin'

export const wistiaInput = definePlugin<Config>((config) => ({
  name: 'sanity-plugin-sanity-wistia-input',
  schema: {
    types: [
      {
        ...wistiaMedia,
        ...wistiaMediaRender(config)
      }
    ]
  },
}))
