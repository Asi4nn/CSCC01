package ca.utoronto.utm.mcs;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;

import static org.junit.jupiter.api.Assertions.*;

/*
Please Write Your Tests For CI/CD In This Class. 
You will see these tests pass/fail on github under github actions.
*/
public class AppTest {

   public void createData() throws JSONException, IOException, InterruptedException {
      JSONObject passenger = new JSONObject(), driver = new JSONObject(), road1 = new JSONObject(), road2 = new JSONObject();
      JSONObject passengerInfo = new JSONObject(), driverInfo = new JSONObject(), route = new JSONObject();
      passenger.put("uid", "1");
      passenger.put("is_driver", false);
      driver.put("uid", "2");
      driver.put("is_driver", true);
      road1.put("roadName", "road1");
      road1.put("hasTraffic", true);
      road2.put("roadName", "road2");
      road1.put("hasTraffic", false);
      passengerInfo.put("longitude", 0);
      passengerInfo.put("latitude", 0);
      passengerInfo.put("street", "road1");
      driverInfo.put("longitude", 0.01);
      driverInfo.put("latitude", 0.01);
      driverInfo.put("street", "road2");
      route.put("roadName1", "road2");
      route.put("roadName2", "road1");
      route.put("hasTraffic", false);
      route.put("time", 2);

      JSONObject res;
      res = Utils.SendRequestHttpURLConnection(passenger, "PUT", "/location/user", true);
      assertEquals("OK", res.get("status"));
      res = Utils.SendRequestHttpURLConnection(driver, "PUT", "/location/user", true);
      assertEquals("OK", res.get("status"));
      res = Utils.SendRequestHttpURLConnection(road1, "PUT", "/location/road", true);
      assertEquals("OK", res.get("status"));
      res = Utils.SendRequestHttpURLConnection(road2, "PUT", "/location/road", true);
      assertEquals("OK", res.get("status"));
      res = Utils.SendRequestHttpURLConnection(passengerInfo, "PATCH", "/location/1", true);
      assertEquals("OK", res.get("status"));
      res = Utils.SendRequestHttpURLConnection(driverInfo, "PATCH", "/location/2", true);
      assertEquals("OK", res.get("status"));
      res = Utils.SendRequestHttpURLConnection(route, "POST", "/location/hasRoute", true);
      assertEquals("OK", res.get("status"));
   }

   public ObjectId createTrip(String passengerUid, String driverUid, int startTime) {
      ObjectId id = new ObjectId();
      try {
         Document doc = new Document("_id", id)
                 .append("driver", driverUid)
                 .append("passenger", passengerUid)
                 .append("startTime", startTime);

         Utils.collection.insertOne(doc);
      } catch (Exception e) {
         fail("Failed to create trip");
      }

      return id;
   }

   @BeforeEach
   void SetupEach() {
      Utils.connectToMongo();
      Utils.recreateCollection();
   }

   @Test
   public void Request200() throws JSONException, IOException, InterruptedException {
      createData();

      JSONObject request = new JSONObject();
      request.put("uid", "1");
      request.put("radius", 50);

      JSONObject res = Utils.SendRequestHttpURLConnection(request, "POST", "/trip/request",  true);
      assertEquals("OK", res.get("status"));
   }

   @Test
   public void Request404() throws JSONException, IOException, InterruptedException {
      createData();

      JSONObject request = new JSONObject();
      request.put("uid", "3");
      request.put("radius", 50);

      JSONObject res = Utils.SendRequestHttpURLConnection(request, "POST", "/trip/request",  true);
      assertEquals("NOT FOUND", res.get("status"));
   }

   @Test
   public void Confirm200() throws JSONException, IOException {
      JSONObject request = new JSONObject(), driver = new JSONObject(), passenger = new JSONObject();
      driver.put("uid", "2");
      passenger.put("uid", "1");
      request.put("driver", driver);
      request.put("passenger", passenger);
      request.put("startTime", 1628460362);

      JSONObject res = Utils.SendRequestHttpURLConnection(request, "POST", "/trip/confirm",  true);
      assertEquals("OK", res.get("status"));
   }

