package ca.utoronto.utm.mcs;

import com.mongodb.client.model.Filters;
import com.mongodb.client.model.UpdateOptions;
import com.mongodb.client.model.Updates;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Date;

public class id implements HttpHandler {
    public id() {
        Utils.connectToMongo();
    }

    @Override
    public void handle(HttpExchange r) throws IOException {
        try {
            if (r.getRequestMethod().equals("PATCH")) {
                handlePATCH(r);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            Utils.disconnectFromMongo();
        }
    }

    private void handlePATCH(HttpExchange r) throws JSONException, IOException {
        JSONObject request = Utils.handleRequest(r.getRequestBody());
        String requestURI = r.getRequestURI().toString();
        String[] uriSplitter = requestURI.split("/");
        JSONObject res = new JSONObject();
        if (uriSplitter.length < 3) {
            res.put("status", "BAD REQUEST");
            Utils.handleResponse(res, r, 400);
            return;
        }

        try {
            ObjectId id = new ObjectId(uriSplitter[2]);

            Bson updates = Updates.combine(
                    Updates.set("distance", res.getDouble("distance")),
                    Updates.addToSet("endTime", res.getLong("endTime")),
                    Updates.addToSet("totalCost", res.getDouble("totalCost")),
                    Updates.addToSet("timeElapsed", res.getString("timeElapsed")),
                    Updates.addToSet("discount", res.getDouble("discount")),
                    Updates.addToSet("driverPayout", res.getDouble("driverPayout")));
            UpdateOptions options = new UpdateOptions().upsert(true);

            Utils.collection.updateOne(Filters.eq("_id", id), updates, options);

            res.put("status", "OK");
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
