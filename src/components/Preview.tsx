import {PreviewProps} from 'sanity'
import {Stack} from '@sanity/ui'
import {Player} from './Player'

export default (props: PreviewProps) => {
  const {subtitle: hashedId, renderDefault} = props

  return (
    <Stack space={1}>
      {renderDefault({...props})}
      {hashedId && <Player mediaUrl={`https://fast.wistia.net/embed/iframe/${hashedId}`} />}
    </Stack>
  )
}
