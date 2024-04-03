export const handleFileUpload = async ({archivo, setIsUploading, setUploadProgress, setIsSaved, app, obtenerDocumentos}) => {
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
      alert("Error al cargar el archivo: " + error.message)
    }
  };
