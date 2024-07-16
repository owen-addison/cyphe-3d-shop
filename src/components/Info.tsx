import React from 'react';

interface InfoProps {
  onClose: () => void;
}

const Info: React.FC<InfoProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-start justify-start overflow-y-auto bg-moss-400">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="group text-base font-light tracking-wider-2 text-moss-950 transition duration-300"
          >
            Close
            <span className="block h-0.5 max-w-0 bg-moss-950 bg-opacity-70 transition-all duration-500 group-hover:max-w-full"></span>
          </button>
        </div>
        <div className="mt-8 font-sans text-moss-950">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-xl font-medium tracking-widest">ABOUT</h1>
            <div className="mt-8 w-full max-w-3xl space-y-6">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Et
                malesuada fames ac turpis egestas sed. Sit amet aliquam id diam.
                Elementum integer enim neque volutpat. Ipsum nunc aliquet
                bibendum enim facilisis gravida neque. Faucibus et molestie ac
                feugiat sed lectus vestibulum mattis. Id interdum velit laoreet
                id. Egestas quis ipsum suspendisse ultrices gravida dictum. Arcu
                non sodales neque sodales ut etiam sit amet. Tortor at auctor
                urna nunc. Egestas diam in arcu cursus euismod quis. Non odio
                euismod lacinia at quis risus sed vulputate odio. Et malesuada
                fames ac turpis egestas integer eget aliquet nibh.
              </p>
              <p>
                Id diam maecenas ultricies mi eget mauris. Pellentesque eu
                tincidunt tortor aliquam nulla facilisi cras. Nibh tortor id
                aliquet lectus proin nibh. Pharetra diam sit amet nisl suscipit
                adipiscing bibendum est ultricies. Nibh nisl condimentum id
                venenatis a condimentum. Proin fermentum leo vel orci porta non
                pulvinar. Auctor elit sed vulputate mi sit. Eu ultrices vitae
                auctor eu augue ut. Turpis egestas maecenas pharetra convallis
                posuere morbi leo urna molestie. Commodo viverra maecenas
                accumsan lacus vel facilisis. Venenatis lectus magna fringilla
                urna. Aliquam sem fringilla ut morbi tincidunt. Enim blandit
                volutpat maecenas volutpat blandit aliquam. Elit duis tristique
                sollicitudin nibh sit.
              </p>
            </div>
            <div className="mt-12">
              <h1 className="text-xl font-medium tracking-widest">CONTACT</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
