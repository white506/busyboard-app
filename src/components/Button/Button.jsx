import PropTypes from 'prop-types';
import styles from './Button.module.scss';
import clsx from 'clsx';

const Button = ({ text, className, onClick, disabled }) => {
  const handleClick = (e) => {
    if (onClick && !disabled) {
      onClick(e);
    }
  };

  return (
    <button
      className={clsx(styles.button, className)}
      onClick={handleClick}
      disabled={disabled}
    >
      {text || 'Default Text'} 
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Button;
