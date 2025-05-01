// utils/getGameFlowAssets.ts
import { getMediaURL } from "./getMediaURL";
import { Asset } from "expo-asset";

async function preloadMedia(url: string) {
  try {
    const asset = Asset.fromURI(url);
    await asset.downloadAsync();
    return asset.localUri || asset.uri;
  } catch (e) {
    console.warn("Preload failed:", url, e);
    return url;
  }
}

export async function getGameFlowAssets(gameFlow: any[]) {
  return await Promise.all(
    gameFlow.map(async (item) => {
      const enrichedItem = { ...item };

      if (item.audio) {
        const url = await getMediaURL(item.audio);
        enrichedItem.audioUrl = await preloadMedia(url);
      }

      if (item.video) {
        const url = await getMediaURL(item.video);
        enrichedItem.videoUrl = await preloadMedia(url);
      }

      if (item.background) {
        const url = await getMediaURL(item.background);
        enrichedItem.backgroundImageUrl = await preloadMedia(url);
      }

      if (item.guide) {
        const url = await getMediaURL(item.guide);
        enrichedItem.guideUrl = await preloadMedia(url);
      }

      return enrichedItem;
    })
  );
}
