package ca.utoronto.utm.mcs;

import com.sun.net.httpserver.HttpExchange;
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
   public static HttpClient client = HttpClient.newHttpClient();

   public static String convert(InputStream inputStream) throws IOException {

      try (BufferedReader br = new BufferedReader(new InputStreamReader(inputStream))) {
         return br.lines().collect(Collectors.joining(System.lineSeparator()));
      }
   }

   public static void SendAndHandleRequest(HttpExchange exchange, String method, String url, boolean hasBody) throws IOException, JSONException {
      JSONObject requestBody = handleRequest(exchange.getRequestBody());
      System.out.println("APIGateway sending: " + requestBody + " to: " + url);
      HttpURLConnection client = getConnection(url, method);
      if (hasBody) {
         writeConnection(client.getOutputStream(), requestBody);
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
      System.out.println("APIGateway returning: " + res);
      handleResponse(res, exchange, rCode);
   }

   public static void SendAndHandleRequestHttpClient(HttpExchange exchange, String method, String url, boolean hasBody) throws IOException, JSONException, InterruptedException {
      JSONObject requestBody = handleRequest(exchange.getRequestBody());
      System.out.println("APIGateway sending: " + requestBody + " to: " + url);
      HttpRequest.Builder builder = HttpRequest.newBuilder()
              .uri(URI.create(url))
              .header("Accept", "application/json");
      if (hasBody) {
         System.out.println(method + " body: " + requestBody);
         builder.method(method, HttpRequest.BodyPublishers.ofString(requestBody.toString()));
      }
      else {
         builder.method(method, HttpRequest.BodyPublishers.noBody());
      }

      HttpRequest request = builder.build();
      HttpResponse<String> res = client.send(request, HttpResponse.BodyHandlers.ofString());
      System.out.println("APIGateway returning: " + res.body());
      handleResponse(new JSONObject(res.body()), exchange, res.statusCode());
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
}
