// LoadingMessage.jsx
import PropTypes from 'prop-types';

const LoadingMessage = ({ isLoading, isSaved }) => {
  if (isLoading) {
    return <p>Cargando...</p>;
  }
  if (isSaved) {
    return <p>El archivo se ha guardado en la base de datos.</p>;
  }
  return null;
};

LoadingMessage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isSaved: PropTypes.bool.isRequired,
};

export default LoadingMessage;
