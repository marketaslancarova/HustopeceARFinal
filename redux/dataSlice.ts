import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { RootState } from './store';

// Typy pro data
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
  mysteries: Mystery[];
  monuments: Monument[];
  downloadedMonuments: string[];
  loading: boolean;
  error: string | null;
}

// Async thunk pro načtení dat
export const fetchMetadata = createAsyncThunk(
  'data/fetchMetadata',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const lang = state.language.currentLanguage; // např. 'cz', 'en', 'de'

    const mysteriesSnap = await getDocs(collection(db, `mysteries_${lang}`));
    const monumentsSnap = await getDocs(collection(db, `monuments_${lang}`));

    const mysteries = mysteriesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const monuments = monumentsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { mysteries, monuments };
  }
);

// Slice
const initialState: DataState = {
  mysteries: [],
  monuments: [],
  downloadedMonuments: [],
  loading: false,
  error: null
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
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
        state.error = action.error.message || 'Došlo k chybě při načítání dat.';
      });
  }
});

// Exporty
export const { addDownloadedMonument } = dataSlice.actions;
export default dataSlice.reducer;
