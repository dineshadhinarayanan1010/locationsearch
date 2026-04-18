import axios from 'axios';

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

export async function getBranches(location) {
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

    const response = await axios.get(import.meta.env.VITE_BDO_LOCAL_API_URL);
    const bdoApiRes = response.data.value;

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
    .filter((b) => b.distance < 1)
    .sort((a, b) => a.distance - b.distance);

  return { branches, center };


}