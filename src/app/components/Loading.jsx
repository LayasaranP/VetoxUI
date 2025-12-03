import React from 'react';
import Image from 'next/image';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="animate-spin">
        <Image 
          src="/LLM 3.jpg" 
          alt="VetoxAI Logo"
          width={40}
          height={40}
        />
      </div>
      <h1 className="text-lg font-medium">Getting the response...</h1>
    </div>
  );
};

export default Loading;
