import PropTypes from 'prop-types';
import styles from './Popup.module.scss';
import popupIconCheck from '@/assets/popup-icon-check.svg';
import popupIconError from '@/assets/popup-icon-warning.svg';
import popupIconWait from '@/assets/popup-icon-wait.png';

const Popup = ({ type, onClose }) => {
  let icon, title, description, backgroundColor;

  switch (type) {
    case 'positive':
      icon = popupIconCheck;
      title = 'Все изменения успешно сохранены!';
      description = 'Сохранение изменений';
      backgroundColor = 'var(--color-green)';
      break;
    case 'wrong':
      icon = popupIconError;
      title = 'Ошибка';
      description = 'Ошибка';
      backgroundColor = 'var(--color-red)';
      break;
    case 'waiting':
      icon = popupIconWait;
      title = 'Ожидание';
      description = 'Ожидание';
      backgroundColor = 'var(--color-gray)';
      break;
    default:
      icon = popupIconWait;
      title = 'Ожидание';
      description = 'Ожидание';
      backgroundColor = 'var(--color-gray)';
      break;
  }

  return (
    <div className={styles['popup__overlay']}>
      <div className={styles['popup__content']}>
        <div className={styles['popup__status']}>
          <div
            className={styles['popup__statusIcon']}
            style={{ backgroundColor }} 
          >
            <img src={icon} alt='Popup icon' width={24} height={24} />
          </div>
          <div className={styles['popup__statusText']}>
            <h3 className={styles['popup__statusTitle']}>{description}</h3>
            <p className={styles['popup__statusDescription']}>{title}</p>
          </div>
        </div>
        <button className={styles['popup__closeButton']} onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

Popup.propTypes = {
  type: PropTypes.oneOf(['positive', 'wrong', 'waiting']).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Popup;
