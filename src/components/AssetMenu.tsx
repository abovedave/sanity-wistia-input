import {Button, MenuButton, Menu, MenuItem, MenuDivider} from '@sanity/ui'
import {EllipsisVerticalIcon, ResetIcon, ClipboardIcon, SearchIcon, UploadIcon} from '@sanity/icons'

import {AssetMediaActions} from '../types'

export function AssetMenu({onAction}: {onAction: (action: AssetMediaActions) => void}) {
  return (
    <MenuButton
      button={<Button padding={2} mode="ghost" icon={EllipsisVerticalIcon} tone="default" />}
      id="asset-menu"
      menu={
        <Menu>
          <MenuItem
            text="Replace medias"
            icon={SearchIcon}
            onClick={() => {
              onAction({type: 'select'})
            }}
          />
          <MenuItem
            text="Upload new video"
            icon={UploadIcon}
            onClick={() => {
              onAction({type: 'upload'})
            }}
          />
          <MenuItem
            text="Copy embed URL"
            icon={ClipboardIcon}
            onClick={() => {
              onAction({type: 'copyUrl'})
            }}
          />
          <MenuDivider />
          <MenuItem
            text="Clear field"
            icon={ResetIcon}
            tone="critical"
            onClick={() => {
              onAction({type: 'delete'})
            }}
          />
        </Menu>
      }
    />
  )
}
