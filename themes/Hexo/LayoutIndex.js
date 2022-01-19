import Header from './components/Header'
import CONFIG_HEXO from './config_hexo'
import LayoutBase from './LayoutBase'

export const LayoutIndex = (props) => {
  return <LayoutBase {...props} headerSlot={CONFIG_HEXO.HOME_BANNER_ENABLE && <Header/>}>

  </LayoutBase>
}
