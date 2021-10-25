package ca.utoronto.utm.mcs;

import com.mongodb.ConnectionString;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.sun.net.httpserver.HttpExchange;
import org.bson.Document;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

public class Utils {
   public static final String APIGateway = "http://apigateway:8000";

   public static MongoClient client;
   public static MongoDatabase db;
   public static MongoCollection<Document> collection;

   public static HttpClient httpclient;

   public static void connectToMongo() {
      client = MongoClients.create(new ConnectionString("mongodb://root:123456@mongodb/"));
      db = client.getDatabase("trip");
      if (!collectionExists("trips")) {
         db.createCollection("trips");
      }
      collection = db.getCollection("trips");
   }

   public static void recreateCollection() {
      collection.drop();
      db.createCollection("trips");
      collection = db.getCollection("trips");
   }

   public static boolean collectionExists(final String collectionName) {
      for (String name : db.listCollectionNames()) {
         if (name.equalsIgnoreCase("trips")) {
            return true;
         }
      }
      return false;
   }

   public static void disconnectFromMongo() {
      client.close();
   }

   public static String convert(InputStream inputStream) throws IOException {

      try (BufferedReader br = new BufferedReader(new InputStreamReader(inputStream))) {
         return br.lines().collect(Collectors.joining(System.lineSeparator()));
      }
   }

   public static boolean isNumeric(String str) {
      try {
         Double.parseDouble(str);
         return true;
      } catch (NumberFormatException e) {
         return false;
      }
   }

   /**
    * Returns the JSONBody.
    * @param inputStream Input stream from HttpExchange
    * @return JSONObject containing the request body.
    */
   public static JSONObject handleRequest(InputStream inputStream) throws IOException, JSONException {
      // converts into JSON
      return new JSONObject(convert(inputStream));
   }

   /**
    * Writes response to output.
    * @param outJSON response body as a JSON object
    * @param exchange HttpExchange object to make the connection
    * @param rCode Response code (200/400/404/500)
    */
   public static void handleResponse(JSONObject outJSON, HttpExchange exchange, int rCode) throws IOException {
      // saves code to output stream
      OutputStream outputStream = exchange.getResponseBody();
      exchange.sendResponseHeaders(rCode, outJSON.toString().getBytes().length);
      outputStream.write(outJSON.toString().getBytes());

      // close filereaders
      outputStream.flush();
      outputStream.close();
   }

   public static JSONObject SendNoBodyRequest(String url, String method) throws IOException, JSONException {
      HttpURLConnection client = getConnection(url, method);
      JSONObject res = readConnection(client.getInputStream());
      return res;
   }

   public static HttpURLConnection getConnection(String endpoint, String method) throws IOException {
      URL url = new URL(endpoint);
      HttpURLConnection client = (HttpURLConnection) url.openConnection();
      client.setDoOutput(true);
      client.setRequestProperty("Accept", "application/json");
      client.setRequestProperty("Content-Type", "application/json");
      client.setRequestMethod(method);
      return client;
   }

   public static void writeConnection(OutputStream out, JSONObject jsonObject) throws IOException {
      OutputStreamWriter outWriter = new OutputStreamWriter(out, StandardCharsets.UTF_8);
      outWriter.write(jsonObject.toString());
      outWriter.flush();
      outWriter.close();
      out.close();
   }

   public static JSONObject readConnection(InputStream in) throws IOException, JSONException {
      BufferedReader bufRead = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8));
      StringBuilder response = new StringBuilder();
      String line;
      while ((line = bufRead.readLine()) != null){
         response.append(line.trim());
      }
      in.close();
      return new JSONObject(response.toString());
   }

   public static JSONObject SendRequestHttpURLConnection(JSONObject json, String method, String uri, boolean hasBody) throws IOException, JSONException {
      HttpURLConnection client = getConnection("http://apigateway:8000" + uri, method);
      if (hasBody) {
         writeConnection(client.getOutputStream(), json);
      }
      client.connect();
      int rCode = client.getResponseCode();
      InputStream stream;
      if (100 <= rCode && rCode <= 399) {
         stream = client.getInputStream();
      } else {
         stream = client.getErrorStream();
      }
      JSONObject res = readConnection(stream);

      client.disconnect();
      return res;
   }

   public static JSONObject SendRequestHttpClient(JSONObject json, String method, String uri, boolean hasBody) throws IOException, JSONException, InterruptedException {
      httpclient = HttpClient.newHttpClient();
      HttpRequest.Builder builder = HttpRequest.newBuilder()
              .uri(URI.create("http://apigateway:8000" + uri))
              .header("Accept", "application/json");
      if (hasBody) {
         builder.method(method, HttpRequest.BodyPublishers.ofString(json.toString()));
      }
      else {
         builder.method(method, HttpRequest.BodyPublishers.noBody());
      }

      HttpRequest request = builder.build();
      HttpResponse<String> res = httpclient.send(request, HttpResponse.BodyHandlers.ofString());

      return new JSONObject(res.body());
   }
}
