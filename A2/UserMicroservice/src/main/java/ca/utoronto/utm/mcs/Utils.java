package ca.utoronto.utm.mcs;

import com.sun.net.httpserver.HttpExchange;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.util.stream.Collectors;

public class Utils {
   public static final String url = "jdbc:postgresql://postgres:5432/root";

   public static String convert(InputStream inputStream) throws IOException {

      try (BufferedReader br = new BufferedReader(new InputStreamReader(inputStream))) {
         return br.lines().collect(Collectors.joining(System.lineSeparator()));
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
}
