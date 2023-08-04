import {useState, useCallback} from 'react'
import {Button, Dialog, Card, Flex, Text, useToast} from '@sanity/ui'
import {DocumentVideoIcon, ChevronLeftIcon, PlayIcon} from '@sanity/icons'
import {set, unset} from 'sanity'

import {AssetMediaActions, WistiaMedia, WistiaInputProps} from '../types'

import Projects from './Projects'
import Videos from './Videos'

import {Player} from './Player'
import {AssetMenu} from './AssetMenu'

const WistiaInputComponent = (props: WistiaInputProps) => {
  const {value, onChange, config} = props

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState(0)

  const handleChange = useCallback(
    (newValue: WistiaMedia) => {
      setIsModalOpen(false)
      onChange(newValue ? set(newValue) : unset())
    },
    [onChange],
  )

  const handleProjectClick = (projectId: number) => {
    setSelectedProjectId(projectId)
  }

  const handleAssetMenu = (action: AssetMediaActions) => {
    switch (action?.type) {
      case 'copyUrl':
        handleCopyURL()
        break
      case 'delete':
        handleChange({})
        break
      case 'select':
        setIsModalOpen(true)
        break
    }
  }

  const videoUrl = value?.hashed_id
    ? `https://fast.wistia.net/embed/iframe/${value.hashed_id}`
    : null

  const {push: pushToast} = useToast()

  const handleCopyURL = useCallback(() => {
    navigator.clipboard.writeText(videoUrl || '')
    pushToast({closable: true, status: 'success', title: 'The URL is copied to the clipboard'})
  }, [pushToast, videoUrl])

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  if (!config?.token?.length) {
    return (
      <Card padding={[3, 3, 4]} radius={2} shadow={1} tone="critical">
        <Text align="center">
          Missing required API token in Sanity config.{' '}
          <a href="https://wistia.com/support/developers/making-api-requests">
            See Wistia documentation.
          </a>
        </Text>
      </Card>
    )
  }

  return (
    <div style={{padding: 1}}>
      {videoUrl ? (
        <Card radius={2} shadow={1} padding={2}>
          <Flex justify="space-between" align="center" gap={2} marginBottom={2}>
            <Text size={1} weight="semibold" cellPadding={2}>
              <PlayIcon style={{marginLeft: 3, marginRight: 3}} />
              Wistia video ID: {value?.id}
            </Text>
            <AssetMenu onAction={handleAssetMenu} />
          </Flex>

          <Player videoUrl={videoUrl || ''} />
        </Card>
      ) : (
        <Card tone={'inherit'} border padding={[3, 5]} style={{borderStyle: 'dashed'}}>
          <Flex align={'center'} direction={'column'} gap={4}>
            <Text muted>
              <DocumentVideoIcon />
            </Text>

            <Text size={1} muted>
              Select a media from Wistia
            </Text>

            <Button mode="ghost" text="Select media" onClick={toggleModal} />
          </Flex>
        </Card>
      )}

      {isModalOpen && (
        <Dialog
          header={selectedProjectId ? 'Select media' : 'Select project'}
          id="wistia-projects"
          onClose={toggleModal}
          width={1}
        >
          {!selectedProjectId ? (
            <Projects config={config} onProjectClick={handleProjectClick} />
          ) : (
            <div>
              <Card tone="default" borderBottom={true} padding={4}>
                <Button
                  icon={ChevronLeftIcon}
                  onClick={() => handleProjectClick(0)}
                  mode="ghost"
                  text="Back to projects"
                />
              </Card>
              <Videos config={config} projectId={selectedProjectId} onVideoClick={handleChange} />
            </div>
          )}
        </Dialog>
      )}
    </div>
  )
}

export default WistiaInputComponent
