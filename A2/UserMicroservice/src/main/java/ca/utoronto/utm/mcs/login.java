package ca.utoronto.utm.mcs;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.sql.*;

import static ca.utoronto.utm.mcs.Utils.convert;

public class login implements HttpHandler {

    public Connection connection;

    public login() throws ClassNotFoundException, SQLException {
        String url = Utils.url;
        Class.forName("org.postgresql.Driver");
        this.connection = DriverManager.getConnection(url, "root", "123456");
    }

    @Override
    public void handle(HttpExchange exchange) {
        System.out.println("login");
        try {
            if (exchange.getRequestMethod().equals("POST")) {
                handlePOST(exchange);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void handlePOST(HttpExchange exchange) throws JSONException, IOException {
        JSONObject request = Utils.handleRequest(exchange.getRequestBody());
        JSONObject res = new JSONObject();
        try {
            ResultSet rs;
            String prepare = "SELECT * FROM Users WHERE email = ? AND password = ?";
            PreparedStatement ps = this.connection.prepareStatement(prepare);
            ps.setString(1, request.get("email").toString());
            ps.setString(2, request.get("password").toString());
            rs = ps.executeQuery();
            if (rs.next()) {
                res.put("status", "OK");
                Utils.handleResponse(res, exchange, 200);
            }
            else {
                res.put("status", "BAD REQUEST");
                Utils.handleResponse(res, exchange, 400);
            }
        } catch (JSONException e) {
            res.put("status", "BAD REQUEST");
            Utils.handleResponse(res, exchange, 400);
        } catch (SQLException e) {
            res.put("status", "INTERNAL SERVER ERROR");
            Utils.handleResponse(res, exchange, 500);
        }
    }
}
