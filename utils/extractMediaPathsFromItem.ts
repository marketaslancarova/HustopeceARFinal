import { getMediaURL } from "./getMediaURL";

export async function extractMediaPathsFromItem(item: any) {
  const media = {
    images: [] as string[],
    audio: null as string | null,
  };

  if (item.assets?.images?.length > 0) {
    const urls = await Promise.all(item.assets.images.map((path: string) => getMediaURL(path)));
    media.images = urls.filter(Boolean);
  }

  if (item.assets?.audio) {
    media.audio = await getMediaURL(item.assets.audio);
  }

  return media;
}
