const playerUrl = (videoUrl: string) => {
  let params = new URLSearchParams()

  // https://wistia.com/support/developers/embed-options#options
  let wistiaSettings = {
    playbar: true,
    playButton: true,
    seo: false,
    controlsVisibleOnLoad: true,
    autoPlay: false,
    doNotTrack: true,
    preload: 'none',
    volumeControl: true,
    copyLinkAndThumbnailEnabled: true,
    fullscreenButton: true,
  }

  for (let key in wistiaSettings) {
    params.append(key, wistiaSettings[key])
  }

  return `${videoUrl}?${params.toString()}`
}

export function Player({
  videoUrl,
}: {
  videoUrl: string
}) {
  return (
    <div style={{
      position: 'relative',
      paddingTop: '56.25%',
      height: '0',
    }}>
      <iframe
        allow="autoplay; fullscreen"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
          border: '0',
          display: 'block',
          borderRadius: '3px'
        }}
        src={playerUrl(videoUrl) || ''}
      />
    </div>
  )
}
