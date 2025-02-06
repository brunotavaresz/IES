package weather;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;

/**
 * demonstrates the use of the IPMA API for weather forecast
 */
public class WeatherStarter {
    private static final Logger logger = LogManager.getLogger(WeatherStarter.class);

    public static void main(String[] args) {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://api.ipma.pt/open-data/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        IpmaService service = retrofit.create(IpmaService.class);

        List<String> city = getRandomCity(service);
        int cityCode = Integer.parseInt(city.get(0));
        String cityName = city.get(1);

        Call<IpmaCityForecast> callSync = service.getForecastForACity(cityCode);

        try {
            Response<IpmaCityForecast> apiResponse = callSync.execute();
            IpmaCityForecast forecast = apiResponse.body();

            if (forecast != null) {
                List<CityForecast> data = forecast.getData();
                if (!data.isEmpty()) {
                    CityForecast firstDay = data.get(0);
                    logger.info("Weather forecast for City Code " + cityCode + ":"
                            + "\n" + "Weather forecast for " + cityName + "\n" + "Date: "
                            + firstDay.getForecastDate() + "\n" + "Max Temperature: " + firstDay.getTMax() + "°C" + "\n"
                            + "Min Temperature: " + firstDay.getTMin() + "°C" + "\n" + "Precipitation Probability: "
                            + firstDay.getPrecipitaProb() + "%\n");
                } else {
                    logger.error("No data for this request!");

                }
            } else {
                logger.error("No results for this request! Code: " + cityCode);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public static List<String> getRandomCity(IpmaService service) {
        Call<IpmaCities> callSync = service.getCities();

        try {
            Response<IpmaCities> apiResponse = callSync.execute();
            IpmaCities forecast = apiResponse.body();

            List<IpmaCities> data = forecast.getData();

            int randomCity = (int) (Math.random() * data.size());
            IpmaCities city = data.get(randomCity);

            List<String> cityInfo = new ArrayList<>();
            cityInfo.add(String.valueOf(city.getGlobalIdLocal()));
            cityInfo.add(city.getLocal());

            return cityInfo;

        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return null;
    }
}
