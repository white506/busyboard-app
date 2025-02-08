import { useState, useEffect, useCallback, useMemo } from 'react';
import Button from '../Button/Button';
import BanksFilters from './BanksFilters/BanksFilters';
import BanksTable from './BanksTable/BanksTable';
import BanksPagination from './BanksPagination/BanksPagination';
import { generateMockData } from '@/utils/generateMockData';
import styles from './Banks.module.scss';

const Banks = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [mockData, setMockData] = useState([]);

  useEffect(() => {
    setMockData(generateMockData());
  }, []);

  const filteredData = useMemo(() => {
    let data = [...mockData];

    data = data.filter(
      (item) => new Date(item.executed).getFullYear() === parseInt(selectedYear)
    );

    if (activeFilter === 'processed') {
      data = data.filter((item) => item.article !== 'Закупочная стоимость');
    } else if (activeFilter === 'unprocessed') {
      data = data.filter((item) => item.article === 'Закупочная стоимость');
    }

    return data;
  }, [mockData, selectedYear, activeFilter]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <section className={styles.banks}>
      <div className={styles.banks__header}>
        <h2 className={styles.banks__title}>Банки</h2>
      </div>

      <div className={styles.banks__container}>
        <div className={styles.banks__controls}>
          <BanksFilters
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
          <div className={styles.banks__actions}>
            <Button text="Загрузить выписку" className={styles.banks__button} />
            <Button text="Правила" />
          </div>
        </div>
        <BanksTable
          data={filteredData}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
        <BanksPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default Banks;
