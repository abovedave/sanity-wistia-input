import { useEffect, useState } from 'react'
import { Spinner, Card, Flex, Text, Box, Menu, MenuItem, Heading } from '@sanity/ui'

const groupBy = (array, key) => {
  return array.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

const WistiaVideosComponent = ({ onVideoClick, projectId, config }) => {
  const [wistiaVideos, setWistiaVideos] = useState({})

  const handleVideoClick = (videoId: string) => {
    onVideoClick(videoId)
  }

  useEffect(() => {
    if (projectId) {
      const apiUrl = `https://api.wistia.com/v1/medias.json?project_id=${projectId}`

      const headers = new Headers({
        Authorization: `Bearer ${config.token}`,
      })

      fetch(apiUrl, {
        method: 'GET',
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          let grouped = groupBy(data, 'section')
          return setWistiaVideos(grouped)
        })
        .catch((error) => console.error(error))
    }
  }, [])

  return (
    <Box padding={1}>
      <Menu>
        {!projectId && <div>Error loading project</div>}

        {!Object.keys(wistiaVideos).length &&
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
                Loading media from Wistia…
              </Text>
            </Flex>
          </Card>
        }
        {Object.keys(wistiaVideos)?.map((section, index) => (
          <div key={projectId + index}>
            {section !== 'undefined' && (
              <Card padding={3}>
                <Heading as="h5" size={1}>{section}</Heading>
              </Card>
            )}
            {wistiaVideos[section].map((media) => (
              <MenuItem
                key={media.id}
                style={{ cursor: 'pointer' }}
                onClick={() => handleVideoClick(media.id)}
              >
                <Box padding={0}>
                  <Flex gap={3} align="center">
                    <img
                      src={media.thumbnail.url}
                      width="80"
                      style={{ borderRadius: 3 }}
                    />
                    <Text weight="semibold" align={'left'}>
                      {media.name}
                    </Text>
                    <Text style={{ marginLeft: 'auto' }} muted={true}>
                      {new Date(media.duration * 1000).toISOString().slice(11, 19)}
                    </Text>
                  </Flex>
                </Box>
              </MenuItem>
            ))}
          </div>
        ))}
      </Menu>
    </Box>
  )
}

export default WistiaVideosComponent