import {useState, useCallback} from 'react'
import {Button, Card, Dialog, Flex, Text, Badge, Box, useToast} from '@sanity/ui'
import {DocumentVideoIcon, ChevronLeftIcon, LaunchIcon} from '@sanity/icons'
import {set, unset, setIfMissing} from 'sanity'

import {AssetMediaActions, WistiaMedia, WistiaInputProps, WistaAPIProject} from '../types'
import {Player} from './Player'
import {AssetMenu} from './AssetMenu'
import Folder from './Folder'
import Medias from './Medias'

const WistiaInputComponent = (props: WistiaInputProps) => {
  const {value, onChange, config, schemaType, path} = props
  const isInsideBlock = path.some((segment) => typeof segment === 'object')
  const {push: pushToast} = useToast()

  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<WistaAPIProject | null>(null)

  const handleChange = useCallback(
    (newValue: WistiaMedia) => {
      setIsPickerOpen(false)
      setSelectedProject(null)
      onChange([
        setIfMissing({_type: schemaType.name}),
        set(newValue.hashed_id, ['hashed_id']),
        set(newValue.id, ['id']),
      ])
    },
    [onChange, schemaType],
  )

  const handleClear = useCallback(() => {
    onChange(unset())
  }, [onChange])

  const handleAssetMenu = useCallback((action: AssetMediaActions) => {
    switch (action.type) {
      case 'select':
        setIsPickerOpen(true)
        break
      case 'copyUrl':
        navigator.clipboard.writeText(`https://fast.wistia.net/embed/iframe/${value?.hashed_id}`)
        pushToast({closable: true, status: 'success', title: 'URL copied to clipboard'})
        break
      case 'delete':
        handleClear()
        break
    }
  }, [value, handleClear, pushToast])

  const handleClosePicker = useCallback(() => {
    setIsPickerOpen(false)
    setSelectedProject(null)
  }, [])

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

  const videoUrl = value?.hashed_id
    ? `https://fast.wistia.net/embed/iframe/${value.hashed_id}`
    : null

  const picker = isPickerOpen && (
    <Dialog
      id="wistia-picker"
      onClose={handleClosePicker}
      width={1}
      header={
        selectedProject ? (
          <Flex justify="space-between" align="center" flex={1}>
            <Button
              icon={ChevronLeftIcon}
              onClick={() => setSelectedProject(null)}
              mode="ghost"
              text="Back to folders"
            />
            <Flex justify="space-between" align="center" flex={1}>
              <Box>
                <Flex gap={3}>
                  <Text size={1} weight="semibold">{selectedProject.name}</Text>
                </Flex>
                {selectedProject.description ? (
                  <Text size={1} muted>
                    <span dangerouslySetInnerHTML={{ __html: selectedProject.description }}></span>
                  </Text>
                ) : null}
              </Box>
              {!selectedProject.public && <Badge tone="caution" size={1}>Private</Badge>}
            </Flex>
          </Flex>
        ) : 'Select a folder'
      }
      footer={
        selectedProject ? (
          <Card tone="transparent" padding={2} paddingLeft={3}>
            <Flex justify="space-between" align="center" flex={1}>
              <Flex align="center" flex={1} gap={3}>
                <Badge tone="default" size={1}>{selectedProject.mediaCount}</Badge>
                <Text size={1}><b>Last updated:</b> {new Date(selectedProject.updated).toLocaleDateString(undefined, {day: 'numeric', month: 'short', year: 'numeric'})}</Text>
              </Flex>
              <Button
                as="a"
                href={`https://${config.accountSubdomain || 'app'}.wistia.com/folders/${selectedProject.hashedId}`}
                target="_blank"
                rel="noopener noreferrer"
                icon={LaunchIcon}
                mode="bleed"
                text="Open in Wistia"
              />
            </Flex>
          </Card>
        ) : undefined
      }
    >
      {!selectedProject ? (
        <Folder config={config} onProjectClick={setSelectedProject} />
      ) : (
        <Medias config={config} projectId={selectedProject.id} onVideoClick={handleChange} />
      )}
    </Dialog>
  )

  if (videoUrl) {
    return (
      <Card radius={2} shadow={1} padding={2}>
        <Flex justify="flex-end" marginBottom={2}>
          <AssetMenu onAction={handleAssetMenu} />
        </Flex>
        <Player videoUrl={videoUrl} />
        {picker}
      </Card>
    )
  }

  return (
    <Card tone={'inherit'} border padding={[3, 5]} style={{borderStyle: 'dashed'}}>
      <Flex align={'center'} direction={'column'} gap={4}>
        <Text muted>
          <DocumentVideoIcon />
        </Text>
        <Text size={1} muted>No media selected</Text>
        <Flex align={'center'} direction={'column'} gap={2}>
          <Button
            tone="primary"
            text="Select media"
            onClick={() => setIsPickerOpen(true)}
          />
          <Button
            as="a"
            href={`https://${config.accountSubdomain || 'app'}.wistia.com/home`}
            target="_blank"
            rel="noopener noreferrer"
            iconRight={LaunchIcon}
            mode="bleed"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            text={`${config.accountSubdomain || 'app'}.wistia.com`}
          />
        </Flex>
        {picker}
      </Flex>
    </Card>
  )
}

export default WistiaInputComponent
