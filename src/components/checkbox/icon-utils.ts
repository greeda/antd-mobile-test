export type CheckboxSize = 'small' | 'medium' | 'large'

export const getIconFontSize = (size?: CheckboxSize): string => {
  switch (size) {
    case 'small':
      return '16px'
    case 'large':
      return '28px'
    case 'medium':
    default:
      return '22px'
  }
}

















