export default function Champions() {
  const data = [
    {
      name: 'Aatrox',
      skin: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/c/ce/Skin_Loading_Screen_Classic_Aatrox.jpg',
    },
    {
      name: 'Aatrox',
      skin: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/c/ce/Skin_Loading_Screen_Classic_Aatrox.jpg',
    },
    {
      name: 'Aatrox',
      skin: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/c/ce/Skin_Loading_Screen_Classic_Aatrox.jpg',
    },
    {
      name: 'Aatrox',
      skin: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/c/ce/Skin_Loading_Screen_Classic_Aatrox.jpg',
    },
    {
      name: 'Aatrox',
      skin: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/c/ce/Skin_Loading_Screen_Classic_Aatrox.jpg',
    },
    {
      name: 'Aatrox',
      skin: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/c/ce/Skin_Loading_Screen_Classic_Aatrox.jpg',
    },
    {
      name: 'Aatrox',
      skin: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/c/ce/Skin_Loading_Screen_Classic_Aatrox.jpg',
    },
    {
      name: 'Aatrox',
      skin: 'https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/c/ce/Skin_Loading_Screen_Classic_Aatrox.jpg',
    },
  ]

  return (
    <div className="flex flex-col p-5 gap-5 overflow-y-scroll max-h-screen">
      <h1 className="font-semibold text-2xl font-['BeaufortLOL'] text-yellow-700">
        Champions
      </h1>
      <div className="flex flex-wrap gap-3">
        {data.map(champion => {
          return (
            <div key={champion.name} className="text-center">
              <div className="max-w-sm rounded shadow-xl border-yellow-700 border-2">
                <img
                  src={champion.skin}
                  className="overflow-hidden transition-all"
                  alt=""
                />
              </div>
              <p className="text-yellow-700 font-semibold text-xl">Aatrox</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
