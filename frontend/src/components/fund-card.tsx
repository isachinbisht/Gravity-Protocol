import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Coins, ArrowRight, TrendingUp } from 'lucide-react';

interface FundCardProps {
  id: string;
  name: string;
  tvl: string;
  apy: number;
  assets: string[];
}

export function FundCard({ id, name, tvl, apy, assets }: FundCardProps) {
  return (
    <Link href={`/funds/${id}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="relative p-6 rounded-3xl flex flex-col gap-6 cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.7)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.04), inset 0 2px 0 rgba(255,255,255,0.4)',
        }}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner"
              style={{ background: 'linear-gradient(135deg, #2563eb, #8b5cf6)' }}
            >
              <Coins size={18} color="#fff" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-gray-900">{name}</h3>
              <div className="flex gap-1.5 mt-1">
                {assets.map(a => (
                  <span key={a} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-900/5 text-gray-600">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">APY</p>
            <p className="text-sm font-bold text-green-600 flex items-center justify-end gap-1">
              <TrendingUp size={12} /> {apy}%
            </p>
          </div>
        </div>

        <div className="flex justify-between items-end border-t border-gray-900/5 pt-4">
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Total Value Locked</p>
            <p className="text-xl font-extrabold font-mono text-gray-900 mt-0.5">{tvl}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white">
            <ArrowRight size={14} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
