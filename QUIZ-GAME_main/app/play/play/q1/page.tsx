'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CharacterSelectionPage() {
  const router = useRouter();
  
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  
  // 四个澳洲动物角色 - 按设计图顺序排列
  const characters = [
    { id: 'crocodile', name: 'Crocodile', title: 'Survivor' },
    { id: 'kangaroo', name: 'Kangaroo', title: 'Jumper' },
    { id: 'wombat', name: 'Wombat', title: 'Warrior' },
    { id: 'koala', name: 'Koala', title: 'Chill' }
  ];

  const navigateToCharacter = (characterId: string) => {
    setSelectedCharacter(characterId);
  };

  const onConfirm = () => {
    if (!selectedCharacter) return;
    router.push('/play/play/q2');
  };

  const selectedCharacterData = characters.find(char => char.id === selectedCharacter);

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      <div className="w-[375px] h-[812px] rounded-[28px] shadow-2xl overflow-hidden relative">
        {/* 背景 - 深蓝色渐变，匹配设计图 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2740] via-[#1d3b58] to-[#4e6e86]"></div>
        {/* 顶部柔和高光 */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_80%_at_50%_0%,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_55%)]"></div>
        {/* 底部微弱晕影，增强纵深感 */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(140%_100%_at_50%_100%,rgba(0,0,0,0.20)_0%,rgba(0,0,0,0)_50%)]"></div>
        
        {/* 主要内容容器 */}
        <div className="relative h-full flex flex-col">
          {/* 顶部标题区域 */}
          <div className="pt-8 pb-4 text-center">
            <img 
              src="/Q1/ui/wild-partner-title.png"
              alt="Who's your wild partner on this epic journey through Australia?"
              className="w-full max-w-[300px] mx-auto select-none pointer-events-none"
              draggable={false}
            />
          </div>

          {/* 角色选择区域 */}
          <div className="flex-1 flex flex-col items-center">
            {/* 角色头像 - 单排四个 */}
            <div className="grid grid-cols-4 gap-[20px] mb-6 mt-8">
              {characters.map((character) => (
                <div
                  key={character.id}
                  className={`w-[72px] h-[80px] cursor-pointer transition-all duration-200 relative ${
                    selectedCharacter === character.id 
                      ? 'scale-110 opacity-100' 
                      : 'opacity-100 hover:scale-105'
                  }`}
                  onClick={() => navigateToCharacter(character.id)}
                >
                  <img 
                    src={`/Q1/icons/${character.id.toUpperCase()}_ICON.png`}
                    alt={character.name}
                    className="w-full h-full object-contain select-none pointer-events-none"
                    draggable={false}
                  />
                  {/* 选中状态的高亮边框 */}
                  {selectedCharacter === character.id && (
                    <div className="absolute top-1 left-0 right-0 bottom-1 border-4 border-orange-500 rounded-lg shadow-lg shadow-orange-500/50"></div>
                  )}
                </div>
              ))}
            </div>

            {/* 角色大图显示区域 */}
            <div className="flex-1 flex flex-col items-center justify-center mb-8 -mt-6">
              {selectedCharacterData ? (
                <>
                  {/* 选中角色的大图 */}
                  <div className="relative mb-6">
                    <img 
                      src={`/Q1/characters/PARTNER_-_${selectedCharacterData.id.toUpperCase()}.png`}
                      alt={`${selectedCharacterData.name} Partner`}
                      className="h-[360px] w-auto object-contain select-none pointer-events-none"
                      draggable={false}
                    />
                  </div>
                  
                  {/* 角色名称和标题 */}
                  <div className="text-center">
                    <img 
                      src={selectedCharacterData.id === 'koala'
                        ? '/Q1/titles/koala-chill.png'
                        : `/Q1/titles/${selectedCharacterData.name.toLowerCase()}-${selectedCharacterData.title.toLowerCase()}.png`}
                      alt={selectedCharacterData.title}
                      className="max-w-[260px] mx-auto select-none pointer-events-none"
                      draggable={false}
                    />
                  </div>
                </>
              ) : (
                /* 未选中时的空白区域，为了保持一致的布局 */
                <div className="flex-1"></div>
              )}
            </div>

            {/* 底部内容 */}
            <div className="mt-auto w-full flex flex-col items-center">
              {/* 未选中时显示 Pick a Character，位置与角色名称一致 */}
              {!selectedCharacter && (
                <div className="text-center mb-6">
                  <img 
                    src="/Q1/ui/pick-character.png"
                    alt="Pick a Character!"
                    className="max-w-[250px] mx-auto select-none pointer-events-none"
                    draggable={false}
                  />
                </div>
              )}

              {/* 确认按钮 - 使用图片背景 */}
              <button 
                onClick={onConfirm}
                disabled={!selectedCharacter}
                aria-label="Confirm"
                className={`relative w-[248px] h-[48px] mb-6 select-none transition-opacity
                  ${selectedCharacter ? 'opacity-100 cursor-pointer' : 'opacity-60 cursor-not-allowed'}
                `}
              >
                <img 
                  src="/Q1/ui/frame.png"
                  alt="Confirm Button"
                  className="w-full h-full object-contain select-none pointer-events-none"
                  draggable={false}
                />
              </button>

              {/* 底部提示文字 */}
              <div className="mb-8">
                <img 
                  src="/Q1/ui/select-confirm.png"
                  alt="Select Character then Confirm"
                  className="max-w-[200px] mx-auto select-none pointer-events-none"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 