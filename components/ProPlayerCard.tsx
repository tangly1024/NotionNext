export default function ProPlayerCard({ player }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 w-full max-w-sm mx-auto">
      <div className="flex items-center space-x-4">
        <img src={player.avatar} alt={player.name} className="w-16 h-16 rounded-full" />
        <div>
          <h3 className="text-lg font-semibold">{player.name}</h3>
          <p className="text-sm text-gray-500">{player.team} · {player.country}</p>
        </div>
      </div>
      <ul className="mt-4 text-sm text-gray-700 dark:text-gray-300 space-y-1">
        <li>🖱 鼠标：{player.mouse}</li>
        <li>⌨ 键盘：{player.keyboard}</li>
        <li>🖥 显示器：{player.monitor}</li>
        <li>🎧 耳机：{player.headset}</li>
      </ul>
    </div>
  )
}
