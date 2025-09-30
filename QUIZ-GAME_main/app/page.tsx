// app/page.tsx
'use client';


import { useRouter } from 'next/navigation';


export default function Home() {

  const router = useRouter();
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      <div className="relative w-[390px] h-[844px] bg-[#8b97a6] rounded-[28px] shadow-2xl overflow-hidden text-white">
        {/* Fullscreen title poster */}
        <img
          src="/posters/title.png"
          alt="Title"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          draggable={false}
        />
        {/* Call-to-action */}
        <div className="absolute inset-x-0 bottom-[78px] flex justify-center">
          <button
            onClick={() => router.push('/choose')}
            className="w-[218px] h-[46px] rounded-[7px] text-white font-semibold bg-[#F2A25C] hover:brightness-110 transition"
          >
            Tap to Start
          </button>
        </div>
      </div>
    </main>
  );
}
