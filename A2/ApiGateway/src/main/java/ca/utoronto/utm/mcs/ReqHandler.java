package ca.utoronto.utm.mcs;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.http.HttpClient;
import java.nio.charset.StandardCharsets;

import static ca.utoronto.utm.mcs.Utils.convert;

public class ReqHandler implements HttpHandler {
    public static String location = "http://locationmicroservice:8000";
    public static String trip = "http://tripinfomicroservice:8000";
    public static String user = "http://usermicroservice:8000";

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String uri = exchange.getRequestURI().toString();
        JSONObject res = new JSONObject();
        try {
            switch (uri) {
                // UserMicroservice
                case "/user/register":
                    if (exchange.getRequestMethod().equals("POST")) {
                        Utils.SendAndHandleRequestHttpClient(exchange, "POST", user + "/user/register", true);
                    }
                    break;
                case "/user/login":
                    if (exchange.getRequestMethod().equals("POST")) {
                        Utils.SendAndHandleRequestHttpClient(exchange, "POST", user + "/user/login", true);
                    }
                    break;
                case "/user/":
                    if (exchange.getRequestMethod().equals("GET")) {
                        Utils.SendAndHandleRequestHttpClient(exchange, "GET", user + "/user", false);
                    }
                    else if (exchange.getRequestMethod().equals("PATCH")) {
                        Utils.SendAndHandleRequestHttpClient(exchange, "PATCH", user + "/user", true);
                    }
                    break;
                // LocationMicroservice
                case "/location/user":
                    if (exchange.getRequestMethod().equals("PUT")) {
                        Utils.SendAndHandleRequest(exchange, "PUT", location + exchange.getRequestURI(), true);
                    }
                    else if (exchange.getRequestMethod().equals("DELETE")) {
                        Utils.SendAndHandleRequest(exchange, "DELETE", location + exchange.getRequestURI(), true);
                    }
                    break;
                case "/location/nearbyDriver/":
                    if (exchange.getRequestMethod().equals("GET")) {
                        Utils.SendAndHandleRequest(exchange, "GET", location + exchange.getRequestURI() + "?" + exchange.getRequestURI().getQuery(), false);
                    }
                    break;
                case "/location/road":
                    if (exchange.getRequestMethod().equals("PUT")) {
                        Utils.SendAndHandleRequest(exchange, "PUT", location + exchange.getRequestURI(), true);
                    }
                    break;
                case "/location/hasRoute":
                    if (exchange.getRequestMethod().equals("POST")) {
                        Utils.SendAndHandleRequest(exchange, "POST", location + exchange.getRequestURI(), true);
                    }
                    break;
                case "/location/route":
                    if (exchange.getRequestMethod().equals("DELETE")) {
                        Utils.SendAndHandleRequest(exchange, "DELETE", location + exchange.getRequestURI(), true);
                    }
                    break;
                case "/location/navigation/":
                    if (exchange.getRequestMethod().equals("GET")) {
                        Utils.SendAndHandleRequest(exchange, "GET", location + exchange.getRequestURI() + "?" + exchange.getRequestURI().getQuery(), false);
                    }
                    break;
                case "/location/":
                    if (exchange.getRequestMethod().equals("GET")) {
                        Utils.SendAndHandleRequest(exchange, "GET", location + exchange.getRequestURI(), false);
                    }
                    else if (exchange.getRequestMethod().equals("PATCH")) {
                        Utils.SendAndHandleRequestHttpClient(exchange, "PATCH", location + exchange.getRequestURI(), true);
                    }
                    break;
                // TripInfoMicroservice
                case "/trip/request":
                    if (exchange.getRequestMethod().equals("POST")) {
                        Utils.SendAndHandleRequest(exchange, "POST", trip + exchange.getRequestURI(), true);
                    }
                    break;
                case "/trip/confirm":
                    if (exchange.getRequestMethod().equals("POST")) {
                        Utils.SendAndHandleRequest(exchange, "POST", trip + exchange.getRequestURI(), true);
                    }
                    break;
                case "/trip/passenger":
                    if (exchange.getRequestMethod().equals("GET")) {
                        Utils.SendAndHandleRequest(exchange, "GET", trip + exchange.getRequestURI(), false);
                    }
                    break;
                case "/trip/driver":
                    if (exchange.getRequestMethod().equals("GET")) {
                        Utils.SendAndHandleRequest(exchange, "GET", trip + exchange.getRequestURI(), false);
                    }
                    break;
                case "/trip/driverTime/":
                    if (exchange.getRequestMethod().equals("GET")) {
                        Utils.SendAndHandleRequest(exchange, "GET", trip + exchange.getRequestURI(), false);
                    }
                    break;
                case "/trip/":
                    if (exchange.getRequestMethod().equals("PATCH")) {
                        Utils.SendAndHandleRequestHttpClient(exchange, "PATCH", trip + exchange.getRequestURI(), true);
                    }
                    break;
            }
        } catch (JSONException | InterruptedException e) {
            e.printStackTrace();
            try {
                res.put("status", "INTERNAL SERVER ERROR");
            } catch (JSONException jsonException) {
                jsonException.printStackTrace();
            }
            handleResponse(res, exchange, 500);
        }
    }

    private HttpURLConnection getConnection(String endpoint, String method) throws IOException {
        URL url = new URL(endpoint);
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

    /**
     * Returns the JSONBody.
     * @param inputStream Input stream from HttpExchange
     * @return JSONObject containing the request body.
     */
    private JSONObject handleRequest(InputStream inputStream) throws IOException, JSONException {
        // converts into JSON
        return new JSONObject(convert(inputStream));
    }

    /**
     * Writes response to output.
     * @param outJSON response body as a JSON object
     * @param exchange HttpExchange object to make the connection
     * @param rCode Response code (200/400/404/500)
     */
    private void handleResponse(JSONObject outJSON, HttpExchange exchange, int rCode) throws IOException {
        // saves code to output stream
        OutputStream outputStream = exchange.getResponseBody();
        exchange.sendResponseHeaders(rCode, outJSON.toString().getBytes().length);
        outputStream.write(outJSON.toString().getBytes());

        // close filereaders
        outputStream.flush();
        outputStream.close();
    }
}
