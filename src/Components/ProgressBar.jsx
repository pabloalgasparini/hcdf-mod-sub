import PropTypes from 'prop-types';

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-bar">
      <div className="progress" style={{ width: `${progress}%` }}></div>
    </div>
  );
};

// Validación de propiedades
ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired, // Se espera que 'progress' sea un número y sea obligatorio
};

export default ProgressBar;