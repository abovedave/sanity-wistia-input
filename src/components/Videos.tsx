import {useEffect, useState} from 'react'
import {Spinner, Card, Flex, Text, Box, Menu, MenuItem, Heading} from '@sanity/ui'
import {WistiaMedia, WistiaAPIMedias, WistaMediasGrouped, Config} from '../types'

const groupBy = (array: Array<WistiaAPIMedias>, key: string) => {
  return array.reduce((rv: any, x: any) => {
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

const wistiaMediasComponent = ({
  onVideoClick,
  projectId,
  config,
}: {
  onVideoClick: Function
  projectId: number
  config: Config
}) => {
  const [wistiaMedias, setwistiaMedias] = useState<WistaMediasGrouped>({})
  const [loading, setLoading] = useState(false)

  const handleVideoClick = (media: WistiaMedia) => {
    onVideoClick(media)
  }

  useEffect(() => {
    if (projectId) {
      setLoading(true)

      const apiUrl = `https://api.wistia.com/v1/medias.json?project_id=${projectId}&sort_by=name`

      const headers = new Headers({
        Authorization: `Bearer ${config.token}`,
      })

      fetch(apiUrl, {
        method: 'GET',
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false)
          let grouped = groupBy(data, 'section')
          return setwistiaMedias(grouped)
        })
        .catch((error) => console.error(error))
    }
  }, [])

  return (
    <Box padding={1}>
      <Menu>
        {!projectId && <div>Error loading project</div>}

        {loading && (
          <Card padding={4}>
            <Flex align="center" direction="column" gap={3} height="fill" justify="center">
              <Spinner muted />
              <Text muted size={1}>
                Loading media from Wistia…
              </Text>
            </Flex>
          </Card>
        )}

        {Object.keys(wistiaMedias)?.length
          ? Object.keys(wistiaMedias)?.map((section, index) => (
              <div key={projectId + index}>
                {section !== 'undefined' && (
                  <Card padding={3}>
                    <Heading as="h2" size={1}>
                      {section}
                    </Heading>
                  </Card>
                )}
                {wistiaMedias[section].map((media: WistiaAPIMedias) => (
                  <MenuItem
                    paddingX={3}
                    paddingY={2}
                    key={media.id}
                    style={{cursor: 'pointer'}}
                    onClick={() => handleVideoClick({id: media.id, hashed_id: media.hashed_id})}
                  >
                    <Flex gap={3} align="center">
                      <img src={media.thumbnail.url} width="70" style={{borderRadius: 3}} />
                      <Text size={1} weight="semibold" align={'left'}>
                        {media.name}
                      </Text>
                      <Text size={1} style={{marginLeft: 'auto'}} muted={true}>
                        {new Date(media.duration * 1000).toISOString().slice(11, 19)}
                      </Text>
                    </Flex>
                  </MenuItem>
                ))}
              </div>
            ))
          : !loading && (
              <Card padding={4}>
                <Text align="center" muted size={1}>
                  No media found.
                </Text>
              </Card>
            )}
      </Menu>
    </Box>
  )
}

export default wistiaMediasComponent
