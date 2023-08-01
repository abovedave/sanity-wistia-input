import { useEffect, useState } from 'react'
import { Button, Dialog, Card, Flex, Text, Box, Menu, MenuItem, Tooltip } from '@sanity/ui'
import { DocumentVideoIcon, ChevronLeftIcon } from '@sanity/icons'

import Projects from './Projects'
import Videos from './Videos'

const WistiaInputComponent = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [selectedVideoId, setSelectedVideoId] = useState(null)

  const handleProjectClick = (projectId) => {
    setSelectedProjectId(projectId)
  }

  const handleVideoClick = (videoId) => {
    setSelectedVideoId(videoId)
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <div style={{padding: 1}}>
      <Card
        tone={'inherit'}
        border
        padding={3}
        style={{borderStyle: 'dashed'}}
      >
        <Flex
          align={'center'}
          direction={'row'}
          gap={4}
          justify="space-between"
        >
          <Flex align={'center'} flex={1} gap={2} justify="center">
            <Text muted><DocumentVideoIcon /></Text>

            <Text size={1} muted>
              Select a video from Wistia
            </Text>
          </Flex>

          <Flex align="center" gap={2} justify="center" wrap="wrap">
            <Button
              mode="ghost"
              text="Select video"
              onClick={toggleModal}
            />
          </Flex>
        </Flex>
      </Card>

      {
        isModalOpen && (
          <Dialog
            header={selectedProjectId ? 'Select a video' : 'Select a project'}
            id="wistia-projects"
            onClose={toggleModal}
            width={1}
          >
            {!selectedProjectId ?
              <Projects
                config={props.config}
                onProjectClick={handleProjectClick}
              />
            : 
              (
                <div>
                  <Card
                    tone="default"
                    borderBottom={true}
                    padding={4}
                  >
                    <Button
                      icon={ChevronLeftIcon}
                      onClick={() => handleProjectClick(null)}
                      mode="ghost"
                      text="Back to projects"
                    />
                  </Card>
                  <Videos
                    config={props.config}
                    projectId={selectedProjectId}
                    onVideoClick={handleVideoClick}
                  />
                </div>
              )
            }
          </Dialog>
        )
      }
    </div>
  )
}

export default WistiaInputComponent