package ca.utoronto.utm.mcs;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.bson.Document;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

public class request implements HttpHandler {
    public request() {
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
            JSONObject getRes = Utils.SendNoBodyRequest(Utils.APIGateway + "/location/nearbyDriver/" +
                    request.get("uid") + "?radius=" + request.get("radius"), "GET");

            List<Integer> drivers = new ArrayList<>();
            if (getRes.get("status").equals("OK")) {
                JSONObject driverRes = new JSONObject(getRes.get("data"));
                for (int i = 0; i < driverRes.length(); i++) {
                    drivers.add(Integer.parseInt(driverRes.get(String.valueOf(i)).toString()));
                }
                res.put("data", drivers);
                res.put("status", "OK");
                Utils.handleResponse(res, r, 200);
            } else {
                res.put("status", "NOT FOUND");
                Utils.handleResponse(res, r, 404);
            }
        } catch (JSONException e) {
            res.put("status", "BAD REQUEST");
            Utils.handleResponse(res, r, 400);
        } catch (Exception e) {
            res.put("status", "INTERNAL SERVER ERROR");
            Utils.handleResponse(res, r, 500);
        }


    }
}
