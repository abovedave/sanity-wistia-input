import {PreviewProps} from 'sanity'
import {Stack} from '@sanity/ui'
import {Player} from './Player'

export default (props: PreviewProps) => {
  const {subtitle: hashed_id, renderDefault} = props

  return (
    <Stack space={1}>
      {renderDefault({...props})}
      {hashed_id && <Player mediaUrl={`https://fast.wistia.net/embed/iframe/${hashed_id}`} />}
    </Stack>
  )
}
