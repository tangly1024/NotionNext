#!/var/lang/node16/bin/node
console.log(__dirname)
const { nextStart } = require('next/dist/cli/next-start')
nextStart(['-p', '9000', '--hostname', '0.0.0.0'])
