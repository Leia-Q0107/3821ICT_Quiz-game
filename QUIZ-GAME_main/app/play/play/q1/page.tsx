'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function CharacterSelectionPage() {
  const router = useRouter();
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const characters = [
    { id: 'crocodile', name: 'Crocodile', title: 'Survivor' },
    { id: 'kangaroo',  name: 'Kangaroo',  title: 'Jumper' },
    { id: 'wombat',    name: 'Wombat',    title: 'Warrior' },
    { id: 'koala',     name: 'Koala',     title: 'Chill' },
  ];

  const navigateToCharacter = (characterId: string) => setSelectedCharacter(characterId);
  const onConfirm = () => { if (selectedCharacter) router.push('/play/play/q2'); };
  const selectedCharacterData = characters.find(c => c.id === selectedCharacter);

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      <div className="w-[375px] h-[812px] rounded-[28px] shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2740] via-[#1d3b58] to-[#4e6e86]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_80%_at_50%_0%,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_55%)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(140%_100%_at_50%_100%,rgba(0,0,0,0.20)_0%,rgba(0,0,0,0)_50%)]" />

        <div className="relative h-full flex flex-col">
          {/* Title */}
          <div className="pt-8 pb-4 text-center">
            <Image
              src="/Q1/ui/wild-partner-title.png"
              alt="Who's your wild partner on this epic journey through Australia?"
              width={300}
              height={80}
              /* 👇 force rendered width so it can’t grow */
              className="w-[300px] h-auto mx-auto select-none pointer-events-none"
              priority
              draggable={false}
            />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col items-center">
            {/* Avatars (slightly smaller) */}
            <div className="grid grid-cols-4 gap-4 mb-6 mt-6">
              {characters.map((character) => {
                const selected = selectedCharacter === character.id;
                return (
                  <div
                    key={character.id}
                    className={`w-[64px] h-[64px] cursor-pointer transition-transform duration-200 relative ${
                      selected ? 'scale-110' : 'hover:scale-105'
                    }`}
                    onClick={() => navigateToCharacter(character.id)}
                  >
                    <Image
                      src={`/Q1/icons/${character.id.toUpperCase()}_ICON.png`}
                      alt={character.name}
                      width={64}
                      height={64}
                      className="w-[64px] h-[64px] object-contain select-none pointer-events-none"
                      draggable={false}
                    />
                    {selected && (
                      <div className="absolute inset-0 rounded-lg ring-4 ring-orange-500 shadow-lg shadow-orange-500/50" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Big character */}
            <div className="flex-1 flex flex-col items-center justify-center mb-6 -mt-2">
              {selectedCharacterData ? (
                <>
                  {/* 👇 fixed box; image fills but never overflows */}
                  <div className="relative w-[260px] h-[320px] mb-4">
                    <Image
                      src={`/Q1/characters/PARTNER_-_${selectedCharacterData.id.toUpperCase()}.png`}
                      alt={`${selectedCharacterData.name} Partner`}
                      fill
                      sizes="(max-width: 375px) 260px, 260px"
                      style={{ objectFit: 'contain' }}
                      draggable={false}
                      priority
                    />
                  </div>

                  {/* Name word-image — clamp width explicitly */}
                  <div className="text-center">
                    <Image
                      src={
                        selectedCharacterData.id === 'koala'
                          ? '/Q1/titles/koala-chill.png'
                          : `/Q1/titles/${selectedCharacterData.name.toLowerCase()}-${selectedCharacterData.title.toLowerCase()}.png`
                      }
                      alt={selectedCharacterData.title}
                      width={220}
                      height={64}
                      /* 👇 explicit render size avoids “giant” text */
                      className="w-[220px] h-auto mx-auto select-none pointer-events-none"
                      draggable={false}
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1" />
              )}
            </div>

            {/* Bottom */}
            <div className="mt-auto w-full flex flex-col items-center">
              {!selectedCharacter && (
                <div className="text-center mb-5">
                  <Image
                    src="/Q1/ui/pick-character.png"
                    alt="Pick a Character!"
                    width={220}
                    height={60}
                    className="w-[220px] h-auto mx-auto select-none pointer-events-none"
                    draggable={false}
                  />
                </div>
              )}

              <button
                onClick={onConfirm}
                disabled={!selectedCharacter}
                aria-label="Confirm"
                className={`relative w-[240px] h-[48px] mb-6 select-none transition-opacity ${
                  selectedCharacter ? 'opacity-100 cursor-pointer' : 'opacity-60 cursor-not-allowed'
                }`}
              >
                <Image
                  src="/Q1/ui/frame.png"
                  alt="Confirm Button"
                  width={240}
                  height={48}
                  className="w-[240px] h-[48px] object-contain select-none pointer-events-none"
                  draggable={false}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}