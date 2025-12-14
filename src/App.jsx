// esintial imports
import "./App.css";
import { useEffect, useState } from "react";

// Matiral UI
import Button from "@mui/material/Button";
import CloudIcon from "@mui/icons-material/Cloud";

// external library
import axios from "axios";
import moment from "moment";
import "moment/locale/ar";
import { useTranslation } from "react-i18next";



let cancelAxsios = null;
function App() {
  const { t, i18n } = useTranslation();
  moment.locales(i18n.language);

  const [userLocation, setUserLocation] = useState({
    latitude: 24.7136,
    longitude: 46.6753,
  });

  const [wetherinfo, setWetherinfo] = useState({
    temp: null,
    high: null,
    low: null,
    cityName: null,
    data: null,
    description: null,
  });

  // git user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords.latitude, position.coords.longitude);
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);

  //    Api requist
  useEffect(() => {
    // req
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid={youe Api key}`, 
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxsios = c;
          }),
        }
      )
      .then(function (response) {
        // handle success
        setWetherinfo({
          temp: Math.round(response.data.main.temp - 276.15),
          high: Math.round(response.data.main.temp_max - 276.15),
          low: Math.round(response.data.main.temp_min - 276.15),
          cityName: response.data.name,
          description: response.data.weather[0].description,
          icone: response.data.weather[0].icon,
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    // Clean up
    return () => {
      console.log("Canceling...");
      cancelAxsios();
    };
  }, []);


  return (
    <div className="flex flex-col justify-center flex-wrap  min-w-2xs">
      <div className="card rounded-3xl p-7  min-w-96 shadow-2xl">
        {/* card Header */}
        <div className="border-b-2 border-amber-50 flex gap-2.5 items-end">
          <h1>{t(wetherinfo.cityName)}</h1>
          <p>{moment().format("LL")} - {moment().format("dddd")}</p>
        </div>

        {/* card body */}
        <div className="leading-16 flex items-center justify-between">
          {/* info section */}
          <div>
            <div className="flex justify-center">
              <div>
                <h2>{wetherinfo.temp}°C</h2>
                <p className="text-2xl">{t(wetherinfo.description)}</p>
              </div>
              <div>
                <img
                  src={`https://openweathermap.org/img/wn/${wetherinfo.icone}@2x.png`}
                  alt={wetherinfo.description}
                />
              </div>
            </div>

            <div className="flex items-center">
              <p>
                {t("max")}: {wetherinfo.high}°C{" "}
              </p>
              <p className="m-1"> | </p>
              <p>
                {t("min")}: {wetherinfo.low}°C{" "}
              </p>
            </div>
          </div>

          <div className="mr-2.5">
            <CloudIcon sx={{ fontSize: "150px" }} />
          </div>
        </div>
      </div>

      <Button
        variant="text"
        sx={{ color: "white" }}
        onClick={(e) => {
          if (e.target.textContent != "English") {
            e.target.textContent = "English";
            i18n.changeLanguage("ar");
          } else {
            e.target.textContent = "العربية";
            i18n.changeLanguage("en");
          }
        }}
      >
        English
      </Button>
    </div>
  );
}

export default App;
