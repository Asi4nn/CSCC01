package ca.utoronto.utm.mcs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

/*
Please Write Your Tests For CI/CD In This Class. 
You will see these tests pass/fail on github under github actions.
*/
public class AppTest {

   private static Connection conn;

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

   private static JSONObject readConnection(InputStream in) throws IOException, JSONException {
      BufferedReader bufRead = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8));
      StringBuilder response = new StringBuilder();
      String line;
      while ((line = bufRead.readLine()) != null){
         response.append(line.trim());
      }
      in.close();
      return new JSONObject(response.toString());
   }

   private void DeleteDB() throws SQLException {
      conn.prepareStatement(
      "DROP TABLE IF EXISTS Users;\n" +
              "DROP TABLE IF EXISTS Coupons;\n" +
              "\n" +
              "CREATE TABLE Users(\n" +
              "\tuid SERIAL NOT NULL PRIMARY KEY,\n" +
              "\temail varchar NOT NULL UNIQUE,\n" +
              "\tprefer_name varchar NOT NULL,\n" +
              "\t\"password\" varchar NOT NULL,\n" +
              "\trides NUMERIC NOT NULL,\n" +
              "\tisDriver bool NOT NULL DEFAULT false,\n" +
              "\tavailableCoupons integer[] NOT NULL,\n" +
              "    redeemedCoupons integer[] NOT NULL\n" +
              ");\n" +
              "\n" +
              "CREATE TABLE Coupons(\n" +
              "    cid SERIAL NOT NULL PRIMARY KEY,\n" +
              "    \"name\" varchar(255) NOT NULL,\n" +
              "    description varchar(1000) NOT NULL,\n" +
              "\tdiscount numeric NOT NULL,\n" +
              "    expiry date NOT NULL\n" +
              ");\n" +
              "\n" +
              "\n" +
              "INSERT INTO Coupons VALUES (1,'Ride one Get $10 off','This coupon is added after you take your first ride from Zoomer!',10,'2099-12-31');\n" +
              "INSERT INTO Coupons VALUES (2,'Have a $5 off','This coupon is only avaliable when you ride is greater than $10',5,'2099-12-31');"
      ).execute();
   }

   private static void AddTestUser(String name, String email, String password) throws SQLException {
      PreparedStatement ps = conn.prepareStatement(
      "INSERT INTO Users (prefer_name, email, password, rides, availableCoupons, redeemedCoupons) VALUES (?, ?, ?, 0, '{}', '{}')"
      );
      ps.setString(1, name);
      ps.setString(2, email);
      ps.setString(3, password);
      ps.execute();
   }

   public static JSONObject getInputStreamAndReadConnection(int rCode, HttpURLConnection client) throws IOException, JSONException {
      InputStream stream;
      if (100 <= rCode && rCode <= 399) {
         stream = client.getInputStream();
      } else {
         stream = client.getErrorStream();
      }
      JSONObject res = readConnection(stream);
      return res;
   }

   @BeforeAll
   static void Setup() throws ClassNotFoundException, SQLException {
      String url = Utils.url;
      Class.forName("org.postgresql.Driver");
      conn = DriverManager.getConnection(url, "root", "123456");
   }

   @BeforeEach
   void setupEach() throws SQLException {
      DeleteDB();
   }

   @Test
   public void Register200() throws JSONException, IOException {
      JSONObject requestBody = new JSONObject();
      requestBody.put("email", "test@email.com");
      requestBody.put("password", "password");
      requestBody.put("name", "Test Name");
      HttpURLConnection client = getConnection("/user/register", "POST");
      writeConnection(client.getOutputStream(), requestBody);
      client.connect();
      int rCode = client.getResponseCode();
      JSONObject res = getInputStreamAndReadConnection(rCode, client);
      assertEquals(HttpURLConnection.HTTP_OK, rCode);
      assertEquals("OK", res.get("status"));
      client.disconnect();
   }

   @Test
   public void Register400() throws JSONException, IOException {
      JSONObject requestBody = new JSONObject();
      requestBody.put("email", "test@email.com");
      requestBody.put("password", "password");
      requestBody.put("noname", "Test Name");
      HttpURLConnection client = getConnection("/user/register", "POST");
      writeConnection(client.getOutputStream(), requestBody);
      client.connect();
      int rCode = client.getResponseCode();
      JSONObject res = getInputStreamAndReadConnection(rCode, client);
      assertEquals(HttpURLConnection.HTTP_BAD_REQUEST, rCode);
      assertEquals("BAD REQUEST", res.get("status"));
      client.disconnect();
   }

   @Test
   public void Login200() throws SQLException, JSONException, IOException {
      AddTestUser("test", "test@email.com", "pass");

      JSONObject requestBody = new JSONObject();
      requestBody.put("email", "test@email.com");
      requestBody.put("password", "pass");
      HttpURLConnection client = getConnection("/user/login", "POST");
      writeConnection(client.getOutputStream(), requestBody);
      client.connect();
      int rCode = client.getResponseCode();
      JSONObject res = getInputStreamAndReadConnection(rCode, client);
      assertEquals(HttpURLConnection.HTTP_OK, rCode);
      assertEquals("OK", res.get("status"));
      client.disconnect();
   }

   @Test
   public void Login400() throws SQLException, IOException, JSONException {
      AddTestUser("test", "test@email.com", "pass");

      JSONObject requestBody = new JSONObject();
      requestBody.put("email", "test@email.com");
      requestBody.put("password", "wrong pass");
      HttpURLConnection client = getConnection("/user/login", "POST");
      writeConnection(client.getOutputStream(), requestBody);
      client.connect();
      int rCode = client.getResponseCode();
      JSONObject res = getInputStreamAndReadConnection(rCode, client);
      assertEquals(HttpURLConnection.HTTP_BAD_REQUEST, rCode);
      assertEquals("BAD REQUEST", res.get("status"));
      client.disconnect();
   }
}
