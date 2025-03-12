import React from 'react';

interface HeaderProps {
  onShowInfo: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowInfo }) => {
  return (
    <div className="header min-w-screen z-40 flex h-16 items-center justify-between border-b border-moss-800 px-4">
      <div className="flex w-1/4 items-center">
        <div className="font-cardo text-xl font-bold tracking-wider-1 text-moss-950">
          &apos;kliː.mə´
        </div>
      </div>
      <div className="flex w-1/2 justify-center">
        <div className="flex items-center justify-center">
          <button className="snipcart-checkout group cursor-pointer text-center font-maven text-base font-light tracking-wider-2 text-moss-950 transition duration-300">
            cart
            <span className="snipcart-items-count ml-1"></span>
            <span className="block h-0.5 max-w-0 bg-moss-950 bg-opacity-70 transition-all duration-500 group-hover:max-w-full"></span>
          </button>
        </div>
      </div>
      <div className="flex w-1/4 justify-end">
        <div className="flex items-center justify-center">
          <p
            className="group cursor-pointer text-center font-maven text-base font-light tracking-wider-2 text-moss-950 transition duration-300"
            onClick={onShowInfo}
          >
            info
            <span className="block h-0.5 max-w-0 bg-moss-950 bg-opacity-70 transition-all duration-500 group-hover:max-w-full"></span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
