import React from 'react';

const NoItemsFound: React.FC = () => {
  return (
    <div className="profile__content__empty">
      <div className="text">No items found</div>
      <div className="advice">Come back soon! Or try browse</div>
    </div>
  );
};

export default NoItemsFound;
