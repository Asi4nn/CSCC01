package ca.utoronto.utm.mcs;

import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Projections;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.bson.Document;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class driverTime implements HttpHandler {
    public driverTime() {
        Utils.connectToMongo();
    }

    @Override
    public void handle(HttpExchange r) throws IOException {
        try {
            if (r.getRequestMethod().equals("GET")) {
                handleGET(r);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            Utils.disconnectFromMongo();
        }
    }

    private void handleGET(HttpExchange r) throws IOException, JSONException {
        String requestURI = r.getRequestURI().toString();
        String[] uriSplitter = requestURI.split("/");
        JSONObject res = new JSONObject();
        if (uriSplitter.length < 4) {
            res.put("status", "BAD REQUEST");
            Utils.handleResponse(res, r, 400);
            return;
        }

        try {
            String id = uriSplitter[3];

            Document trip = Utils.collection.find(Filters.eq("_id", id)).first();

            String driverUid = trip.get("driver").toString();
            String passengerUid = trip.get("passenger").toString();

            JSONObject getRes = Utils.SendNoBodyRequest(Utils.APIGateway + "/location/navigation/" +
                    driverUid + "?passengerUid=" + passengerUid, "GET");
            JSONObject data = new JSONObject();

            if (getRes.get("status").equals("OK")) {
                data.put("arrival_time", getRes.getJSONObject("data").getInt("total_time"));

                res.put("data", data);
                res.put("status", "OK");
                Utils.handleResponse(res, r, 200);
            }
            else {
                res.put("status", "NOT FOUND");
                Utils.handleResponse(res, r, 404);
            }
        } catch (Exception e) {
            res.put("status", "INTERNAL SERVER ERROR");
            Utils.handleResponse(res, r, 500);
        }
    }
}
