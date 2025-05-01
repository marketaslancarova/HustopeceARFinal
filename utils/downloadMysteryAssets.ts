// utils/downloadMysteryAssets.ts
import * as FileSystem from 'expo-file-system';
import { getMediaURL } from './getMediaURL';
import { addDownloadedMystery } from '../redux/dataSlice';

export async function downloadMysteryAssets(item: any, dispatch: any) {
  const gameFlow = item.gameFlow || [];

  for (const step of gameFlow) {
    const assetsToDownload = [
      { key: 'audio', path: step.audio },
      { key: 'video', path: step.video },
      { key: 'background', path: step.background },
      { key: 'guide', path: step.guide },
    ];

    for (const asset of assetsToDownload) {
      if (!asset.path) continue;

      const downloadUrl = await getMediaURL(asset.path);
      if (!downloadUrl) continue;

      const fileName = asset.path.split('/').pop();
      const localPath = FileSystem.documentDirectory + fileName;

      const fileInfo = await FileSystem.getInfoAsync(localPath);
      if (!fileInfo.exists) {
        await FileSystem.downloadAsync(downloadUrl, localPath);
      }
    }
  }

  dispatch(addDownloadedMystery(item.id));
}
