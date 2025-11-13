import React from 'react';

export const Hero: React.FC = () => {
  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="text-center py-16 sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
        The Future of Domain Trading,{' '}
        <span className="text-sky-400">Powered by AI</span>
      </h1>
      <p className="mt-6 text-lg max-w-2xl mx-auto text-slate-400">
        Discover, valuate, and acquire premium domains with unparalleled market insights and predictive analytics.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <a
          href="#marketplace"
          className="rounded-md bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 transition"
        >
          Explore Marketplace
        </a>
        <a onClick={() => handleScrollTo('valuation')} className="text-sm font-semibold leading-6 text-slate-300 hover:text-white transition cursor-pointer">
          Valuate a Domain <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
};