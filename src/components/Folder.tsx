import {memo, useState} from 'react'
import {Spinner, Card, Flex, Text, Box, Tooltip, Button, Badge, Stack} from '@sanity/ui'
import {LockIcon, LaunchIcon, FolderIcon} from '@sanity/icons'

import {Config, WistaAPIProject} from '../types'

const WistiaProjectsComponent = ({
  projects,
  loadingProjectId,
  error,
  hasMore,
  loadingMore,
  onProjectClick,
  onLoadMore,
  config,
}: {
  projects: WistaAPIProject[]
  loadingProjectId: number | null
  error: string
  hasMore: boolean
  loadingMore: boolean
  onProjectClick: (project: WistaAPIProject) => void
  onLoadMore: () => void
  config: Config
}) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  if (error) {
    return (
      <Box padding={3}>
        <Card padding={[3, 3, 4]} radius={2} shadow={1} tone="critical">
          <Text align="center">{error}</Text>
        </Card>
      </Box>
    )
  }

  return (
    <>
      {projects.length
        ? projects.map((project: WistaAPIProject) => (
            <Card
              key={project.id}
              paddingTop={3}
              paddingBottom={3}
              paddingRight={3}
              paddingLeft={4}
              radius={1}
              style={{cursor: 'pointer'}}
              onClick={() => onProjectClick(project)}
              tone={
                loadingProjectId === project.id || hoveredId === project.id ? 'primary' : 'inherit'
              }
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              as="button"
            >
              <Flex justify="space-between" align="center" gap={2}>
                <Flex align="center" gap={3} paddingLeft={1}>
                  <Box flex="none">
                    {loadingProjectId === project.id ?
                      <Spinner size={2} />
                    :
                      <Text size={2}>
                        {project.public ? (
                          <FolderIcon />
                        ) : (
                          <Box flex="none">
                            <Text size={2}>
                              <Tooltip
                                content={
                                  <Text muted size={1}>
                                    Private
                                  </Text>
                                }
                                fallbackPlacements={['right', 'left']}
                                placement="top"
                                portal
                              >
                                <LockIcon />
                              </Tooltip>
                            </Text>
                          </Box>
                        )}
                      </Text>
                    }
                  </Box>
                  <Stack space={2}>
                    <Text size={1} weight="semibold">
                      {project.name}
                    </Text>
                    {/* <Text size={0} muted>
                      Created{' '}
                      {new Date(project.created).toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Text> */}
                  </Stack>
                </Flex>
                <Flex align="center" gap={3}>
                  <Badge aria-label={`${project.media_count} media items`} tone="default">
                    {project.media_count}
                  </Badge>
                  <Tooltip
                    content={<Text size={1}>Open in Wistia</Text>}
                    placement="top"
                    fallbackPlacements={['left', 'bottom']}
                    portal
                  >
                    <Button
                      as="a"
                      href={`https://${config.accountSubdomain || 'app'}.wistia.com/folders/${project.hashed_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={LaunchIcon}
                      mode="bleed"
                      padding={2}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    />
                  </Tooltip>
                </Flex>
              </Flex>
            </Card>
          ))
        : (
            <Card padding={4}>
              <Text align="center" muted size={1}>
                No projects found.
              </Text>
            </Card>
          )}
      {hasMore && (
        <Card padding={3} borderTop>
          <Button
            mode="bleed"
            text={loadingMore ? 'Loading…' : 'Show more'}
            onClick={onLoadMore}
            disabled={loadingMore}
            width="fill"
          />
        </Card>
      )}
    </>
  )
}

export default memo(WistiaProjectsComponent)
