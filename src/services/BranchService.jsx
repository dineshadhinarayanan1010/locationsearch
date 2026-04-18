import axios from 'axios';

import { configureStore, createSlice } from "@reduxjs/toolkit";

const TTL = 1000 * 60 * 180; // 3 hour cache

// 🧠 SLICE
const branchSlice = createSlice({
  name: "branches",
  initialState: {
    bdoData: [],
    lastFetched: null,
  },
  reducers: {
    setBDOData(state, action) {
      state.bdoData = action.payload.data;
      state.lastFetched = action.payload.timestamp;
    },
  },
});

export const { setBDOData } = branchSlice.actions;

// 🏦 FETCH BDO DATA (CACHED)
export const fetchBDOData = () => async (dispatch, getState) => {
  const { bdoData, lastFetched } = getState().branches;

  // ✅ use cache if still valid
  if (bdoData.length && Date.now() - lastFetched < TTL) {
    console.log("⚡ Using cached BDO data");
    return bdoData;
  }

  // 🌐 fetch from API
  const res = await axios.get(import.meta.env.VITE_BDO_LOCAL_API_URL);

  dispatch(
    setBDOData({
      data: res.data.value,
      timestamp: Date.now(),
    })
  );

  return res.data.value;
};

function getDistanceBetween(lat1, lng1, lat2, lng2) {
  const toRad = (v) => (v * Math.PI) / 180; //convert degree to radian
  const R = 6371; //radius of earth

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  //haversine formula
  const a =
    Math.sin(dLat / 2) ** 2 + // north south movement
    // east west movement 
    Math.cos(toRad(lat1)) * //to take horizontal distance into account as earth is spherical
    Math.cos(toRad(lat2)) * //longitude depends on latitude
    Math.sin(dLng / 2) ** 2; // longitude moves along a ring and cos function helps to identify the length of ring

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))); // returns the angle and multiplied with radius to get distance
}

export const getBranches = (location) => async (dispatch) => {

  // const BDO_URL = "https://www.applynow.bdo.com.ph/_api/infy_branchs";
  const geoRes = await axios.get(import.meta.env.VITE_MAP_GOOGLE_API_URL, {
    params: {
      address: location,
      key: import.meta.env.VITE_MAP_API_KEY,
    },
  })
  const center = geoRes.data.results[0].geometry.location;

  // const response = await axios.get(BDO_URL, {
  //     params: {
  //         $select: "infy_branchid,infy_name,infy_branchaddress,infy_longitude,infy_latitude",
  //         $filter: "statecode eq 0 and bdo_branch eq 1",
  //     }
  // })

  // const response = await axios.get(import.meta.env.VITE_BDO_LOCAL_API_URL);
  // const bdoApiRes = response.data.value;

  // get cached BDO data
  const bdoApiRes = await dispatch(fetchBDOData());

  const branches = bdoApiRes.filter((branch) => branch.infy_latitude && branch.infy_longitude)
    .map((branch) => ({
      id: branch.infy_branchid,
      name: branch.infy_name,
      address: branch.infy_branchaddress,
      lat: parseFloat(branch.infy_latitude),
      lng: parseFloat(branch.infy_longitude),
      distance: getDistanceBetween(
        center.lat,
        center.lng,
        parseFloat(branch.infy_latitude),
        parseFloat(branch.infy_longitude)
      ),
      bankingHours: branch.infy_bankinghours ? branch.infy_bankinghours : {
        days: "Monday - Friday",
        hours: "08:30AM - 05:30PM",
      }
    }))
    .filter((b) => b.distance < 2)
    .sort((a, b) => a.distance - b.distance);

  return { branches, center };


}

export const store = configureStore({
  reducer: {
    branches: branchSlice.reducer,
  },
});