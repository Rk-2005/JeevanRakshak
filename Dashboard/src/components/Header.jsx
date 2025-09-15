import React from 'react';

const Header = ({ category, title }) => (
  <div className=" mb-10">
    <p className="text-lg text-gray-400">{category}</p>
    <h2 className="text-2xl font-semibold mt-1">{title}</h2>
  </div>
);

export default Header;
