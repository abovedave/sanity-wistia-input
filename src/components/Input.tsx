import {useState, useCallback} from 'react'
import {Button, Card, Dialog, Flex, Text, Badge, Box, Stack, Tooltip, useToast, Heading} from '@sanity/ui'
import {
  DocumentVideoIcon,
  ChevronLeftIcon,
  LaunchIcon,
  ResetIcon,
  LinkIcon,
  SearchIcon,
} from '@sanity/icons'
import {set, unset, setIfMissing} from 'sanity'

import {WistiaMedia, WistiaAPIMedias, WistiaInputProps, WistaAPIProject} from '../types'
import {Player} from './Player'
import Folder from './Folder'
import Medias from './Medias'
import {useWistiaData} from '../hooks/useWistiaData'

const WistiaInputComponent = (props: WistiaInputProps) => {
  const {value, onChange, config, schemaType, renderDefault} = props
  const {push: pushToast} = useToast()

  const [isPickerMounted, setIsPickerMounted] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFolderLoading, setIsFolderLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState<WistaAPIProject | null>(null)
  const [loadingProjectId, setLoadingProjectId] = useState<number | null>(null)
  const [visibleProject, setVisibleProject] = useState<WistaAPIProject | null>(null)

  const {
    data: projects,
    loadingMore: projectsLoadingMore,
    error: projectsError,
    hasMore: hasMoreProjects,
    loadMore: loadMoreProjects,
  } = useWistiaData<WistaAPIProject>(
    isPickerMounted ? '/folders?sort_by=updated&sort_direction=0' : null,
    config,
    () => {
      setIsFolderLoading(false)
      setIsDialogOpen(true)
    },
  )

  const {
    data: medias,
    loadingMore: mediasLoadingMore,
    hasMore: hasMoreMedias,
    loadMore: loadMoreMedias,
  } = useWistiaData<WistiaAPIMedias>(
    selectedProject ? `/medias?folder_id=${selectedProject.id}&sort_by=name` : null,
    config,
    () => {
      setLoadingProjectId(null)
      setVisibleProject(selectedProject)
    },
  )

  const handleChange = useCallback(
    (newValue: WistiaMedia) => {
      setIsPickerMounted(false)
      setIsDialogOpen(false)
      setSelectedProject(null)
      setVisibleProject(null)
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

  const handleOpenPicker = useCallback(() => {
    setIsFolderLoading(true)
    setIsPickerMounted(true)
  }, [])

  const handleClosePicker = useCallback(() => {
    setIsPickerMounted(false)
    setIsDialogOpen(false)
    setSelectedProject(null)
    setVisibleProject(null)
    setLoadingProjectId(null)
    setIsFolderLoading(false)
  }, [])

  const handleProjectClick = useCallback((project: WistaAPIProject) => {
    setLoadingProjectId(project.id)
    setSelectedProject(project)
  }, [])

  // MARK: Config error
  if (!config?.token?.length) {
    return (
      <Card padding={[3, 3, 4]} radius={2} shadow={1} tone="critical">
        <Text align="center">
          Missing required API token in Sanity config.{' '}
          <a href="https://docs.wistia.com/docs/making-api-requests">
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
  const picker = isDialogOpen && (
    <Dialog
      id="wistia-picker"
      onClose={handleClosePicker}
      animate
      width={1}
      header={
        visibleProject ? (
          <Stack space={3}>
            <Flex justify="space-between">
              <Button
                icon={ChevronLeftIcon}
                onClick={() => {
                  setSelectedProject(null)
                  setVisibleProject(null)
                }}
                mode="bleed"
                padding={2}
                space={2}
                text="All folders"
              />
              <Button
                as="a"
                href={`https://${config.accountSubdomain || 'app'}.wistia.com/folders/${visibleProject.hashed_id}`}
                target="_blank"
                rel="noopener noreferrer"
                icon={LaunchIcon}
                mode="bleed"
                padding={2}
                space={2}
                text="Open in Wistia"
              />
            </Flex>
            <Flex justify="space-between" align="center" flex={1} paddingBottom={0}>
              <Stack space={3}>
                <Heading as="h2" size={2}>
                  {visibleProject.name}
                </Heading>
                {visibleProject.description ? (
                  <Text size={1} muted>
                    {visibleProject.description.replace(/<[^>]*>/g, '').trim()}
                  </Text>
                ) : null}
              </Stack>
            </Flex>
          </Stack>
        ) : (
          'Select a folder'
        )
      }
      footer={
        visibleProject ? (
          <Card tone="transparent" paddingX={4} paddingY={3}>
            <Flex align="center" gap={3}>
              <Flex align="center" flex={1} gap={1}>
                <Badge tone="default">
                  {visibleProject.media_count} items
                </Badge>
                {!visibleProject.public && (
                  <Badge tone="caution">
                    Private
                  </Badge>
                )}
              </Flex>
              <Text title={visibleProject.created} size={1}>
                <b>Created</b>{' '}
                {new Date(visibleProject.created).toLocaleDateString(undefined, {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
              <Text title={visibleProject.updated} size={1}>
                <b>Updated</b>{' '}
                {new Date(visibleProject.updated).toLocaleDateString(undefined, {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </Flex>
          </Card>
        ) : undefined
      }
    >
      {!visibleProject ? (
        <Folder
          config={config}
          projects={projects}
          loadingProjectId={loadingProjectId}
          error={projectsError}
          hasMore={hasMoreProjects}
          loadingMore={projectsLoadingMore}
          onProjectClick={handleProjectClick}
          onLoadMore={loadMoreProjects}
        />
      ) : (
        <Medias
          config={config}
          medias={medias}
          hasMore={hasMoreMedias}
          loadingMore={mediasLoadingMore}
          onVideoClick={handleChange}
          onLoadMore={loadMoreMedias}
        />
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
              <Tooltip animate content={<Text size={1}>Open in Wistia</Text>} placement="top" portal>
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
              <Tooltip animate content={<Text size={1}>Copy embed URL</Text>} placement="top" portal>
                <Button mode="bleed" padding={2} icon={LinkIcon} onClick={handleCopyUrl} />
              </Tooltip>
            </Flex>
            <Flex align="center" gap={1}>
              <Button
                text="Replace"
                padding={2}
                space={2}
                mode="bleed"
                icon={SearchIcon}
                loading={isFolderLoading}
                onClick={handleOpenPicker}
              />
              <Button
                text="Clear"
                padding={2}
                space={2}
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
      <Card tone={'inherit'} radius={2} border padding={2} paddingLeft={3}>
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={3}>
            <Box flex="none">
              <Text size={2}><DocumentVideoIcon /></Text>
            </Box>
            <Text size={1} muted>
              No media selected
            </Text>
          </Flex>
          <Flex align="center" gap={1}>
            <Button
              as="a"
              href={`https://${config.accountSubdomain || 'app'}.wistia.com/home`}
              target="_blank"
              rel="noopener noreferrer"
              icon={LaunchIcon}
              mode="bleed"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              text={'Open Wistia'}
              padding={2}
              space={2}
            />
            <Button
              mode="bleed"
              text="Select"
              icon={SearchIcon}
              loading={isFolderLoading}
              onClick={handleOpenPicker}
              padding={2}
              space={2}
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
