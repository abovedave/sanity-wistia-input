import {PreviewProps} from 'sanity'
import {Player} from './Player'

type WistiaPreviewProps = PreviewProps & {subtitle?: string}

export default (props: WistiaPreviewProps) => {
  const {subtitle: hashedId, renderDefault} = props

  if (!hashedId) {
    return (
      <>
        {renderDefault({...props})}
      </>
    )
  }

  const videoUrl = `https://fast.wistia.net/embed/iframe/${hashedId}`

  return (
    <>
      {renderDefault({...props})}
      <Player videoUrl={videoUrl} />
    </>
  )
}