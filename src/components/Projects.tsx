import { useEffect, useState } from 'react'
import { Spinner, Card, Flex, Text, Box, Menu, MenuItem, Tooltip } from '@sanity/ui'
import { LockIcon } from '@sanity/icons'

import { Config, WistaAPIProject } from '../types'

const WistiaProjectsComponent = (
  { onProjectClick, config }:
  { onProjectClick: Function, config: Config }
) => {
  const [wistiaProjects, setWistiaProjects] = useState([])
  const [loading, setLoading] = useState(false)

  const handleProjectClick = (projectId: number) => {
    onProjectClick(projectId)
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
        setLoading(false)
        return response.json()
      })
      .then((data) => setWistiaProjects(data))
      .catch((error) => console.error(error))
  }, [])

  return (
    <Box padding={1}>
      <Menu>
        {loading &&
          <Card padding={4}>
            <Flex
              align="center"
              direction="column"
              gap={3}
              height="fill"
              justify="center"
            >
              <Spinner muted />
              <Text muted size={1}>
                Loading projects from Wistia…
              </Text>
            </Flex>
          </Card>
        }
        
        {wistiaProjects?.map((project: WistaAPIProject) => (
          <MenuItem
            key={project.id}
            style={{ cursor: 'pointer' }}
            onClick={() => handleProjectClick(project.id)}
          >
            <Box padding={1}>
              <Flex justify="space-between" gap={2}>
                <Text weight="semibold">
                  {project.name}

                  {!project.public &&
                    <Tooltip
                      content={
                        <Box padding={2}>
                          <Text muted size={1}>
                            This project is private
                          </Text>
                        </Box>
                      }
                      fallbackPlacements={['right', 'left']}
                      placement="top"
                      portal
                    >
                      <LockIcon style={{ marginLeft: 5 }} />
                    </Tooltip>
                  }
                </Text>
                <Text muted={true}>
                  {project.mediaCount}
                </Text>
              </Flex>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default WistiaProjectsComponent