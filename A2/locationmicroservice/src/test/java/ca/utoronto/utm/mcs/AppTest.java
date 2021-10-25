package ca.utoronto.utm.mcs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.neo4j.driver.Values.parameters;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.neo4j.driver.*;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/*
Please Write Your Tests For CI/CD In This Class.
You will see these tests pass/fail on github under github actions.
*/
public class AppTest {

   public void DeleteDB(){
      Session session = Utils.driver.session();
      session.writeTransaction(tx -> {
         tx.run("MATCH (a)-[r]->() DELETE a, r");
         tx.run("MATCH (a) DELETE a;");
         return null;
      });
   }

   private HttpURLConnection getConnection(String endpoint, String method) throws IOException {
      URL url = new URL("http://apigateway:8000" + endpoint);
      HttpURLConnection client = (HttpURLConnection) url.openConnection();
      client.setDoOutput(true);
      client.setRequestProperty("Accept", "application/json");
      client.setRequestProperty("Content-Type", "application/json");
      client.setRequestMethod(method);
      return client;
   }

   private void writeConnection(OutputStream out, JSONObject jsonObject) throws IOException {
      OutputStreamWriter outWriter = new OutputStreamWriter(out, StandardCharsets.UTF_8);
      outWriter.write(jsonObject.toString());
      outWriter.flush();
      outWriter.close();
      out.close();
   }

   private JSONObject readConnection(InputStream in) throws IOException, JSONException {
      BufferedReader bufRead = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8));
      StringBuilder response = new StringBuilder();
      String line;
      while ((line = bufRead.readLine()) != null){
         response.append(line.trim());
      }
      in.close();
      return new JSONObject(response.toString());
   }

   public JSONObject getInputStreamAndReadConnection(int rCode, HttpURLConnection client) throws IOException, JSONException {
      InputStream stream;
      if (100 <= rCode && rCode <= 399) {
         stream = client.getInputStream();
      } else {
         stream = client.getErrorStream();
      }
      JSONObject res = readConnection(stream);
      return res;
   }

   @BeforeEach
   void SetupEach() {
      DeleteDB();
   }

   @Test
   public void GetNearbyDriver200() throws IOException, JSONException {
      String passengerUid = "1";
      String driverUid = "2";

      int radius = 50;

      try (Session session = Utils.driver.session()) {
         String newUserQuery = "CREATE (n: user {uid:$x,is_driver:$y, longitude: 0, latitude: 0, street_at: 'road2'}) RETURN n";
         Result queryResult = session.run(newUserQuery, parameters("x", passengerUid, "y", false));
         assertTrue(queryResult.hasNext(), "Failed to create passenger");
         queryResult.next();

         newUserQuery = "CREATE (n: user {uid:$x,is_driver:$y, longitude: 0.01, latitude: 0.01, street_at: 'road1'}) RETURN n";
         queryResult = session.run(newUserQuery, parameters("x", driverUid, "y", true));
         assertTrue(queryResult.hasNext(), "Failed to create driver");
         queryResult.next();
      } catch (Exception e) {
         System.out.println("Something went wrong");
      }

      HttpURLConnection client = getConnection("/location/nearbyDriver/" + passengerUid + "?radius=" + radius, "GET");
      client.connect();
      int rCode = client.getResponseCode();
      JSONObject res = getInputStreamAndReadConnection(rCode, client);
      client.disconnect();

      assertEquals(HttpURLConnection.HTTP_OK, rCode);
      assertEquals("OK", res.get("status"));
   }

   @Test
   public void GetNearbyDriver400() throws JSONException, IOException {
      HttpURLConnection client = getConnection("/location/nearbyDriver/1?radius=50", "GET");
      client.connect();
      int rCode = client.getResponseCode();
      JSONObject res = getInputStreamAndReadConnection(rCode, client);
      client.disconnect();

      assertEquals(HttpURLConnection.HTTP_NOT_FOUND, rCode);
      assertEquals("NOT FOUND", res.get("status"));
   }

   @Test
   public void GetNavigation200() throws JSONException, IOException {
      String passengerUid = "1";
      String driverUid = "2";

      String road1Name = "road1";
      boolean is_traffic1 = false;
      String road2Name = "road2";
      boolean is_traffic2 = true;

      boolean is_trafficRoute = false;
      int time = 2;

      try (Session session = Utils.driver.session()) {
         String newUserQuery = "CREATE (n: user {uid:$x,is_driver:$y, longitude: 0, latitude: 0, street_at: 'road2'}) RETURN n";
         Result queryResult = session.run(newUserQuery, parameters("x", passengerUid, "y", false));
         assertTrue(queryResult.hasNext(), "Failed to create passenger");
         queryResult.next();

         newUserQuery = "CREATE (n: user {uid:$x,is_driver:$y, longitude: 0, latitude: 0, street_at: 'road1'}) RETURN n";
         queryResult = session.run(newUserQuery, parameters("x", driverUid, "y", true));
         assertTrue(queryResult.hasNext(), "Failed to create driver");
         queryResult.next();

         String newRoadQuery = "CREATE (n: road {name:$x,is_traffic:$y}) RETURN n";
         Result newRoadRes = session.run(newRoadQuery, parameters("x", road1Name, "y", is_traffic1));
         assertTrue(newRoadRes.hasNext(), "Failed to create road1");
         queryResult.next();

         newRoadQuery = "CREATE (n: road {name:$x,is_traffic:$y}) RETURN n";
         newRoadRes = session.run(newRoadQuery, parameters("x", road2Name, "y", is_traffic2));
         assertTrue(newRoadRes.hasNext(), "Failed to create road2");
         queryResult.next();

         String preparedStatement = "MATCH (r1:road {name: $x}), (r2:road {name: $y}) "
                 + "CREATE (r1) -[r:ROUTE_TO {travel_time: $z, is_traffic: $u}]->(r2) RETURN type(r)";
         Result result = session.run(preparedStatement,
                 parameters("x", road1Name, "y", road2Name, "u", is_trafficRoute, "z", time));
         assertTrue(result.hasNext(), "Failed to create route");
         result.next();
      } catch (Exception e) {
         System.out.println("Something went wrong");
      }

      HttpURLConnection client = getConnection("/location/navigation/" + driverUid + "?passengerUid=" + passengerUid, "GET");
      client.connect();
      int rCode = client.getResponseCode();
      JSONObject res = getInputStreamAndReadConnection(rCode, client);
      client.disconnect();

      assertEquals(HttpURLConnection.HTTP_OK, rCode);
      assertEquals("OK", res.get("status"));
   }

   @Test
   public void GetNavigation400() throws JSONException, IOException {
      HttpURLConnection client = getConnection("/location/navigation/2", "GET");
      client.connect();
      int rCode = client.getResponseCode();
      JSONObject res = getInputStreamAndReadConnection(rCode, client);
      client.disconnect();

      assertEquals(HttpURLConnection.HTTP_BAD_REQUEST, rCode);
      assertEquals("BAD REQUEST", res.get("status"));
   }
}
