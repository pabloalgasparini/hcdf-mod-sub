import PropTypes from 'prop-types'; // Importar PropTypes
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FileList = ({ files, handleFileClick }) => {
  return (
    <ul>
      {files.map((file, index) => (
        <li 
          key={index} 
          style={{ cursor: "pointer" }} 
          onClick={() => handleFileClick(file.url)}
        >
          <FontAwesomeIcon icon={faFilePdf} /> {file.nombres}
        </li>
      ))}
    </ul>
  );
};

// Validación de props
FileList.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired, // URL del archivo (string, requerido)
      nombres: PropTypes.string.isRequired, // Nombre del archivo (string, requerido)
    })
  ).isRequired, // Arreglo de objetos de archivo, requerido
  handleFileClick: PropTypes.func.isRequired // Función de clic en archivo, requerida
};

export default FileList;
