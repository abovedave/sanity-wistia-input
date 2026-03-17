import {useEffect, useState} from 'react'
import {memo} from 'react'
import {Spinner, Card, Flex, Text, Heading, Button} from '@sanity/ui'
import {LaunchIcon} from '@sanity/icons'

import {WistiaMedia, WistiaAPIMedias, WistaMediasGrouped, Config} from '../types'

const resultsPerPage = 100

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
  onVideoClick: (media: WistiaMedia) => void
  projectId: number
  config: Config
}) => {
  const [wistiaMedias, setwistiaMedias] = useState<WistaMediasGrouped>({})
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const handleVideoClick = (media: WistiaMedia) => {
    onVideoClick(media)
  }

  const fetchMedias = (pageNum: number, append: boolean) => {
    if (append) setLoadingMore(true)
    else setLoading(true)

    fetch(`https://api.wistia.com/v1/medias.json?project_id=${projectId}&sort_by=name&page=${pageNum}&per_page=${resultsPerPage}`, {
      headers: {Authorization: `Bearer ${config.token}`},
    })
      .then((r) => r.json())
      .then((data) => {
        setHasMore(data.length === resultsPerPage)
        setwistiaMedias((prev) => {
          const next = groupBy(data, 'section')
          if (!append) return next
          const merged = {...prev}
          Object.keys(next).forEach((section) => {
            merged[section] = [...(merged[section] || []), ...next[section]]
          })
          return merged
        })
        if (append) setLoadingMore(false)
        else setLoading(false)
      })
      .catch(console.error)
  }

  useEffect(() => {
    if (!projectId) return
    setPage(1)
    fetchMedias(1, false)
  }, [projectId, config.token])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchMedias(nextPage, true)
  }

  return (
    <div>
      {loading && (
        <Card padding={7}>
          <Flex align="center" direction="column" gap={3} justify="center">
            <Spinner muted />
            <Text muted size={1}>Loading media from Wistia…</Text>
          </Flex>
        </Card>
      )}

      {Object.keys(wistiaMedias)?.length
        ? Object.keys(wistiaMedias).map((section, index) => (
            <div key={projectId + index}>
              {section !== 'undefined' && (
                <Card padding={3} paddingLeft={4} borderBottom style={{position: 'sticky', top: 0, zIndex: 1}}>
                  <Heading as="h2" size={1}>{section}</Heading>
                </Card>
              )}
              {wistiaMedias[section].map((media: WistiaAPIMedias) => (
                <Card
                  key={media.id}
                  padding={3}
                  paddingLeft={4}
                  radius={1}
                  style={{cursor: 'pointer'}}
                  onClick={() => handleVideoClick({id: media.id, hashed_id: media.hashed_id})}
                  tone={hoveredId === media.id ? 'primary' : 'inherit'}
                  onMouseEnter={() => setHoveredId(media.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  as="button"
                >
                  <Flex gap={3} align="center">
                    <img
                      src={media.thumbnail.url}
                      width={70}
                      height={Math.round(70 / (media.thumbnail.width / media.thumbnail.height))}
                      style={{borderRadius: 3, display: 'block'}}
                      alt={media.name}
                    />
                    <Text size={1} weight="semibold">{media.name}</Text>
                    <Text size={1} style={{marginLeft: 'auto'}} muted>
                      {new Date(media.duration * 1000).toISOString().slice(11, 19)}
                    </Text>
                    <Button
                      as="a"
                      href={`https://${config.accountSubdomain || 'app'}.wistia.com/media/${media.hashed_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={LaunchIcon}
                      mode="bleed"
                      padding={2}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      aria-label="Open media in Wistia dashboard"
                    />
                  </Flex>
                </Card>
              ))}
            </div>
          ))
        : !loading && (
            <Card padding={4}>
              <Text align="center" muted size={1}>No media found.</Text>
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

export default memo(wistiaMediasComponent)
