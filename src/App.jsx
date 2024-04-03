import { useEffect, useState } from 'react';
import './App.css';
import { app } from "./fb"; // Importar la instancia de Firebase
import ProgressBar from './Components/ProgressBar';
import LoadingMessage from './Components/LoadingMessage';
import FileList from './Components/FileList';
import FileHandler from './Components/FileHandler';
import ResolucionesHandler from './Components/Resolucioes';

function App() {
  // Definición de estados
  const [docus, setDocus] = useState([]); // Estado para almacenar la lista de archivos
  const [docusSearch, setDocusSearch] = useState(""); // Estado para almacenar el término de búsqueda
  const [isSearching, setIsSearching] = useState(false); // Estado para controlar si se está realizando una búsqueda
  const [isUploading, setIsUploading] = useState(false); // Estado para controlar si se está cargando un archivo
  const [uploadProgress, setUploadProgress] = useState(0); // Estado para almacenar el progreso de la carga del archivo
  const [isSaved, setIsSaved] = useState(false); // Estado para controlar si se ha guardado el archivo en la base de datos
  const [showFiles, setShowFiles] = useState(false); // Estado para controlar si se deben mostrar los archivos
  const [resoluciones, setResoluciones] = useState([]);



    const ResolucionesFileUpload = async (archivo) => {
    try {
      // Verificar si el archivo es de tipo PDF
      if (archivo.type !== "application/pdf") {
        throw new Error("El archivo debe ser de tipo PDF.");
      }

      setIsUploading(true);
      const storageRef = app.storage().ref();
      const archivoPath = storageRef.child(archivo.name);

      // Subir el archivo al almacenamiento
      archivoPath.put(archivo).on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, (error) => {
        throw error; // Lanzar error si ocurre un problema durante la carga del archivo
      }, () => {
        archivoPath.getDownloadURL().then(async (url) => {
          setIsUploading(false);
          setUploadProgress(0);
          setIsSaved(true);

          // Generar un ID único para el documento en Firestore
          const docId = app.firestore().collection("resoluciones").doc().id;

          // Guardar el archivo en Firestore utilizando el ID generado
          await app.firestore().collection("resoluciones").doc(docId).set({
            nombres: archivo.name,
            url: url
          });

          obtenerResoluciones();
        });
      });
    } catch (error) {
      console.error("Error al cargar el archivo:", error.message);
      // Aquí podrías agregar lógica adicional para mostrar un mensaje de error al usuario
      alert("Error al cargar el archivo: " + error.message)
    }
  };





  // Función para manejar la carga de archivos
  const handleFileUpload = async (archivo) => {
    try {
      // Verificar si el archivo es de tipo PDF
      if (archivo.type !== "application/pdf") {
        throw new Error("El archivo debe ser de tipo PDF.");
      }

      setIsUploading(true);
      const storageRef = app.storage().ref();
      const archivoPath = storageRef.child(archivo.name);

      // Subir el archivo al almacenamiento
      archivoPath.put(archivo).on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, (error) => {
        throw error; // Lanzar error si ocurre un problema durante la carga del archivo
      }, () => {
        archivoPath.getDownloadURL().then(async (url) => {
          setIsUploading(false);
          setUploadProgress(0);
          setIsSaved(true);

          // Generar un ID único para el documento en Firestore
          const docId = app.firestore().collection("archivos").doc().id;

          // Guardar el archivo en Firestore utilizando el ID generado
          await app.firestore().collection("archivos").doc(docId).set({
            nombres: archivo.name,
            url: url
          });

          obtenerDocumentos();
        });
      });
    } catch (error) {
      console.error("Error al cargar el archivo:", error.message);
      // Aquí podrías agregar lógica adicional para mostrar un mensaje de error al usuario
    }
  };

  // Función para obtener la lista de documentos
  const obtenerDocumentos = async () => {
    try {
      const docusList = await app.firestore().collection("archivos").get();
      setDocus(docusList.docs.map((doc) => doc.data())); // Actualizar la lista de documentos
    } catch (error) {
      console.error("Error al obtener los documentos:", error.message);
      // Aquí podrías agregar lógica adicional para mostrar un mensaje de error al usuario
    }
  };

// Función para obtener la lista de resoluciones
const obtenerResoluciones = async () => {
  try {
    const docusList = await app.firestore().collection("resoluciones").get();
    setResoluciones(docusList.docs.map((doc) => doc.data())); // Actualizar la lista de documentos
  } catch (error) {
    console.error("Error al obtener los documentos:", error.message);
    // Aquí podrías agregar lógica adicional para mostrar un mensaje de error al usuario
  }
};


  // Función para manejar el clic en un archivo
  const handleFileClick = (url) => {
    window.open(url, "_blank"); // Abrir el archivo en una nueva pestaña
  };

  // Filtrar la lista de archivos según el término de búsqueda
  const filteredFiles = docus.filter(file =>
    isSearching ? file.nombres.toLowerCase().includes(docusSearch.toLowerCase()) : true
  );

// Función para realizar la búsqueda
const performSearch = () => {
  const foundFiles = docus.filter(file =>
    file.nombres.toLowerCase().includes(docusSearch.toLowerCase())
  );
  setShowFiles(foundFiles.length > 0); // Establecer showFiles en true solo si se encontraron archivos
  setIsSearching(true);
};


// Inicializar showFiles como false para que no se muestren archivos antes de la búsqueda
useEffect(() => {
  setShowFiles(false);
}, []);

// Obtener la lista de documentos al cargar el componente o al realizar una búsqueda
useEffect(() => {
  if (isSearching) {
    obtenerDocumentos();
  }
}, [isSearching]);

  return (
    <>
      {/* Componente para manejar la carga de archivos */}
      <div>
      <h2>Ordenanzas</h2>
      <FileHandler handleFileUpload={handleFileUpload} />
      </div>

      <div>
      <h2>Resoluciones</h2>
      <ResolucionesHandler ResolucionesFileUpload={ResolucionesFileUpload} />
      </div>



      <div>
        <h2>Ordenanzas</h2>
        {/* Campo de búsqueda */}
        <input
          type="text"
          placeholder="Buscar archivos..."
          value={docusSearch}
          onChange={(e) => {
            setDocusSearch(e.target.value);
          }}
        />


        

        {/* Botón de búsqueda */}
       <button onClick={performSearch} onKeyDown={(e) => e.key === 'Enter' && performSearch()}>Buscar</button>


        {/* Mostrar la barra de progreso si se está cargando un archivo */}
        {isUploading && <ProgressBar progress={uploadProgress} />}

        {/* Mostrar mensaje de carga */}
        <LoadingMessage isLoading={isUploading} isSaved={isSaved} />

        {/* Mostrar la lista de archivos si se han buscado */}
        {showFiles && <FileList files={filteredFiles} handleFileClick={handleFileClick} /> }
      </div>
    </>
  );
}

export default App;
