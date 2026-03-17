import {useEffect, useState, memo} from 'react'
import {Spinner, Card, Flex, Text, Box, Tooltip, Button, Badge} from '@sanity/ui'
import {LockIcon, LaunchIcon} from '@sanity/icons'

import {Config, WistaAPIProject} from '../types'

const WistiaProjectsComponent = ({
  onProjectClick,
  config,
}: {
  onProjectClick: (project: WistaAPIProject) => void
  config: Config
}) => {
  const [wistiaProjects, setWistiaProjects] = useState<WistaAPIProject[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const handleProjectClick = (project: WistaAPIProject) => {
    onProjectClick(project)
  }

  useEffect(() => {
    setLoading(true)

    const apiUrl = 'https://api.wistia.com/v1/projects.json?sort_by=updated&sort_direction=0'

    const headers = new Headers({
      Authorization: `Bearer ${config.token}`,
    })

    fetch(apiUrl, {
      method: 'GET',
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) {
          if (response?.status === 401) {
            setError('401 Not authorised - check your API key permissions.')
          } else {
            setError(`${response?.status} error`)
          }
        }

        setLoading(false)
        return response.json()
      })
      .then((data) => setWistiaProjects(data))
      .catch((error) => console.error(error))
  }, [])

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
        <Card padding={4}>
          <Flex align="center" direction="column" gap={3} justify="center">
            <Spinner muted />
            <Text muted size={1}>Loading projects from Wistia…</Text>
          </Flex>
        </Card>
      )}

      {wistiaProjects?.length
        ? wistiaProjects.map((project: WistaAPIProject) => (
          <Card
            key={project.id}
            padding={3}
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
              <Flex align="center" gap={2}>
                <Text weight="semibold">{project.name}</Text>
                {!project.public && (
                  <Tooltip
                    content={
                      <Box padding={2}>
                        <Text muted size={1}>This project is private</Text>
                      </Box>
                    }
                    fallbackPlacements={['right', 'left']}
                    placement="top"
                    portal
                  >
                    <LockIcon />
                  </Tooltip>
                )}
              </Flex>
              <Flex align="center" gap={3}>
                <Badge aria-label={`${project.mediaCount} media items`} tone="default" size={1}>{project.mediaCount}</Badge>
                <Button
                  as="a"
                  href={`https://${config.accountSubdomain || 'app'}.wistia.com/folders/${project.hashedId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={LaunchIcon}
                  mode="bleed"
                  padding={2}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  aria-label="Open folder in Wistia dashboard"
                />
              </Flex>
            </Flex>
          </Card>
        )
      )
      : !loading && (
          <Card padding={4}>
            <Text align="center" muted size={1}>No projects found.</Text>
          </Card>
        )
      }
    </div>
  )
}

export default memo(WistiaProjectsComponent)
