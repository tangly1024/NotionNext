// components/ScrollContainer.js
import React, { useRef, useEffect } from 'react';

const ScrollContainer = ({ children, maxHeight, className }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current;

             const handleWheel = (e) => {
                 scrollContainer.scrollTop += e.deltaY;
                };
            scrollContainer.addEventListener('wheel', handleWheel);

             return () => {
               if(scrollContainer){
                 scrollContainer.removeEventListener('wheel', handleWheel);
                }
             };
        }
    }, []);


    return (
        <div
            className={`overflow-y-auto scroll-smooth ${className || ''}`}
            style={{ maxHeight }}
            ref={scrollRef}
        >
            {children}
        </div>
    );
};

export default ScrollContainer;
