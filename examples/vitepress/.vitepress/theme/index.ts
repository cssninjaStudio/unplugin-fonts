// @ts-expect-error - not typed in vitepress 60
import DefaultTheme from 'vitepress/theme-without-fonts'
import './custom.css'
import 'unfonts.css'

export default DefaultTheme
