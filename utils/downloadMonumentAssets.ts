// utils/downloadMonumentAssets.ts
import * as FileSystem from 'expo-file-system';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../redux/firebase'; // uprav podle projektu
import { extractMediaPathsFromItem } from "../utils/extractMediaPathsFromItem";
import { addDownloadedMonument } from '../redux/dataSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const downloadMonumentAssets = async (item, dispatch) => {
  try {
    const media = await extractMediaPathsFromItem(item);

    const downloadFile = async (url: string, fileName: string) => {
      const storageRef = ref(storage, url);
      const downloadUrl = await getDownloadURL(storageRef);
      const localUri = FileSystem.documentDirectory + fileName;
      await FileSystem.downloadAsync(downloadUrl, localUri);
      return localUri;
    };

    // obrázky
    const imageUris = await Promise.all(
      media.images.map((url, i) => downloadFile(url, `${item.id}_img_${i}.jpg`))
    );

    // audio
    let audioUri = null;
    if (media.audio) {
      audioUri = await downloadFile(media.audio, `${item.id}_audio.mp3`);
    }

    // Ulož lokální cesty do asyncStorage nebo Reduxu (pokud chceš)
    // Prozatím stačí, že zapíšeme do Reduxu, že máme stažené:
    dispatch(addDownloadedMonument(item.id));

    await AsyncStorage.setItem(`monument_${item.id}_media`, JSON.stringify({
      images: imageUris,
      audio: audioUri,
    }));

    return { imageUris, audioUri };
  } catch (e) {
    console.error("Chyba při stahování obsahu:", e);
    throw e;
  }
};
