import {useEffect, useState, memo} from 'react'
import {Spinner, Card, Flex, Text, Box, Tooltip, Button, Badge, Stack} from '@sanity/ui'
import {LockIcon, LaunchIcon, FolderIcon} from '@sanity/icons'

import {Config, WistaAPIProject} from '../types'

const resultsPerPage = 100

const WistiaProjectsComponent = ({
  onProjectClick,
  config,
}: {
  onProjectClick: (project: WistaAPIProject) => void
  config: Config
}) => {
  const [wistiaProjects, setWistiaProjects] = useState<WistaAPIProject[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState('')
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const handleProjectClick = (project: WistaAPIProject) => {
    onProjectClick(project)
  }

  const fetchProjects = (pageNum: number, append: boolean) => {
    if (append) setLoadingMore(true)
    else setLoading(true)

    fetch(
      `https://api.wistia.com/v1/projects.json?sort_by=updated&sort_direction=0&page=${pageNum}&per_page=${resultsPerPage}`,
      {
        method: 'GET',
        headers: new Headers({Authorization: `Bearer ${config.token}`}),
      },
    )
      .then((response) => {
        if (!response.ok) {
          setError(
            response?.status === 401
              ? '401 Not authorised - check your API key permissions.'
              : `${response?.status} error`,
          )
        }
        if (append) setLoadingMore(false)
        else setLoading(false)
        return response.json()
      })
      .then((data) => {
        setHasMore(data.length === resultsPerPage)
        setWistiaProjects((prev) => (append ? [...prev, ...data] : data))
      })
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    setPage(1)
    fetchProjects(1, false)
  }, [])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchProjects(nextPage, true)
  }

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
    <div>
      {loading && (
        <Card padding={7}>
          <Flex align="center" direction="column" gap={3} justify="center">
            <Spinner muted />
            <Text muted size={1}>
              Loading folders from Wistia…
            </Text>
          </Flex>
        </Card>
      )}

      {wistiaProjects?.length
        ? wistiaProjects.map((project: WistaAPIProject) => (
            <Card
              key={project.id}
              paddingTop={3}
              paddingBottom={3}
              paddingRight={3}
              paddingLeft={4}
              radius={1}
              style={{cursor: 'pointer'}}
              onClick={() => handleProjectClick(project)}
              tone={hoveredId === project.id ? 'primary' : 'inherit'}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              as="button"
            >
              <Flex justify="space-between" align="center" gap={2}>
                <Flex align="center" gap={3}>
                  <Stack space={2}>
                    <Text size={1} weight="semibold">
                      {project.name}
                    </Text>
                    <Text size={0} muted>
                      Created{' '}
                      {new Date(project.created).toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Text>
                  </Stack>
                </Flex>
                <Flex align="center" gap={3}>
                  <Badge aria-label={`${project.mediaCount} media items`} tone="default" size={1}>
                    {project.mediaCount}
                  </Badge>
                  {!project.public && (
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
                  <Tooltip content={<Text size={1}>Open in Wistia</Text>} placement="top" fallbackPlacements={['left', 'bottom']} portal>
                    <Button
                      as="a"
                      href={`https://${config.accountSubdomain || 'app'}.wistia.com/folders/${project.hashedId}`}
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
        : !loading && (
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
            onClick={handleLoadMore}
            disabled={loadingMore}
            width="fill"
          />
        </Card>
      )}
    </div>
  )
}

export default memo(WistiaProjectsComponent)
