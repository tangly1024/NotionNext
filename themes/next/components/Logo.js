import { useState, useEffect } from 'react';
import Link from 'next/link';

const Logo = props => {
  const { className } = props;
  const [quote, setQuote] = useState('');

  useEffect(() => {
    fetch('https://v1.hitokoto.cn/')
      .then(response => response.json())
      .then(data => {
        setQuote(data.hitokoto);
      })
      .catch(error => {
        console.error('Error fetching quote:', error);
      });
  }, []);

  return (
    <Link href='/' passHref legacyBehavior>
      <div className={'flex flex-col justify-center items-center cursor-pointer bg-black dark:bg-gray-800 space-y-3 font-bold ' + className}>       
        <div data-aos="fade-down" data-aos-duration="500" data-aos-once="true" data-aos-anchor-placement="top-bottom" className='text-sm text-gray-300 font-light text-center'>
          {quote}
        </div>
      </div>
    </Link>
  );
};

export default Logo;
