import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { etherlink, moonbeam, Chain } from "viem/chains";

const CHAINS:Chain[] = [
  etherlink,
  moonbeam
];

interface Props{
   onChange: (chain: Chain) => void;
   selectedChain:number;
}

export function CustomChainDropdown({ selectedChain, onChange }:Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleKeyDown(e:React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') setOpen((o) => !o);
    if (e.key === 'Escape') setOpen(false);
  }

  const selected = CHAINS.find((c) => c.id === selectedChain);

  return (
    <div className="relative md:w-[45%] lg:w-[40%] xl:w-[35%]" ref={dropdownRef}>
      <button
        className={`flex md:w-full items-center gap-[5px] md:gap-1 px-4 py-2 rounded-lg border border-[#283046] bg-[#23263b] text-[#f9fafb] font-medium shadow transition hover:border-[#60a5fa] focus:outline-none`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <Image src={`/assets/logos/${selected?.name.toLowerCase()}.svg`} alt="" height={22} width={22} className='radius-12'/>
        <span className="bg-gradient-to-r from-[#60a5fa] to-[#f9fafb] bg-clip-text text-transparent font-bold">
          {selected?.name}
        </span>
        {<svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>}
      </button>
      {open && (
        <ul
          className="absolute left-0 mt-2 w-full bg-[#23263b] border border-[#283046] rounded-lg shadow-lg z-50"
          role="listbox"
        >
          {CHAINS.map((chain) => (
            <li
              key={chain.id}
              className={`px-4 py-2 cursor-pointer transition hover:bg-[#283046] ${
                selectedChain === chain.id ? 'bg-[#1e293b] font-semibold' : ''
              }`}
              role="option"
              aria-selected={selectedChain === chain.id}
              tabIndex={0}
              onClick={() => {
                setOpen(false);
                onChange(chain);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setOpen(false);
                  onChange(chain);
                }
              }}
            >
              <div className='flex flex-row gap-2 text-[#D9D9D9]'>
              <Image src={`/assets/logos/${chain.name.toLowerCase()}.svg`} alt="" height={22} width={22} className='radius-12'/>{chain.name}
                </div>
            </li> 
          ))}
        </ul>
      )}
    </div>
  );
}
