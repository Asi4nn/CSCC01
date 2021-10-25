package ca.utoronto.utm.mcs;

import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Projections;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class driver implements HttpHandler {
    public driver() {
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

    private void handleGET(HttpExchange r) throws JSONException, IOException {
        String requestURI = r.getRequestURI().toString();
        String[] uriSplitter = requestURI.split("/");
        JSONObject res = new JSONObject();
        if (uriSplitter.length < 4) {
            res.put("status", "BAD REQUEST");
            Utils.handleResponse(res, r, 400);
            return;
        }

        try {
            JSONObject data = new JSONObject();
            List<JSONObject> trips = new ArrayList<>();
            String uid = uriSplitter[3];

            List<Document> tripsList = Utils.collection.find(Filters.eq("driver", uid))
                    .projection(Projections.exclude("driver", "discount"))
                    .into(new ArrayList<>());
            if (tripsList.size() == 0) {
                res.put("status", "NOT FOUND");
                Utils.handleResponse(res, r, 404);
            }
            for (Document trip : tripsList) {
                trips.add(new JSONObject(trip.toJson()));
            }

            data.put("trips", trips);

            res.put("data", data);
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
