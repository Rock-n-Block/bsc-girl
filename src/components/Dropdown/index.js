import React from 'react';

import './style.scss';
import { ReactComponent as IconArrow } from '../../assets/icons/arrow-down.svg';
import { ReactComponent as IconSearch } from '../../assets/icons/search.svg';

const Dropdown = React.memo((props) => {
  let {
    label = 'Choose',
    items = [],
    onChange = () => {},
    value = null,
    search = false,
  } = props;

  const refLabel = React.useRef();
  const refList = React.useRef();
  const refSearchInput = React.useRef();

  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const choosenItem =
    items && value ? items.filter((item) => item.key === value)[0] : null;

  items = items && items.filter((item) => item.key !== value);
  if (search) {
    items =
      items &&
      items.filter((item) => {
        return item.key.toLowerCase().includes(searchQuery.toLowerCase());
      });
  }

  const handleClickLabel = () => {
    setOpen(!open);
  };

  const handleChoose = (key) => {
    onChange(key);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleClickOutside = (e) => {
    if (
      e.target !== refList.current &&
      e.target !== refLabel.current &&
      e.target !== refSearchInput.current
    ) {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
  }, []);

  React.useEffect(() => {
    search &&
      open &&
      refSearchInput.current &&
      setTimeout(() => {
        refSearchInput.current.focus();
      }, 100); // изменить, если в scss анимации стоит большее время
  }, [open]);

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
  }, [items, value]);

  return (
    <div className="dropdown">
      <div ref={refLabel} className="dropdown-label" onClick={handleClickLabel}>
        <div className="dropdown-label-left">
          {choosenItem && (
            <img className="dropdown-item-image" src={choosenItem.image} />
          )}
          {choosenItem ? choosenItem.text : label}
        </div>

        {items && items.length > 0 && (
          <IconArrow
            className={open ? 'dropdown-arrow-right' : 'dropdown-arrow-down'}
          />
        )}
      </div>

      <div className={open ? 'dropdown-list-open' : 'dropdown-list'}>
        {search && (
          <div
            className={open ? 'dropdown-search' : 'dropdown-search-hide'}
            ref={refList}>
            <IconSearch className="dropdown-search-icon" />
            <input
              ref={refSearchInput}
              className="dropdown-search-input"
              type="text"
              placeholder="Search"
              onChange={handleSearch}
            />
          </div>
        )}

        {items.map((item, ii) => {
          const { key = '', text = '', image } = item;
          return (
            <div
              key={`${key}-${ii}`}
              className="dropdown-item"
              onClick={() => handleChoose(item.key)}>
              <img className="dropdown-item-image" src={image} />
              {text}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default Dropdown;
