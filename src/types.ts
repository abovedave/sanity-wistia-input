import {ObjectInputProps, FieldDefinition} from 'sanity'

export interface Config {
  token: string | ''
  accountSubdomain?: string
  fields?: FieldDefinition[]
}

export interface WistiaInputProps extends ObjectInputProps {
  config: Config
}

export interface WistiaMedia {
  id?: number
  hashed_id?: string
}

export interface WistaAPIProject {
  id: number
  name: string | ''
  media_count: number | 0
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
  section?: string
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
