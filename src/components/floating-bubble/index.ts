import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component'
import { FAB } from './fab'
import { FABItem } from './fab-item'
import './floating-bubble.less'

export type { FABProps } from './fab'
export type { FABItemProps } from './fab-item'

export default attachPropertiesToComponent(FAB, {
  Item: FABItem,
})
