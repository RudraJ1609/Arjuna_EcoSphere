import React from 'react';

interface StatusPillProps {
  status: string;
  id?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, id }) => {
  const normalized = status.toLowerCase().trim();

  let colors = 'bg-slate-500/10 text-slate-400 border border-slate-500/20';

  if (['active', 'approved', 'resolved', 'on track'].includes(normalized)) {
    colors = 'bg-green-500/10 text-green-400 border border-green-500/20';
  } else if (['draft', 'pending', 'archived', 'slate'].includes(normalized)) {
    colors = 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
  } else if (['under review', 'at risk', 'medium'].includes(normalized)) {
    colors = 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
  } else if (['completed', 'blue'].includes(normalized)) {
    colors = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
  } else if (['open', 'rejected', 'high'].includes(normalized)) {
    colors = 'bg-red-500/10 text-red-400 border border-red-500/20';
  } else if (['low', 'warning'].includes(normalized)) {
    colors = 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
  }

  return (
    <span
      id={id}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors}`}
    >
      {status}
    </span>
  );
};
