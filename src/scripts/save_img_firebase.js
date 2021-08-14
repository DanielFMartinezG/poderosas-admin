import firebase from 'firebase';

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
