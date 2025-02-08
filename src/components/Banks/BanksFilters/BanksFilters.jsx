import styles from './BanksFilters.module.scss';
import { useState, useEffect, useRef } from 'react';
import arrow1 from '@/assets/dropdown-arrow-year.svg';
import PropTypes from 'prop-types';

const BanksFilters = ({
  selectedYear,
  setSelectedYear,
  activeFilter,
  setActiveFilter,
}) => {
  const [isYearDropdownOpen, setYearDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const years = [2022, 2023, 2024, 2025];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setYearDropdownOpen(false);
      }
    };

    if (isYearDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isYearDropdownOpen]);

  return (
    <div className={styles['banks-filters']}>
      <div
        className={styles['banks-filters__year-selector']}
        onClick={() => setYearDropdownOpen(!isYearDropdownOpen)}
        ref={dropdownRef}
      >
        <span className={styles['banks-filters__year']}>{selectedYear}</span>
        <img
          src={arrow1}
          alt='Arrow'
          className={`${styles['banks-filters__arrow']} ${
            isYearDropdownOpen ? styles['banks-filters__arrow--open'] : ''
          }`}
        />
      </div>

      {isYearDropdownOpen && (
        <ul className={styles['banks-filters__year-dropdown']}>
          {years.map((year) => (
            <li
              key={year}
              className={
                year === selectedYear
                  ? styles['banks-filters__year--selected']
                  : ''
              }
              onClick={() => {
                setSelectedYear && setSelectedYear(year);
                setYearDropdownOpen(false);
              }}
            >
              {year}
            </li>
          ))}
        </ul>
      )}

      <div className={styles['banks-filters__filters']}>
        {['all', 'processed', 'unprocessed'].map((filter) => (
          <button
            key={filter}
            className={`${styles['banks-filters__filter']} ${
              activeFilter === filter
                ? styles['banks-filters__filter--active']
                : ''
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter === 'all'
              ? 'Все статьи'
              : filter === 'processed'
              ? 'Разнесены'
              : 'Не разнесены'}
          </button>
        ))}
      </div>
    </div>
  );
};

BanksFilters.propTypes = {
  selectedYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  setSelectedYear: PropTypes.func,
  activeFilter: PropTypes.string.isRequired,
  setActiveFilter: PropTypes.func.isRequired,
};

export default BanksFilters;
