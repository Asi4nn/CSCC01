package ca.utoronto.utm.mcs;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.json.JSONException;
import org.json.JSONObject;
import org.neo4j.driver.Record;
import org.neo4j.driver.Result;
import org.neo4j.driver.Session;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

import static org.neo4j.driver.Values.parameters;

public class driver implements HttpHandler {
    @Override
    public void handle(HttpExchange r) throws IOException {
        try {
            if (r.getRequestMethod().equals("GET")) {
                getDriver(r);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private void getDriver(HttpExchange exchange) throws IOException, JSONException {
        JSONObject res = new JSONObject();

        String requestURI = exchange.getRequestURI().toString();
        String[] uriSplitter = requestURI.split("/");
        // if there are extra url params send 400 and return
        if (uriSplitter.length != 3) {
            res.put("status", "BAD REQUEST");
            handleResponse(res, exchange, 400);
            return;
        }
        String uid = uriSplitter[2];
        Map<String, String> params = Utils.queryToMap(exchange.getRequestURI().getQuery());
        String radius = params.get("radius");

        String query = "MATCH (n:user {uid :$x}), (driver:user{is_driver: true})\n" +
                        "WITH driver AS driver, point({ latitude: n.latitude, longitude: n.longitude}) AS p1, point({ latitude: driver.latitude, longitude: driver.longitude}) AS p2\n" +
                        "WHERE distance(p1, p2)/1000 <= " + radius + "\n" +
                        "RETURN DISTINCT driver";
        try (Session session = Utils.driver.session()) {
            Result result = session.run(query, parameters("x", uid));

            JSONObject data = new JSONObject();
            if (result.hasNext()) {
                while (result.hasNext()) {
                    JSONObject driver = new JSONObject();
                    Record user = result.next();
                    Double longitude = user.get("driver.longitude").asDouble();
                    Double latitude = user.get("driver.latitude").asDouble();
                    String street = user.get("driver.street_at").asString();
                    driver.put("longitude", longitude);
                    driver.put("latitude", latitude);
                    driver.put("street", street);

                    data.put(user.get("uid").asString(), driver);
                }

                res.put("data", data);
                res.put("status", "OK");

                handleResponse(res, exchange, 200);
            }
            else {
                res.put("status", "NOT FOUND");
                handleResponse(res, exchange, 404);
            }
        } catch (Exception e) {
            res.put("status", "INTERNAL SERVER ERROR");
            handleResponse(res, exchange, 500);
        }
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
