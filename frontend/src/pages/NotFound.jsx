import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="mx-auto max-w-xl rounded-[32px] border border-black/5 bg-white p-10 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/40">404</p>
      <h1 className="mt-3 text-4xl font-semibold text-black">Page not found</h1>
      <p className="mt-4 text-black/55">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-flex rounded-full bg-black px-5 py-3 font-semibold text-white">
        Go home
      </Link>
    </div>
  );
};

export default NotFound;
