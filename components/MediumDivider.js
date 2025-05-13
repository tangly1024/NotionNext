// components/MediumDivider.js
export default function MediumDivider() {
    console.log('MediumDivider rendered') // ✅ 放在这里才会触发
  return (
    <div className="my-12 flex justify-center items-center space-x-2 text-xl text-gray-500 select-none">
      <span>·</span>
      <span>·</span>
      <span>·</span>
    </div>
  )
}
