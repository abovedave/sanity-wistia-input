import {useEffect, useState, useRef} from 'react'
import {Card, Flex, Text, Box, Spinner, Button} from '@sanity/ui'
import {ChevronLeftIcon} from '@sanity/icons'

import {Config, WistiaMedia} from '../types'
import Projects from './Projects'

interface WistiaUploaderInstance {
  bind: (event: string, callback: Function) => void
  unbind: (event: string) => void
  setFileName: (name: string) => void
  setFileDescription: (description: string) => void
  cancel: () => void
  removePreview: () => void
}

declare global {
  interface Window {
    _wapiq: Array<(W: any) => void>
    wistiaUploader?: WistiaUploaderInstance
  }
}

const WistiaUploadComponent = ({
  config,
  onUploadComplete,
  onCancel,
}: {
  config: Config
  onUploadComplete: (media: WistiaMedia) => void
  onCancel: () => void
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const uploaderContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Wistia uploader script and CSS
    const script = document.createElement('script')
    script.src = '//fast.wistia.com/assets/external/api.js'
    script.async = true
    script.onload = () => setIsScriptLoaded(true)
    document.head.appendChild(script)

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '//fast.wistia.com/assets/external/uploader.css'
    document.head.appendChild(link)

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [])

  useEffect(() => {
    if (isScriptLoaded && selectedProjectId && uploaderContainerRef.current) {
      // Initialize Wistia uploader
      window._wapiq = window._wapiq || []
      window._wapiq.push(function (W: any) {
        if (window.wistiaUploader) {
          window.wistiaUploader.removePreview()
        }

        const uploader = new W.Uploader({
          accessToken: config.token,
          dropIn: 'wistia_uploader_container',
          projectId: selectedProjectId,
        })

        window.wistiaUploader = uploader

        // Bind upload events
        uploader.bind('uploadstart', () => {
          setIsUploading(true)
          setUploadProgress(0)
        })

        uploader.bind('uploadprogress', (progress: number) => {
          setUploadProgress(Math.round(progress * 100))
        })

        uploader.bind('uploadsuccess', (file: any, media: any) => {
          console.log('Upload success:', media)
        })

        uploader.bind('uploadembeddable', (file: any, media: any) => {
          // Video is ready - return the media info
          onUploadComplete({
            id: media.id,
            hashed_id: media.hashed_id,
          })
          setIsUploading(false)
        })

        uploader.bind('uploadfailed', (file: any, error: any) => {
          console.error('Upload failed:', error)
          setIsUploading(false)
        })

        uploader.bind('uploadcancelled', () => {
          setIsUploading(false)
        })
      })
    }

    return () => {
      // Cleanup uploader on unmount
      if (window.wistiaUploader) {
        window.wistiaUploader?.unbind('uploadstart')
        window.wistiaUploader?.unbind('uploadprogress')
        window.wistiaUploader?.unbind('uploadsuccess')
        window.wistiaUploader?.unbind('uploadembeddable')
        window.wistiaUploader?.unbind('uploadfailed')
        window.wistiaUploader?.unbind('uploadcancelled')
      }
    }
  }, [isScriptLoaded, selectedProjectId, config.token, onUploadComplete])

  const handleProjectClick = (projectId: number) => {
    setSelectedProjectId(projectId)
  }

  const handleBackToProjects = () => {
    setSelectedProjectId(null)
    if (window.wistiaUploader) {
      window.wistiaUploader?.removePreview()
    }
  }

  if (!selectedProjectId) {
    return (
      <Projects config={config} onProjectClick={handleProjectClick} />
    )
  }

  return (
    <Box>
      <Card tone="default" borderBottom={true} padding={4}>
        <Flex gap={2} align="center">
          <Button
            icon={ChevronLeftIcon}
            onClick={handleBackToProjects}
            mode="ghost"
            text="Back to projects"
            disabled={isUploading}
          />
          {isUploading && (
            <Flex gap={2} align="center" style={{marginLeft: 'auto'}}>
              <Spinner muted />
              <Text size={1} muted>
                Uploading: {uploadProgress}%
              </Text>
            </Flex>
          )}
        </Flex>
      </Card>

      <Card padding={4}>
        {!isScriptLoaded ? (
          <Flex align="center" direction="column" gap={3} height="fill" justify="center">
            <Spinner muted />
            <Text muted size={1}>
              Loading uploader...
            </Text>
          </Flex>
        ) : (
          <div id="wistia_uploader_container" ref={uploaderContainerRef} />
        )}
      </Card>
    </Box>
  )
}

export default WistiaUploadComponent
