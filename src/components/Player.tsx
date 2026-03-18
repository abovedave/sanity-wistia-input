const playerUrl = (mediaUrl: string) => {
  let params = new URLSearchParams()

  // https://wistia.com/support/developers/embed-options#options
  let wistiaSettings: any = {
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
    wmode: 'transparent',
    videoFoam: false,
    fitStrategy: 'fill',
  }

  for (let key in wistiaSettings) {
    params.append(key, wistiaSettings[key])
  }

  return `${mediaUrl}?${params.toString()}`
}

export function Player({mediaUrl}: {mediaUrl: string}) {
  return (
    <div
      style={{
        width: '100%',
        position: 'relative',
        paddingTop: '56.25%',
        height: '0',
        borderRadius: '3px',
        overflow: 'hidden',
      }}
    >
      {mediaUrl && 
        <iframe
          allow="autoplay; fullscreen; transparency"
          allowTransparency={true}
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
          }}
          src={playerUrl(mediaUrl)}
        />
      }
    </div>
  )
}
