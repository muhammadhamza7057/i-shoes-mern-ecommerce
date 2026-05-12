import React from 'react';

const LoadingSkeleton = ({ type = 'card' }) => {
  if (type === 'page') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 w-64 rounded-full bg-gradient-to-r from-black/10 via-black/5 to-black/10" />
        <div className="h-[420px] rounded-[32px] bg-gradient-to-r from-black/10 via-black/5 to-black/10" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-[380px] rounded-[28px] bg-gradient-to-r from-black/10 via-black/5 to-black/10" />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'product') {
    return <div className="h-[520px] rounded-[32px] bg-gradient-to-r from-black/10 via-black/5 to-black/10 animate-pulse" />;
  }

  return (
    <div className="rounded-[32px] border border-black/5 bg-white p-4 shadow-sm animate-pulse">
      <div className="mb-4 h-56 rounded-[24px] bg-gradient-to-r from-black/10 via-black/5 to-black/10" />
      <div className="h-4 w-2/3 rounded-full bg-black/10" />
      <div className="mt-3 h-4 w-1/2 rounded-full bg-black/10" />
      <div className="mt-6 h-11 rounded-full bg-black/10" />
    </div>
  );
};

export default LoadingSkeleton;
