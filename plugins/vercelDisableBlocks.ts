export default function plugin() {
  const transform = (code: string, id: string) => {
    if (id.includes('pages/api/generate.ts')) {
      return {
        code: code.replace(/^.*?#vercel-disable-blocks([\s\S]+?)#vercel-end.*?$/gm, ''),
        map: null
      }
    }
  }

  return {
    name: 'vercel-disable-blocks',
    enforce: 'pre',
    transform,
  }
}