   @Test
   public void Confirm400() throws JSONException, IOException {
      JSONObject request = new JSONObject(), driver = new JSONObject(), passenger = new JSONObject();
      driver.put("uid", "2");
      passenger.put("uid", "1");
      request.put("driver", driver);
      request.put("passenger", passenger);
      request.put("endTime", 1628460362); // bad request here

      JSONObject res = Utils.SendRequestHttpURLConnection(request, "POST", "/trip/confirm",  true);
      assertEquals("BAD REQUEST", res.get("status"));
   }

   @Test
   public void Id200() throws JSONException, IOException {
      // initialize trip
      ObjectId id = createTrip("1", "2", 1628460362);

      JSONObject request = new JSONObject();
      request.put("distance", 2);
      request.put("endTime", 1628460364);
      request.put("totalCost", 2);
      request.put("timeElapsed", 2);
      request.put("discount", 0);
      request.put("driverPayout", 20);

      JSONObject res = Utils.SendRequestHttpURLConnection(request, "PATCH", "/trip/" + id, true);
      assertEquals("OK", res.get("status"));
   }

   @Test
   public void Id400() throws JSONException, IOException {
      // initialize trip
      ObjectId id = createTrip("1", "2", 1628460362);

      JSONObject request = new JSONObject();
      request.put("distance", 2);
      request.put("startTime", 1628460364);  // bad request here
      request.put("totalCost", 2);
      request.put("timeElapsed", 2);
      request.put("discount", 0);
      request.put("driverPayout", 20);

      JSONObject res = Utils.SendRequestHttpURLConnection(request, "PATCH", "/trip/" + id, true);
      assertEquals("BAD REQUEST", res.get("status"));
   }

   @Test
   public void Passenger200() throws JSONException, IOException {
      // initialize trip
      createTrip("1", "2", 1628460362);

      JSONObject res = Utils.SendRequestHttpURLConnection(null, "GET", "/trip/passenger/1", false);
      assertEquals("OK", res.get("status"));
   }

   @Test
   public void Passenger404() throws JSONException, IOException {
      JSONObject res = Utils.SendRequestHttpURLConnection(null, "GET", "/trip/passenger/1", false);
      assertEquals("NOT FOUND", res.get("status"));
   }

   @Test
   public void Driver200() throws JSONException, IOException {
      // initialize trip
      createTrip("1", "2", 1628460362);

      JSONObject res = Utils.SendRequestHttpURLConnection(null, "GET", "/trip/driver/2", false);
      assertEquals("OK", res.get("status"));
   }

   @Test
   public void Driver404() throws JSONException, IOException {
      // initialize trip
      createTrip("1", "2", 1628460362);

      JSONObject res = Utils.SendRequestHttpURLConnection(null, "GET", "/trip/driver/2", false);
      assertEquals("NOT FOUND", res.get("status"));
   }

   @Test
   public void DriverTime200() throws JSONException, IOException {
      // initialize trip
      ObjectId id = createTrip("1", "2", 1628460362);

      JSONObject res = Utils.SendRequestHttpURLConnection(null, "GET", "/location/user/" + id, false);
      assertEquals("OK", res.get("status"));
   }

   @Test
   public void DriverTime400() throws JSONException, IOException {
      // initialize trip
      ObjectId id = createTrip("1", "2", 1628460362);

      JSONObject res = Utils.SendRequestHttpURLConnection(null, "GET", "/location/user", false);
      assertEquals("BAD REQUEST", res.get("status"));
   }

   @AfterEach()
   void TeardownEach() throws IOException, JSONException {
      Utils.disconnectFromMongo();
      HttpURLConnection client = Utils.getConnection("http://locationmicroservice:8000/deletedb", "GET");
      client.connect();
      int rCode = client.getResponseCode();
      InputStream stream;
      if (100 <= rCode && rCode <= 399) {
         stream = client.getInputStream();
      } else {
         stream = client.getErrorStream();
      }
      JSONObject res = Utils.readConnection(stream);

      client.disconnect();
      assertEquals("OK", res.get("status"));
   }
}
