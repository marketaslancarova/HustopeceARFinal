// // redux/dataSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { RootState } from "./store";

interface Monument {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  [key: string]: any;
}

interface Mystery {
  id: string;
  title: string;
  [key: string]: any;
}

interface DataState {
  downloadedMysteries: string[];
  mysteries: Mystery[];
  monuments: Monument[];
  downloadedMonuments: string[];
  loading: boolean;
  error: string | null;
}

export const fetchMetadata = createAsyncThunk(
  "data/fetchMetadata",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const lang = state.language.currentLanguage;

    const mysteriesSnap = await getDocs(collection(db, `mysteries_${lang}`));
    const monumentsSnap = await getDocs(collection(db, `monuments_${lang}`));

    const mysteries = mysteriesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const monuments = monumentsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { mysteries, monuments };
  }
);

const initialState: DataState = {
  downloadedMysteries: [],
  mysteries: [],
  monuments: [],
  downloadedMonuments: [],
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    addDownloadedMystery: (state, action: PayloadAction<string>) => {
      if (!state.downloadedMysteries.includes(action.payload)) {
        state.downloadedMysteries.push(action.payload);
      }
    },
    addDownloadedMonument: (state, action: PayloadAction<string>) => {
      if (!state.downloadedMonuments.includes(action.payload)) {
        state.downloadedMonuments.push(action.payload);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMetadata.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMetadata.fulfilled, (state, action) => {
        state.mysteries = action.payload.mysteries;
        state.monuments = action.payload.monuments;
        state.loading = false;
      })
      .addCase(fetchMetadata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Došlo k chybě při načítání dat.";
      });
  },
});

export const { addDownloadedMystery, addDownloadedMonument } = dataSlice.actions;
export default dataSlice.reducer;
