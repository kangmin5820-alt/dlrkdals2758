'use client';

import { useState } from 'react';
import BasicInfoTab from './tabs/BasicInfoTab';
import LifestyleTab from './tabs/LifestyleTab';
import MemoTab from './tabs/MemoTab';
import InbodyTab from './tabs/InbodyTab';
import PTSessionTab from './tabs/PTSessionTab';
import { Member, PTSession } from '@prisma/client';

type SessionWithDetails = PTSession & {
  exercises: {
    id: number;
    name: string;
    feedback: string | null;
    sets: {
      id: number;
      setNumber: number;
      weightKg: number | null;
      reps: number | null;
      rir: number | null;
      record: string | null;
      volume: number | null;
      restSec: number | null;
      memo: string | null;
    }[];
  }[];
};

type MemberWithRelations = Member & {
  sessions: SessionWithDetails[];
  inbodyRecords: any[];
};

export default function MemberTabs({ member }: { member: MemberWithRelations }) {
  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    { id: 'basic', label: '기본정보' },
    { id: 'lifestyle', label: '생활패턴' },
    { id: 'memo', label: '상세메모' },
    { id: 'inbody', label: '인바디' },
    { id: 'sessions', label: 'PT 세션' },
  ];

  return (
    <div className="bg-[#0a0a0a] rounded border border-[#1a1a1a]" style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}>
      <div className="border-b border-[#1a1a1a]">
        <nav className="flex -mb-px" style={{ position: 'relative', zIndex: 10 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('탭 클릭:', tab.id);
                setActiveTab(tab.id);
              }}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-white/30 text-white bg-black'
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-[#2a2a2a]'
              }`}
              style={{ pointerEvents: 'auto', position: 'relative', zIndex: 20 }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-3" style={{ pointerEvents: 'auto', position: 'relative', zIndex: 1 }}>
        {activeTab === 'basic' && <BasicInfoTab member={member} />}
        {activeTab === 'lifestyle' && <LifestyleTab member={member} />}
        {activeTab === 'memo' && <MemoTab member={member} />}
        {activeTab === 'inbody' && <InbodyTab member={member} />}
        {activeTab === 'sessions' && <PTSessionTab member={member} />}
      </div>
    </div>
  );
}

