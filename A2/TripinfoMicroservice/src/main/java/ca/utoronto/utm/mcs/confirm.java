package ca.utoronto.utm.mcs;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Date;

public class confirm implements HttpHandler {
    public confirm() {
        Utils.connectToMongo();
    }

    @Override
    public void handle(HttpExchange r) throws IOException {
        try {
            if (r.getRequestMethod().equals("POST")) {
                handlePOST(r);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            Utils.disconnectFromMongo();
        }
    }

    private void handlePOST(HttpExchange r) throws JSONException, IOException {
        JSONObject request = Utils.handleRequest(r.getRequestBody());
        JSONObject res = new JSONObject();

        try {
            JSONObject driver = res.getJSONObject("driver");
            JSONObject passenger = res.getJSONObject("passenger");

            Document doc = new Document("_id", new ObjectId())
                    .append("driver", driver.get("uid"))
                    .append("passenger", passenger.get("uid"))
                    .append("startTime", res.getLong("startTime"));

            Utils.collection.insertOne(doc);

            res.put("status", "OK");
            res.put("data", doc);
            Utils.handleResponse(res, r, 200);
        } catch (JSONException e) {
            res.put("status", "BAD REQUEST");
            Utils.handleResponse(res, r, 400);
        } catch (Exception e) {
            res.put("status", "INTERNAL SERVER ERROR");
            Utils.handleResponse(res, r, 500);
        }
    }
}
