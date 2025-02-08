import styles from './BanksPagination.module.scss';
import PropTypes from 'prop-types';
import arrowPagination from '@/assets/pagination-arrow.svg';

const BanksPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className={styles['banks-pagination']}>
      <div className={styles['banks-pagination__container']}>
        <img
          src={arrowPagination}
          alt='Назад'
          className={styles['banks-pagination__arrow-left']}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        />
        <div className={styles['banks-pagination__group-btn']}>
          {[...Array(totalPages)].map((_, page) => (
            <button
              key={page}
              className={`${styles['banks-pagination__page']} ${
                page + 1 === currentPage
                  ? styles['banks-pagination__page--active']
                  : ''
              }`}
              onClick={() => onPageChange(page + 1)}
            >
              {page + 1}
            </button>
          ))}
        </div>
        <img
          src={arrowPagination}
          alt='Вперед'
          className={styles['banks-pagination__arrow-right']}
          onClick={() =>
            currentPage < totalPages && onPageChange(currentPage + 1)
          }
        />
      </div>
    </div>
  );
};

BanksPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
export default BanksPagination;

