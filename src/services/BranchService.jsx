import axios from 'axios';

const BDO_URL = "https://www.applynow.bdo.com.ph/_api/infy_branchs";

function getDistanceBetween(lat1, lng1, lat2, lng2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function BranchService() {
  return (
    <div>BranchService</div>
  )
}

export async function getBranches(location) {
    const geoRes = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
            address: location,
            key: "AIzaSyCoUdcR6aVirRkqbld2NS5gGF9gIMKya3k",
        },
    })
    const center = geoRes.data.results[0].geometry.location;

    // const response = await axios.get(BDO_URL, {
    //     params: {
    //         $select: "infy_branchid,infy_name,infy_branchaddress,infy_longitude,infy_latitude",
    //         $filter: "statecode eq 0 and bdo_branch eq 1",
    //     }
    // })
    const response = await axios.get("http://localhost:5010/bdo-branches");
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
      ).toFixed(2),
    }))
    .filter((b) => b.distance < 1)
    .sort((a, b) => a.distance - b.distance);

  return { branches, center };


}