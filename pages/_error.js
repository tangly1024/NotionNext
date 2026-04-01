export default function ErrorPage({ statusCode }) {
  return <div>发生错误，状态码：{statusCode || 404}</div>
}
ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}