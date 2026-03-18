import {memo, useState, useMemo} from 'react'
import {Card, Flex, Text, Heading, Button, Stack, Tooltip, Box} from '@sanity/ui'
import {LaunchIcon, CalendarIcon} from '@sanity/icons'

import {WistiaMedia, WistiaAPIMedias, WistaMediasGrouped, Config} from '../types'

const groupBy = (array: WistiaAPIMedias[]): WistaMediasGrouped => {
  return array.reduce((rv: WistaMediasGrouped, x) => {
    const key = x.section ?? 'undefined'
    rv[key] = rv[key] ? [...rv[key], x] : [x]
    return rv
  }, {})
}

const wistiaMediasComponent = ({
  medias,
  hasMore,
  loadingMore,
  onVideoClick,
  onLoadMore,
  config,
}: {
  medias: WistiaAPIMedias[]
  hasMore: boolean
  loadingMore: boolean
  onVideoClick: (media: WistiaMedia) => void
  onLoadMore: () => void
  config: Config
}) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const groupedMedias = useMemo(() => groupBy(medias), [medias])

  return (
    <>
      {Object.keys(groupedMedias).length
        ? Object.keys(groupedMedias).map((section) => (
            <div key={section}>
              {section !== 'undefined' && (
                <Card
                  padding={3}
                  paddingLeft={4}
                  borderBottom
                  style={{position: 'sticky', top: 0, zIndex: 1}}
                >
                  <Heading as="h3" size={1}>
                    {section}
                  </Heading>
                </Card>
              )}
              {groupedMedias[section].map((media: WistiaAPIMedias) => (
                <Card
                  key={media.id}
                  padding={3}
                  paddingLeft={4}
                  radius={1}
                  style={{cursor: 'pointer'}}
                  onClick={() => onVideoClick({id: media.id, hashed_id: media.hashed_id})}
                  tone={hoveredId === media.id ? 'primary' : 'inherit'}
                  onMouseEnter={() => setHoveredId(media.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  as="button"
                >
                  <Flex gap={3} align="center">
                    <Card padding={0} overflow="hidden" radius={2} shadow={1} flex="none">
                      <img
                        src={media.thumbnail.url}
                        width={70}
                        height={Math.round(70 / (media.thumbnail.width / media.thumbnail.height))}
                        style={{
                          display: 'block',
                        }}
                        alt={media.name}
                      />
                    </Card>
                    <Stack space={2}>
                      <Text title={media.name} textOverflow="ellipsis" weight="semibold">
                        {media.name}
                      </Text>
                    </Stack>
                    <Box flex="none" style={{marginLeft: 'auto'}}>
                      <Text muted>
                        {new Date(media.duration * 1000).toISOString().slice(11, 19)}
                      </Text>
                    </Box>
                    <Tooltip
                      content={<Text size={1}>Open in Wistia</Text>}
                      placement="top"
                      fallbackPlacements={['left', 'bottom']}
                      portal
                    >
                      <Button
                        as="a"
                        href={`https://${config.accountSubdomain || 'app'}.wistia.com/medias/${media.hashed_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        icon={LaunchIcon}
                        mode="bleed"
                        padding={2}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      />
                    </Tooltip>
                  </Flex>
                </Card>
              ))}
            </div>
          ))
        : (
            <Card padding={5}>
              <Text align="center" muted size={1}>
                No media found.
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

export default memo(wistiaMediasComponent)
