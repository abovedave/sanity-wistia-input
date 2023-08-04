import {ObjectInputProps} from 'sanity'

export interface Config {
  token: string | ''
}

export interface WistiaInputProps extends ObjectInputProps {
  config: Config
}

export interface WistiaMedia {
  id?: number
  hashed_id?: string
}

export interface AssetMediaActions {
  type: 'copyUrl' | 'delete' | 'select'
}

export interface WistaAPIProject {
  id: number
  name: string | ''
  mediaCount: number | 0
  created: string
  updated: string
  hashedId: string
  public: boolean | true
  publicId: string
  description: string | ''
}

export interface WistiaAPIMedias {
  id: number
  name: string | ''
  duration: number | 0
  created: string
  updated: string
  hashed_id: string
  description: string | ''
  thumbnail: WistiaAPIMediaThumbnail
}

export interface WistaMediasGrouped {
  [key: string]: WistiaAPIMedias[]
}

export interface WistiaAPIMediaThumbnail {
  url: string
  width: number
  height: number
}
