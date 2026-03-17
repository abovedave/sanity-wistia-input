import {useState, useCallback} from 'react'
import {Button, Card, Dialog, Flex, Text, Badge, Box, Stack, Tooltip, useToast} from '@sanity/ui'
import {
  DocumentVideoIcon,
  ChevronLeftIcon,
  LaunchIcon,
  ResetIcon,
  ClipboardIcon,
  SearchIcon,
} from '@sanity/icons'
import {set, unset, setIfMissing} from 'sanity'

import {WistiaMedia, WistiaInputProps, WistaAPIProject} from '../types'
import {Player} from './Player'
import Folder from './Folder'
import Medias from './Medias'

const WistiaInputComponent = (props: WistiaInputProps) => {
  const {value, onChange, config, schemaType, path, renderDefault} = props
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

  const handleCopyUrl = useCallback(() => {
    navigator.clipboard.writeText(`https://fast.wistia.net/embed/iframe/${value?.hashed_id}`)
    pushToast({closable: true, status: 'success', title: 'URL copied to clipboard'})
  }, [value, pushToast])

  const handleClosePicker = useCallback(() => {
    setIsPickerOpen(false)
    setSelectedProject(null)
  }, [])

  // MARK: Config error
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

  const mediaUrl = value?.hashed_id
    ? `https://fast.wistia.net/embed/iframe/${value.hashed_id}`
    : null

  // MARK: Selecting a Folder and Media
  const picker = isPickerOpen && (
    <Dialog
      id="wistia-picker"
      onClose={handleClosePicker}
      width={1}
      header={
        selectedProject ? (
          <Stack space={2}>
            <Box>
              <Button
                icon={ChevronLeftIcon}
                onClick={() => setSelectedProject(null)}
                mode="bleed"
                padding={2}
                text="All folders"
              />
            </Box>
            <Flex justify="space-between" align="center" flex={1}>
              <Stack space={2}>
                <Flex gap={3}>
                  <Text size={2} weight="semibold">
                    {selectedProject.name}
                  </Text>
                </Flex>
                {selectedProject.description ? (
                  <Text size={1} muted>
                    <span dangerouslySetInnerHTML={{__html: selectedProject.description}}></span>
                  </Text>
                ) : null}
              </Stack>
              {!selectedProject.public && (
                <Badge tone="caution" size={1}>
                  Private
                </Badge>
              )}
            </Flex>
          </Stack>
        ) : (
          'Select a folder'
        )
      }
      footer={
        selectedProject ? (
          <Card tone="transparent" padding={2} paddingLeft={3}>
            <Flex justify="space-between" align="center" flex={1}>
              <Flex align="center" flex={1} gap={3}>
                <Badge tone="default" size={1}>
                  {selectedProject.mediaCount}
                </Badge>
                <Text size={1}>
                  <b>Last updated:</b>{' '}
                  {new Date(selectedProject.updated).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
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

  // Add in any extra fields the user has defined
  const extraFields = <Stack marginTop={4}>{renderDefault(props)}</Stack>

  // MARK: Media is selected
  if (mediaUrl) {
    return (
      <Stack space={0}>
        <Card radius={2} shadow={1} padding={2}>
          <Flex justify="space-between" align="center" padding={0} paddingBottom={2} gap={1}>
            <Flex gap={1}>
              <Tooltip content={<Text size={1}>Open in Wistia</Text>} placement="top" portal>
                <Button
                  as="a"
                  href={`https://${config.accountSubdomain || 'app'}.wistia.com/medias/${value?.hashed_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={LaunchIcon}
                  mode="bleed"
                  padding={2}
                />
              </Tooltip>
              <Tooltip content={<Text size={1}>Copy embed URL</Text>} placement="top" portal>
                <Button mode="bleed" padding={2} icon={ClipboardIcon} onClick={handleCopyUrl} />
              </Tooltip>
            </Flex>
            <Flex align="center" gap={1}>
              <Button
                text="Replace"
                padding={2}
                mode="bleed"
                icon={SearchIcon}
                onClick={() => setIsPickerOpen(true)}
              />
              <Button
                text="Clear"
                padding={2}
                mode="bleed"
                icon={ResetIcon}
                tone="critical"
                onClick={handleClear}
              />
            </Flex>
          </Flex>
          <Player mediaUrl={mediaUrl} />
        </Card>
        {picker}
        {extraFields}
      </Stack>
    )
  }

  // MARK: Initial state, no media selected
  return (
    <Stack space={2}>
      <Card tone={'inherit'} border padding={[3, 5]} style={{borderStyle: 'dashed'}}>
        <Flex align={'center'} direction={'column'} gap={4}>
          <Text muted>
            <DocumentVideoIcon />
          </Text>
          <Text size={1} muted>
            No media selected
          </Text>
          <Flex align={'center'} direction={'column'} gap={2}>
            <Button tone="primary" text="Select media" onClick={() => setIsPickerOpen(true)} />
            <Button
              as="a"
              href={`https://${config.accountSubdomain || 'app'}.wistia.com/home`}
              target="_blank"
              rel="noopener noreferrer"
              iconRight={LaunchIcon}
              mode="bleed"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              text={'Open Wistia dashboard'}
            />
          </Flex>
        </Flex>
      </Card>
      {picker}
      {extraFields}
    </Stack>
  )
}

export default WistiaInputComponent
