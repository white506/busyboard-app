import styles from './Header.module.scss';
import userLogo from '@/assets/header-user-logo.svg';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <a href='#' className={styles.header__logo}>
          Busyboard
        </a>

        <div className={styles.header__navWrapper}>
          <nav className={styles.header__menu}>
            <a href='#' className={styles.header__menuItem}>
              Дашборд
            </a>
            <a
              href='#'
              className={`${styles.header__menuItem} ${styles['header__menuItem--active']}`}
            >
              Аналитика
            </a>
            <a href='#' className={styles.header__menuItem}>
              Финансы
            </a>
            <a href='#' className={styles.header__menuItem}>
              Автоматизация
            </a>
          </nav>

          <div className={styles.header__account}>
            <span className={styles.header__accountName}>User Name</span>
            <img
              src={userLogo}
              alt='User Logo'
              className={styles.header__accountIcon}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
