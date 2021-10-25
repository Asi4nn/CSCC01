package ca.utoronto.utm.mcs;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.OutputStream;

public class deleteDb implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        Utils.DeleteDB();
        JSONObject res = new JSONObject();
        try {
            res.put("status", "OK");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        handleResponse(res, exchange, 200);
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
