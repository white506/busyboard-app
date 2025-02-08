import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import BanksPaymentModal from '../BanksPaymentModal/BanksPaymentModal';
import styles from './BanksTable.module.scss';
import arrowArticleSelected from '@/assets/dropdown-arrow-article-selected.svg';
import arrowArticleDefault from '@/assets/dropdown-arrow-article-default.svg';
import filterTableArrow from '@/assets/filter-table-arrow.svg';
import detalizationIconNotReady from '@/assets/detalization-icon-blue.svg';
import detalizationIconReady from '@/assets/detalization-icon-green.svg';

const BanksTable = ({ data, currentPage, pageSize }) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [selectedArticles, setSelectedArticles] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [savedTransactions, setSavedTransactions] = useState({});

  useEffect(() => {
    const initialArticles = {};
    data.forEach((item) => {
      initialArticles[item.id] = item.article || null;
    });
    setSelectedArticles(initialArticles);
  }, [data]);

  const handleSaveSuccess = (id) => {
    setSavedTransactions((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const dropdownElements = document.querySelectorAll(
        `.${styles['banks-table__dropdown']}`
      );
      dropdownElements.forEach((dropdown) => {
        if (!dropdown.contains(e.target)) {
          setOpenDropdowns((prev) => ({
            ...prev,
            [dropdown.dataset.id]: false,
          }));
        }
      });
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleDetailButtonClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateAmount = (updatedAmount) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === selectedItem.id
          ? { ...transaction, newAmount: updatedAmount }
          : transaction
      )
    );
    setSavedTransactions((prev) => ({
      ...prev,
      [selectedItem.id]: true,
    }));
    setIsSaved(true);
  };

  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectArticle = (id, article) => {
    setSelectedArticles((prev) => ({
      ...prev,
      [id]: article,
    }));
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  const handleSortChange = (column) => {
    setSortOrder((prev) =>
      sortColumn === column ? (prev === 'asc' ? 'desc' : 'asc') : 'asc'
    );
    setSortColumn(column);
  };

  const compareValues = (a, b, order) => {
    a = a || '';
    b = b || '';
    if (typeof a === 'string' && typeof b === 'string') {
      return order === 'asc'
        ? a.localeCompare(b, 'ru')
        : b.localeCompare(a, 'ru');
    }
    return order === 'asc' ? a - b : b - a;
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (sortColumn === 'Дата') {
        return compareValues(
          new Date(a.executed),
          new Date(b.executed),
          sortOrder
        );
      }
      if (sortColumn === 'Банк') {
        return compareValues(
          a.bank.toLowerCase(),
          b.bank.toLowerCase(),
          sortOrder
        );
      }
      if (sortColumn === 'Контрагент') {
        return compareValues(
          a.contragentName.toLowerCase(),
          b.contragentName.toLowerCase(),
          sortOrder
        );
      }
      if (sortColumn === 'Статья') {
        return compareValues(
          (a.article || '').toLowerCase(),
          (b.article || '').toLowerCase(),
          sortOrder
        );
      }
      return 0;
    });
  }, [data, sortColumn, sortOrder]);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className={styles['banks-table']}>
      <div className={styles['banks-table__row-header']}>
        {[
          'Дата',
          'Приход',
          'Расход',
          'Банк',
          'Контрагент',
          'Статья',
          'Описание',
        ].map((col) => (
          <div
            key={col}
            className={`${styles['banks-table__cell-header']} ${
              ['Дата', 'Банк', 'Контрагент', 'Статья'].includes(col)
                ? styles['banks-table__cell-header--sortable']
                : ''
            }`}
            onClick={() =>
              ['Дата', 'Банк', 'Контрагент', 'Статья'].includes(col) &&
              handleSortChange(col)
            }
          >
            {col}
            {['Дата', 'Банк', 'Контрагент', 'Статья'].includes(col) && (
              <img
                src={filterTableArrow}
                alt='Фильтр'
                className={`${styles['banks-table__arrow']} ${
                  sortColumn === col
                    ? sortOrder === 'asc'
                      ? styles['banks-table__arrow--asc']
                      : styles['banks-table__arrow--desc']
                    : ''
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {paginatedData.map((item) => {
        const selectedArticle = selectedArticles[item.id];
        const isDefault = !selectedArticle;

        return (
          <div key={item.id} className={styles['banks-table__row']}>
            <div className={styles['banks-table__cell']}>
              {new Date(item.executed).toLocaleDateString('ru-RU')}
            </div>
            <div className={styles['banks-table__cell']}>{item.amount}</div>
            <div className={styles['banks-table__cell']}>
              {item.expenditureAmount}
            </div>
            <div className={styles['banks-table__cell']}>{item.bank}</div>
            <div className={styles['banks-table__cell']}>
              {item.contragentName}
            </div>
            <div className={styles['banks-table__cell']}>
              <div
                className={`${styles['banks-table__dropdown']} ${
                  isDefault ? styles['banks-table__dropdown--default'] : ''
                }`}
                onClick={() => toggleDropdown(item.id)}
                data-id={item.id}
              >
                <span
                  className={
                    isDefault
                      ? styles['banks-table__dropdown-text--default']
                      : ''
                  }
                >
                  {selectedArticle || 'Выберите статью!'}
                </span>
                <div className={styles['banks-table__details-actions']}>
                  {selectedArticle === 'Вывод частичной прибыли' && (
                    <button
                      className={styles['banks-table__details-btn']}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDetailButtonClick(item);
                      }}
                    >
                      <img
                        src={
                          savedTransactions[item.id]
                            ? detalizationIconReady
                            : detalizationIconNotReady
                        }
                        alt='Детализация'
                      />
                    </button>
                  )}
                  <img
                    src={isDefault ? arrowArticleDefault : arrowArticleSelected}
                    alt='Открыть'
                    className={`${styles['banks-table__dropdown-arrow']} ${
                      openDropdowns[item.id]
                        ? styles['banks-table__dropdown-arrow--open']
                        : ''
                    }`}
                  />
                </div>
              </div>
              {openDropdowns[item.id] && (
                <div className={styles['banks-table__dropdown-menu']}>
                  {[
                    'Закупочная стоимость',
                    'Заработная плата',
                    'Вывод частичной прибыли',
                    'Займы расход',
                  ].map((article) => (
                    <div
                      key={article}
                      className={styles['banks-table__dropdown-item']}
                      onClick={() => selectArticle(item.id, article)}
                    >
                      {article}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles['banks-table__cell']}>
              {item.paymentPurpose}
            </div>
          </div>
        );
      })}

      {isModalOpen && selectedItem && (
        <BanksPaymentModal
          isOpen={isModalOpen}
          onClose={closeModal}
          amount={Number(selectedItem.amount)}
          newAmount={Number(selectedItem.newAmount)}
          onUpdateAmount={handleUpdateAmount}
          onSaveSuccess={() => handleSaveSuccess(selectedItem.id)}
          idBankOperation={selectedItem.id}
        />
      )}
    </div>
  );
};

BanksTable.propTypes = {
  data: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
};

export default BanksTable;
