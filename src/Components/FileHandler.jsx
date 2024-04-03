import { useState } from 'react';
import ProgressBar from './ProgressBar';
import PropTypes from 'prop-types';

// Componente para manejar la carga de archivos
const FileHandler = ({ handleFileUpload }) => {
  // Estado para controlar si se está cargando un archivo
  const [isUploading, setIsUploading] = useState(false);
  // Estado para almacenar el progreso de la carga del archivo
  const [uploadProgress, setUploadProgress] = useState(0);

  // Función para manejar la selección de archivos
  const archivosHandler = async (e) => {
    try {
      const archivos = e.target.files; // Obtener los archivos seleccionados
      setIsUploading(true); // Establecer el estado de carga a verdadero
      // Iterar sobre cada archivo seleccionado y llamar a la función para cargar el archivo
      for (let i = 0; i < archivos.length; i++) {
        const archivo = archivos[i];
        await handleFileUpload(archivo, setUploadProgress);
      }
      setIsUploading(false); // Establecer el estado de carga a falso después de completar la carga
      setUploadProgress(0); // Restablecer el progreso de la carga
    } catch (error) {
      console.error("Error al cargar el archivo:", error); // Capturar y registrar cualquier error que ocurra durante la carga del archivo
      // Aquí podrías agregar lógica adicional para mostrar un mensaje de error al usuario
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input type="file" onChange={archivosHandler} multiple /> {/* Permitir la selección de varios archivos */}
      {isUploading && <ProgressBar progress={uploadProgress} />} {/* Mostrar la barra de progreso si se está cargando un archivo */}
    </form>
  );
};


// Validación de props
FileHandler.propTypes = {
  handleFileUpload: PropTypes.func.isRequired // Función para manejar la carga de archivos, requerida
};

export default FileHandler;

