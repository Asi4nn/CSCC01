package ca.utoronto.utm.mcs;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.json.JSONException;
import org.json.JSONObject;
import org.neo4j.driver.Record;
import org.neo4j.driver.Result;
import org.neo4j.driver.Session;
import org.neo4j.driver.Value;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static ca.utoronto.utm.mcs.Utils.convert;
import static org.neo4j.driver.Values.parameters;

public class navigation implements HttpHandler {
    @Override
    public void handle(HttpExchange r) throws IOException {
        try {
            if (r.getRequestMethod().equals("GET")) {
                getNavigation(r);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void getNavigation(HttpExchange exchange) throws JSONException, IOException {
        JSONObject res = new JSONObject();

        String requestURI = exchange.getRequestURI().toString();
        String[] uriSplitter = requestURI.split("/");
        // if there are extra url params send 400 and return
        if (uriSplitter.length != 4) {
            res.put("status", "BAD REQUEST");
            handleResponse(res, exchange, 400);
            return;
        }
        String driverUid = uriSplitter[3];
        Map<String, String> params = Utils.queryToMap(exchange.getRequestURI().getQuery());
        String passengerUid = params.get("passengerUid");
        if (passengerUid == null) {
            res.put("status", "BAD REQUEST");
            handleResponse(res, exchange, 400);
            return;
        }

        try (Session session = Utils.driver.session()) {
            String query = "CALL gds.graph.create('myGraph', 'road', 'ROUTE_TO', {\n" +
                    "relationshipProperties: 'travel_time' })";

            Result result = session.run(query);
            if (result.hasNext()) {
                while (result.hasNext()) {
                    result.next();
                }
            }
            else {
                res.put("status", "INTERNAL SERVER ERROR");
                handleResponse(res, exchange, 500);
            }

            query = "MATCH (driver:user{uid: $x}), (passenger:user{uid: $y}), (d:road{name: driver.street_at}), (p:road{name: passenger.street_at})\n" +
                    "    WITH d AS driver, p AS passenger\n" +
                    "    CALL gds.shortestPath.dijkstra.stream('myGraph',\n" +
                    "    {\n" +
                    "        sourceNode: id(driver),\n" +
                    "        targetNode: id(passenger),\n" +
                    "        relationshipWeightProperty: 'travel_time'\n" +
                    "    })\n" +
                    "YIELD totalCost, nodeIds, costs, path\n" +
                    "RETURN totalCost, nodeIds, costs, nodes(path)";

            JSONObject data = new JSONObject();
            List<JSONObject> route = new ArrayList<>();
            result = session.run(query, parameters("x", driverUid, "y", passengerUid));
            if (result.hasNext()) {
                Record r = result.next();
                List<JSONObject> queryRoute = r.get("route").asList(JSONObject::new);
                List<Double> costs = r.get("costs").asList(Value::asDouble);
                Integer totalCost = r.get("totalCost").asInt();
                int i = 0;
                for (JSONObject queryRoad : queryRoute) {
                    JSONObject road = new JSONObject();
                    road.put("street", queryRoad.getJSONObject("properties").get("name"));
                    if (i > 0) {
                        road.put("time", costs.get(i) - costs.get(i-1));
                    }
                    else {
                        road.put("time", costs.get(i));
                    }
                    road.put("has_traffic", queryRoad.getJSONObject("properties").get("is_traffic"));
                    route.add(road);
                    i++;
                }
                data.put("route", route);
                data.put("total_time", totalCost);

                res.put("status", "OK");
                res.put("data", data);

                handleResponse(res, exchange, 200);
            }
            else {
                res.put("status", "INTERNAL SERVER ERROR");
                handleResponse(res, exchange, 500);
            }
        } catch (JSONException e) {
            res.put("status", "BAD REQUEST");
            handleResponse(res, exchange, 400);
        } catch (Exception e) {
            res.put("status", "INTERNAL SERVER ERROR");
            handleResponse(res, exchange, 500);
        }
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
