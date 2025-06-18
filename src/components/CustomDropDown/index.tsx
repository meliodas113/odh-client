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

  function handleKeyDown(e:any) {
    if (e.key === 'Enter' || e.key === ' ') setOpen((o) => !o);
    if (e.key === 'Escape') setOpen(false);
  }

  const selected = CHAINS.find((c) => c.id === selectedChain);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-[#283046] bg-[#23263b] text-[#f9fafb] font-medium shadow transition hover:border-[#60a5fa] focus:outline-none`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <span className="bg-gradient-to-r from-[#60a5fa] to-[#f9fafb] bg-clip-text text-transparent font-bold">
          {selected?.name}
        </span>
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
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
              {chain.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
