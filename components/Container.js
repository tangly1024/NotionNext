import PropTypes from 'prop-types'

const Container = ({ children, layout, fullWidth, ...customMeta }) => {
  return (
    <div>
      {/* 公共头 */}
      {children}
    </div>
  )
}

Container.propTypes = {
  children: PropTypes.node
}

export default Container
