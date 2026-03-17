import {PreviewProps} from 'sanity'
import {Stack} from '@sanity/ui'
import {Player} from './Player'

type WistiaPreviewProps = PreviewProps & {subtitle?: string}

export default (props: WistiaPreviewProps) => {
  const {subtitle: hashedId, renderDefault} = props

  return (
    <Stack space={1}>
      {renderDefault({...props})}
      {hashedId && <Player videoUrl={`https://fast.wistia.net/embed/iframe/${hashedId}`} />}
    </Stack>
  )
}
