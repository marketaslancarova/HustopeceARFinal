// utils/getGameFlowAssetsOffline.ts
import * as FileSystem from 'expo-file-system';

export async function getGameFlowAssetsOffline(gameFlow: any[]) {
  return await Promise.all(
    gameFlow.map(async (item) => {
      const enrichedItem = { ...item };

      const getLocalUri = (path: string | undefined) => {
        if (!path) return null;
        const fileName = path.split('/').pop();
        return FileSystem.documentDirectory + fileName;
      };

      enrichedItem.audioUrl = getLocalUri(item.audio);
      enrichedItem.videoUrl = getLocalUri(item.video);
      enrichedItem.backgroundImageUrl = getLocalUri(item.background);
      enrichedItem.guideUrl = getLocalUri(item.guide);

      return enrichedItem;
    })
  );
}
