import firebase from 'firebase';

/**
 * Función encargada de almacenar en Firebase la imagen que sea subida desde
 * los formularios, este devuelve el porcentaje de subida y el link de la imagen
 * @param {*} folderName nombre de la carpeta donde es almacenada la imagen
 * @param {*} file imagen a subir
 * @param {*} callback función a ejecutar una vez sea subida la imagen
 */
async function saveImg(folderName, file, callback) {
  const storageRef = firebase.storage().ref(`/${folderName}/${file.name}`);
  const task = storageRef.put(file);
  task.on('state_changed',
    snapshot => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(percentage, '%');
    }, error => {
      console.log(error.message);
    }, async function () {
      const url = await task.snapshot.ref.getDownloadURL();
      callback(url);
    }
  );
};

export default saveImg;
