import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Typed from 'typed.js';
import { useGlobal } from '@/lib/global';
import { siteConfig } from '@/lib/config';
import NavButtonGroup from './NavButtonGroup';
import Link from 'next/link';
import Router from 'next/router';
import { useRouter } from 'next/router';

const Hero = ({ siteInfo }) => {
  const [typed, setTyped] = useState(null);
  const { locale } = useGlobal();

  let wrapperTop = 0;

  const scrollToWrapper = () => {
    window.scrollTo({ top: wrapperTop, behavior: 'smooth' });
  };

  const GREETING_WORDS = siteConfig('GREETING_WORDS').split(',');

  useEffect(() => {
    updateHeaderHeight();

    if (!typed && window && document.getElementById('typed')) {
      setTyped(
        new Typed('#typed', {
          strings: GREETING_WORDS,
          typeSpeed: 200,
          backSpeed: 100,
          backDelay: 400,
          showCursor: true,
          smartBackspace: true,
        })
      );
    }

    window.addEventListener('resize', updateHeaderHeight);
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, [typed]);

  const updateHeaderHeight = () => {
    requestAnimationFrame(() => {
      const wrapperElement = document.getElementById('wrapper');
      wrapperTop = wrapperElement?.offsetTop;
    });
  };

  const handleAwesomeClick = () => {
    // Add your awesome functionality here
    console.log('This is awesome!');
  };

  return (
    <header id="header" style={{ zIndex: 1 }} className="w-full h-screen relative bg-black">
      <div className="text-white absolute bottom-0 flex flex-col h-full items-center justify-center w-full">
        <div className="font-black text-4xl md:text-5xl shadow-text">{siteConfig('TITLE')}</div>
        <div className="mt-2 h-12 items-center text-center font-medium shadow-text text-lg">
          <span id="typed" />
        </div>
        {siteConfig('HEXO_HOME_NAV_BUTTONS') && <NavButtonGroup {...props} />}
        <div onClick={scrollToWrapper} className="z-10 cursor-pointer w-full text-center py-4 text-3xl absolute bottom-10 text-white">
          <div className="opacity-70 animate-bounce text-xs">{siteConfig('HEXO_SHOW_START_READING') && locale.COMMON.START_READING}</div>
          <i className="opacity-70 animate-bounce fas fa-angle-down" />
        </div>
        <button onClick={handleAwesomeClick} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Click me for something awesome!
        </button>
      </div>
      <Image
        id="header-cover"
        src={siteInfo?.pageCover}
        className={`header-cover w-full h-screen object-cover object-center ${siteConfig('HEXO_HOME_NAV_BACKGROUND_IMG_FIXED') ? 'fixed' : ''}`}
      />
    </header>
  );
};

export default Hero;

// Path: themes/hexo/components/NavButtonGroup.js
import React from 'react';
import { useGlobal } from '@/lib/global';
import { siteConfig } from '@/lib/config';
import Link from 'next/link';

const NavButtonGroup = ({ props }) => {
  const { locale } = useGlobal();

  return (
    <div className="flex mt-4">
      {siteConfig('HEXO_HOME_NAV_BUTTONS').map((button, index) => (
        <Link key={index} href={button.href}>
          <a className="mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{button.text}</a>
        </Link>
      ))}
    </div>
  );
};

export default NavButtonGroup;

// Path: themes/hexo/components/NavButtonGroup.js
import React from 'react';
import { useGlobal } from '@/lib/global';
import { siteConfig } from '@/lib/config';
import Link from 'next/link';

const NavButtonGroup = ({ props }) => {
  const { locale } = useGlobal();

  return (
    <div className="flex mt-4">
      {siteConfig('HEXO_HOME_NAV_BUTTONS').map((button, index) => (
        <Link key={index} href={button.href}>
          <a className="mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{button.text}</a>
        </Link>
      ))}
    </div>
  );
};

export default NavButtonGroup;

// Path: themes/hexo/components/NavButtonGroup.js
import React from 'react';
import { useGlobal } from '@/lib/global';
import { siteConfig } from '@/lib/config';
import Link from 'next/link';

const NavButtonGroup = ({ props }) => {
  const { locale } = useGlobal();

  return (
    <div className="flex mt-4">
      {siteConfig('HEXO_HOME_NAV_BUTTONS').map((button, index) => (
        <Link key={index} href={button.href}>
          <a className="mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{button.text}</a>
        </Link>
      ))}
    </div>
  );
};

export default NavButtonGroup;