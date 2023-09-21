import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/map.css"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTeachers } from "../store/authSlice";



const ViewTeacher = ({defaultCategory}) => {
  const url = useSelector((state) => state.auth.url);
  const token = useSelector((state) => state.auth.token);
  const courses = useSelector((state) => state.auth.courses);
  const teachersList = useSelector((state) => state.auth.teachers);
  const dispatch = useDispatch();

  const [latitude, setLatitude] = useState(21.1458);
  const [longitude, setLongitude] = useState(79.0882);
  const [locationList, setLocationList] = useState([]);
  const [filteredlocation, setFilteredlocation] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState(defaultCategory);

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [38, 38] // size of the icon
  });

  const getTeacherLocation = async () => {
    const response = await fetch(`${url}/teacher/getTeachers`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-type": "application/json" }
      });

    const data = await response.json();
    console.log("courses",courses)
    dispatch(setTeachers(data.teacherArray));
    setLocationList(data.locations);
    const filteredTeachers = courses.filter((item)=>{
      if(item.category===filteredCategory)
      return item.teacher
    });
    console.log("filteredTeachers",filteredTeachers);
    const test = data.teacherArray.map((item)=>(item.id))
    console.log("teacherArray",test);
    const locations =[];
    filteredTeachers?.forEach((item) => {
      if(test.includes(item._id))
      {
        console.log("name",item.name)
        locations.push({longitude:item.longitude, latitude:item.latitude})}
    });
    console.log("locations",locations);

  }
  useEffect(() => {
    getTeacherLocation();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }

    function success(position) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    }

    function error() {
      console.log("Unable to retrieve your location");
    }
  }, [])

  return (
    <div>
      <MapContainer center={[latitude, longitude]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={customIcon}>
          <Popup>Current Location</Popup>
        </Marker>
        {/* {
          locationList?.length > 0 && locationList.map((item, key) => {
            const lat = Object?.values(item.latitude);
            const lon = Object?.values(item.longitude);
            console.log("lattitute",lat)
            console.log("longitude",lon)
            return(
            <Marker position={[lat[0],lon[0]]} icon={customIcon}>
              <Popup>teacher Location</Popup>
            </Marker>)})
          } */}
          
      </MapContainer>
    </div>
  )
}

export default ViewTeacher;
