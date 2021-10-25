package ca.utoronto.utm.mcs;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.inject.Inject;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

import static ca.utoronto.utm.mcs.Utils.convert;

public class ReqHandler implements HttpHandler {

    private Neo4jDAO dao;

    /**
     * Constructor for ReqHandler. Retrieves database.
     * @param dao Neo4jDAO
     */
    @Inject
    public ReqHandler (Neo4jDAO dao) {
        this.dao = dao;
    }

    /**
     * Constructor for ReqHandler. Retrieves database.
     * @param exchange HttpExchange that has the URI and code
     */
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String uri = exchange.getRequestURI().toString();
        JSONObject response = new JSONObject();
        int rCode = 500;

        // get response
        try {
            JSONObject request = handleRequest(exchange.getRequestBody());
            switch (uri) {
                case "/api/v1/getActor":
                    rCode = getActor(request, response);
                    break;
                case "/api/v1/hasRelationship":
                    rCode = hasRelationship(request, response);
                    break;
                case "/api/v1/computeBaconNumber":
                    rCode = computeBaconNumber(request, response);
                    break;
                case "/api/v1/computeBaconPath":
                    rCode = computeBaconPath(request, response);
                    break;
                case "/api/v1/addActor":
                    rCode = addActor(request);
                    break;
                case "/api/v1/addMovie":
                    rCode = addMovie(request);
                    break;
                case "/api/v1/addRelationship":
                    rCode = addRelationship(request);
                    break;
            }
            handleResponse(response, exchange, rCode);

        } catch (JSONException e) {
            e.printStackTrace();
            handleResponse(response, exchange, 400);
        } catch (Exception e) {
            e.printStackTrace();
            handleResponse(response, exchange, 500);
        }
    }

    /**
     * Given a actorId, finds the minimum number of movies required to traverse from the actor's node to Kevin Bacon
     * @param request   JSON request object
     * @param response  JSON response object to return to the client
     * @return Response code (200/400/404)
     */
    public int computeBaconNumber(JSONObject request, JSONObject response) throws JSONException {

        // check if invalid
        if (is400(request, "actorId")){
            return 400;
        }
        String actorId = request.getString("actorId");
        if (!dao.existActor("nm0000102") || !dao.existActor(actorId)){
            return 404;
        }

        // check if actor is kevin bacon
        if (request.getString("actorId").equals("nm0000102")) {
            response.put("baconNumber", "0");
            return 200;
        }

        // compute path
        JSONArray path = dao.shortestPath(request.getString("actorId"));

        // if path DNE
        if (path.length() == 0) {
            return 404;
        }

        // add to response
        response.put("baconNumber", (int)Math.floor((float)path.length() / 2));
        return 200;
    }

    /**
     * Given a actorId, finds the minimum number of nodes to traverse from the given actor to Kevin Bacon
     * @param request   JSON request object
     * @param response  JSON response object to return to the client
     * @return Response code (200/400/404)
     */
    public int computeBaconPath(JSONObject request, JSONObject response) throws JSONException {
        // check if invalid
        if (is400(request, "actorId")){
            return 400;
        }
        String actorId = request.getString("actorId");
        if (!dao.existActor("nm0000102") || !dao.existActor(actorId)){
            return 404;
        }

        // if path is kevin bacon -> kevin bacon
        if (request.getString("actorId").equals("nm0000102")) {
            JSONArray path = new JSONArray();
            path.put("nm0000102");
            response.put("baconPath", path);
            return 200;
        }

        // compute path
        JSONArray path = dao.shortestPath(request.getString("actorId"));

        // if no path exists
        if (path.length() == 0) {
            return 404;
        }

        // add bacon path to response
        response.put("baconPath", path);
        return 200;
    }

    /**
     * Adds the actor with the info inside json to the Neo4j db
     * @param json  JSON request object
     * @return Response code (200/400/404)
     */
    public int addActor(JSONObject json) throws JSONException{
        // check if invalid
        if (is400(json, "name") || is400(json, "actorId") ||
                dao.existActor(json.getString("actorId"))) {
            return 400;
        }

        // add to database
        String name = json.getString("name");
        String actorId = json.getString("actorId");
        dao.addActor(actorId, name);
        return 200;
    }

    /**
     * Adds the movie with the info inside json to the Neo4j db
     * @param json  JSON request object
     * @return Response code (200/400/404)
     */
    public int addMovie(JSONObject json) throws JSONException {
        // check if invalid
        if (is400(json, "name") || is400(json, "movieId") ||
                dao.existMovie(json.getString("movieId"))) {
            return 400;
        }

        // add to database
        String name = json.getString("name");
        String movieId = json.getString("movieId");
        dao.addMovie(movieId, name);
        return 200;
    }

    /**
     * Adds the relationship with the info inside json to the Neo4j db
     * @param json  JSON request object
     * @return Response code (200/400/404)
     */
    public int addRelationship(JSONObject json) throws JSONException {

        // check if invalid
        if (is400(json, "actorId") || is400(json, "movieId")) {
            return 400;
        }
        String actorId = json.getString("actorId");
        String movieId = json.getString("movieId");
        if (!dao.existActor(actorId) || !dao.existMovie(movieId)){
            return 404;
        }
        if (dao.hasRelationship(actorId, movieId)){
            return 400;
        }

        // add relationship
        dao.addRelationship(actorId, movieId);
        return 200;
    }

    /**
     * Saves the actor/movie ids and a boolean which determines if the actor has played in
     * the given movie.
     * @param request Request that contains the necessary parameters
     * @param response Response that will be used to save the information
     * @return Response code (200/400/404)
     */
    private int hasRelationship(JSONObject request, JSONObject response) throws JSONException {
        // check if request is invalid
        if (is400(request, "actorId") || is400(request, "movieId")) {
            return 400;
        }
        if (!dao.existActor(request.getString("actorId")) || !dao.existMovie(request.getString("movieId"))){
            return 404;
        }

        // check and add to response
        boolean hasRelationship = dao.hasRelationship(request.getString("actorId"),
                request.getString("movieId"));
        response.put("actorId", request.getString("actorId"));
        response.put("movieId", request.getString("movieId"));
        response.put("hasRelationship", hasRelationship);
        return 200;
    }

    /**
     * Saves the actor's name, id, and movies they acted in on the response.
     * @param request Request that contains the necessary parameters
     * @param response Response that will be used to save the information
     * @return Response code (200/400/404)
     */
    private int getActor(JSONObject request, JSONObject response) throws JSONException {
        // check if request is invalid
        if (is400(request, "actorId")) {
            return 400;
        }
        String actorId = request.getString("actorId");
        if (!dao.existActor(actorId)){
            return 404;
        }

        // add to response
        String name = dao.getActorName(actorId);
        List<String> movies = dao.getActorMovieIds(actorId);
        response.put("actorId", actorId);
        response.put("name", name);
        response.put("movies", movies);
        return 200;
    }

    /**
     * Returns whether the parameter exists in the JSON object and is not null.
     * @param request Request that contains the necessary parameters
     * @param property The property in the JSON object that we're testing
     * @return Response code (200/400/404)
     */
    private boolean is400(JSONObject request, String property) {
        try{
            // checks if it has the property
            boolean res = !request.has(property);
            String propString = request.getString(property);
            // check if the string isn't null
            res = res || propString == null;
            return res;
        } catch (JSONException e){
            return true; // parsing error
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