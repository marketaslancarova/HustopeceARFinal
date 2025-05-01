// utils/getMediaURL.ts
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../redux/firebase";

export async function getMediaURL(path: string): Promise<string | null> {
  if (!path) return null;

  try {
    const url = await getDownloadURL(ref(storage, path));
    return url;
  } catch (error: any) {
    console.error(`❌ Chyba při načítání: ${path}`, error.message);
    return null;
  }
}
