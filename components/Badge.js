/**
 * 红点
 */
export default function Badge() {
  return <>
    {/* 红点 */}
    <span className="absolute right-1 top-1 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
    </span></>
}
