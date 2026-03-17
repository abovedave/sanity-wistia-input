import {definePlugin} from 'sanity'

import {Config} from './types'
import {wistiaMedia} from './schema'
import {wistiaMediaRender} from './plugin'

/**
 * Wistia input plugin for Sanity Studio
 * @public
 */
export const wistiaInput = definePlugin<Config>((config) => ({
  name: 'sanity-plugin-wistia-input',
  schema: {
    types: [
      {
        ...wistiaMedia,
        fields: [
          ...wistiaMedia.fields,
          ...(config.fields ?? []).filter(
            (f) => !wistiaMedia.fields.some((base) => base.name === (f as {name: string}).name),
          ),
        ],
        ...wistiaMediaRender(config),
      },
    ],
  },
}))
