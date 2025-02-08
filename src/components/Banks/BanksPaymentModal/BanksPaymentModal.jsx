import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './BanksPaymentModal.module.scss';
import Button from '@/components/Button/Button';
import Popup from '@/components/Popup/Popup';
import arrowArticleSelected from '@/assets/dropdown-arrow-article-selected.svg';
import arrowArticleDefault from '@/assets/dropdown-arrow-article-default.svg';

const BanksPaymentModal = ({
  isOpen,
  onClose,
  amount,
  onSaveSuccess,
  idBankOperation,
}) => {
  const [netProfit, setNetProfit] = useState('');
  const [transferToCashbox, setTransferToCashbox] = useState('');
  const [popupType, setPopupType] = useState('waiting');
  const [remainingAmount, setRemainingAmount] = useState('');
  const [isSaveButtonActive, setIsSaveButtonActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isNetProfitDropdownOpen, setIsNetProfitDropdownOpen] = useState(false);
  const [isTransferToCashboxDropdownOpen, setIsTransferToCashboxDropdownOpen] =
    useState(false);
  const [selectedNetProfitOption, setSelectedNetProfitOption] = useState(
    'Вывод чистой прибыли'
  );
  const [selectedTransferToCashboxOption, setSelectedTransferToCashboxOption] =
    useState('Перенос в кассу');

  const clearForm = () => {
    setNetProfit('');
    setTransferToCashbox('');
    setRemainingAmount('');
    setIsSaveButtonActive(false);
    setStatusMessage('');
    setIsSuccess(false);
  };

  const handleCancel = () => {
    clearForm();
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  useEffect(() => {
    const isValid =
      netProfit.toString().trim() !== '' &&
      transferToCashbox.toString().trim() !== '' &&
      remainingAmount.toString().trim() !== '' &&
      !isNaN(Number(netProfit)) &&
      !isNaN(Number(transferToCashbox)) &&
      !isNaN(Number(remainingAmount)) &&
      Number(netProfit) >= 0 &&
      Number(transferToCashbox) >= 0 &&
      Number(remainingAmount) >= 0;

    setIsSaveButtonActive(isValid);
  }, [netProfit, transferToCashbox, remainingAmount]);

  const handleInputChange = (e, field) => {
    const value =
      e.target.value.trim() === '' ? 0 : parseFloat(e.target.value) || 0;

    if (field === 'netProfit') {
      setNetProfit(value);
      setTransferToCashbox((amount - value).toFixed(2));
    } else if (field === 'transferToCashbox') {
      setTransferToCashbox(value);
      setNetProfit((amount - value).toFixed(2));
    } else if (field === 'remainingAmount') {
      setRemainingAmount(value);
    }
  };

  const handleSave = async () => {
    try {
      if (!idBankOperation) {
        console.error('ID операции не указан');
        return;
      }
  
      setPopupType('waiting');
      setIsPopupVisible(true);
      setStatusMessage('Ожидание...');
  
      const transferAmount = parseFloat(transferToCashbox);
      if (isNaN(transferAmount)) {
        console.error('Invalid transferToCashbox value:', transferToCashbox);
        setStatusMessage('Неверная сумма для переноса в кассу');
        setPopupType('wrong');
        setIsPopupVisible(true);
        return;
      }
  
      const requestBody = {
        id_bank_operation: idBankOperation,
        sum_for_transfer_to_cashbox: transferAmount.toFixed(2),
        sum_for_net_profit_withdrawal: parseFloat(netProfit).toFixed(2),
      };
  
      const response = await fetch(
        'http://busyboard-test.ru/api/v1/bank/operations/transfer-to-cashbox/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic AUTH-header>',
          },
          body: JSON.stringify(requestBody),
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        setStatusMessage(data.message || 'Перевод успешно зафиксирован');
        setPopupType('positive');
        onSaveSuccess();
      } else {
        const errorData = await response.json();
        setStatusMessage(
          errorData.message || `Ошибка при сохранении (код: ${response.status})`
        );
        setPopupType('wrong');
      }
    } catch (error) {
      console.error('Network error:', error);
      setStatusMessage('Ошибка сети');
      setPopupType('wrong');
    } finally {
      setIsPopupVisible(true);
    }
  };
  
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles['banks-modal__dropdown']}`)) {
        setIsNetProfitDropdownOpen(false);
        setIsTransferToCashboxDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles['banks-modal']} onClick={handleBackdropClick}>
        <div
          className={styles['banks-modal__content']}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles['banks-modal__close']} onClick={onClose}>
            &times;
          </button>
          <h2 className={styles['banks-modal__title']}>Детализация платежа</h2>

          <div className={styles['banks-modal__summary']}>
            <div className={styles['banks-modal__summary-item']}>
              <div className={styles['banks-modal__summary-item-text']}>
                Общая сумма платежа
              </div>
              <input
                type='number'
                className={styles['banks-modal__input']}
                value={amount}
                readOnly
              />
            </div>
            <div className={styles['banks-modal__summary-item']}>
              <div className={styles['banks-modal__summary-item-text']}>
                Осталось разнести
              </div>
              <input
                type='number'
                placeholder='0.0'
                className={`${styles['banks-modal__input']} ${
                  remainingAmount !== 0 ? styles['error'] : ''
                }`}
                value={remainingAmount === 0 ? '' : remainingAmount}
                onChange={(e) => handleInputChange(e, 'remainingAmount')}
              />
            </div>
          </div>

          <div className={styles['banks-modal__form']}>
            <div className={styles['banks-modal__row']}>
              <div className={styles['banks-modal__placeholders']}>
                <span>Сумма</span>
                <span>Тип операции</span>
              </div>
              <div className={styles['banks-modal__inputs']}>
                <input
                  type='number'
                  placeholder='Введите сумму ЧП'
                  className={styles['banks-modal__input']}
                  value={netProfit}
                  onChange={(e) => handleInputChange(e, 'netProfit')}
                />
                <div
                  className={styles['banks-modal__dropdown']}
                  onClick={() =>
                    setIsNetProfitDropdownOpen(!isNetProfitDropdownOpen)
                  }
                >
                  <span className={styles['banks-modal__dropdown-text']}>
                    {selectedNetProfitOption}
                  </span>
                  <div className={styles['banks-modal__details-actions']}>
                    <img
                      src={
                        isNetProfitDropdownOpen
                          ? arrowArticleSelected
                          : arrowArticleDefault
                      }
                      alt='Открыть'
                      className={`${styles['banks-modal__dropdown-arrow']} ${
                        isNetProfitDropdownOpen
                          ? styles['banks-modal__dropdown-arrow--open']
                          : ''
                      }`}
                    />
                  </div>
                </div>
                {isNetProfitDropdownOpen && (
                  <div className={styles['banks-modal__dropdown-menu']}>
                    {['Вывод чистой прибыли'].map((option) => (
                      <div
                        key={option}
                        className={styles['banks-modal__dropdown-item']}
                        onClick={() => {
                          setSelectedNetProfitOption(option);
                          setIsNetProfitDropdownOpen(false);
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles['banks-modal__row']}>
              <div className={styles['banks-modal__placeholders']}>
                <span>Сумма</span>
                <span>Тип операции</span>
              </div>
              <div className={styles['banks-modal__inputs']}>
                <input
                  type='number'
                  placeholder='Введите сумму перевода в кассу'
                  className={styles['banks-modal__input']}
                  value={transferToCashbox}
                  onChange={(e) => handleInputChange(e, 'transferToCashbox')}
                />
                <div
                  className={styles['banks-modal__dropdown']}
                  onClick={() =>
                    setIsTransferToCashboxDropdownOpen(
                      !isTransferToCashboxDropdownOpen
                    )
                  }
                >
                  <span className={styles['banks-modal__dropdown-text']}>
                    {selectedTransferToCashboxOption}
                  </span>
                  <div className={styles['banks-modal__details-actions']}>
                    <img
                      src={
                        isTransferToCashboxDropdownOpen
                          ? arrowArticleSelected
                          : arrowArticleDefault
                      }
                      alt='Открыть'
                      className={`${styles['banks-modal__dropdown-arrow']} ${
                        isTransferToCashboxDropdownOpen
                          ? styles['banks-modal__dropdown-arrow--open']
                          : ''
                      }`}
                    />
                  </div>
                </div>
                {isTransferToCashboxDropdownOpen && (
                  <div className={styles['banks-modal__dropdown-menu']}>
                    {['Перенос в кассу'].map((option) => (
                      <div
                        key={option}
                        className={styles['banks-modal__dropdown-item']}
                        onClick={() => {
                          setSelectedTransferToCashboxOption(option);
                          setIsTransferToCashboxDropdownOpen(false);
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles['banks-modal__buttons']}>
            <Button
              text='Сохранить'
              onClick={handleSave}
              disabled={!isSaveButtonActive}
            />
            <Button
              text='Отменить'
              className={styles['banks-modal__button--secondary']}
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
            />
          </div>
        </div>
      </div>

      {isPopupVisible && (
        <Popup
          type={popupType}
          message={statusMessage}
          onClose={() => setIsPopupVisible(false)}
        />
      )}
    </>
  );
};

BanksPaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  amount: PropTypes.number.isRequired,
  idBankOperation: PropTypes.number.isRequired, // Добавляем типизацию
};

export default BanksPaymentModal;