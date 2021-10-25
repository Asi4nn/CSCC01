package ca.utoronto.utm.mcs;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.neo4j.driver.AuthTokens;
import org.neo4j.driver.Driver;
import org.neo4j.driver.GraphDatabase;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class AppTest {

    private static Neo4jDAO dao;

    private HttpURLConnection getConnection(String endpoint, String method) throws IOException {
        URL url = new URL("http://localhost:8080" + endpoint);
        HttpURLConnection client = (HttpURLConnection) url.openConnection();
        client.setDoOutput(true);
        client.setRequestProperty("Accept", "application/json");
        client.setRequestProperty("Content-Type", "application/json");
        client.setRequestMethod(method);
        return client;
    }

    private void writeConnection(OutputStream out, JSONObject jsonObject) throws IOException {
        OutputStreamWriter outWriter = new OutputStreamWriter(out, StandardCharsets.UTF_8);
        outWriter.write(jsonObject.toString());
        outWriter.flush();
        outWriter.close();
        out.close();
    }

    private JSONObject readConnection(InputStream in) throws IOException, JSONException {
        BufferedReader bufRead = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8));
        StringBuilder response = new StringBuilder();
        String line;
        while ((line = bufRead.readLine()) != null){
            response.append(line.trim());
        }
        in.close();
        return new JSONObject(response.toString());
    }

    @BeforeAll
    static void setUp() {
        App.main(new String[0]);
        Driver driver = GraphDatabase.driver("bolt://localhost:7687/",
                AuthTokens.basic("neo4j", "1234"));
        dao = new Neo4jDAO(driver);
    }

    @BeforeEach
    private void setUpEach() {
        dao.deleteAll();
    }

    @Test
    public void addActor200() throws IOException, JSONException {
        JSONObject requestBody = new JSONObject();
        requestBody.put("actorId", "a1");
        requestBody.put("name", "Actor 1");
        HttpURLConnection client = getConnection("/api/v1/addActor", "PUT");
        writeConnection(client.getOutputStream(), requestBody);
        client.connect();
        assertEquals(HttpURLConnection.HTTP_OK, client.getResponseCode());
        client.disconnect();
    }

    @Test
    public void addActor400() throws IOException, JSONException {
        JSONObject requestBody = new JSONObject();
        requestBody.put("actorId", "a1");
        HttpURLConnection client = getConnection("/api/v1/addActor", "PUT");
        writeConnection(client.getOutputStream(), requestBody);
        client.connect();
        assertEquals(HttpURLConnection.HTTP_BAD_REQUEST, client.getResponseCode());
        client.disconnect();
    }


    @Test
    public void addMovie200() throws JSONException, IOException {
        JSONObject requestBody = new JSONObject();
        requestBody.put("movieId", "m1");
        requestBody.put("name", "Movie 1");
        HttpURLConnection client = getConnection("/api/v1/addMovie", "PUT");
        writeConnection(client.getOutputStream(), requestBody);
        client.connect();
        assertEquals(HttpURLConnection.HTTP_OK, client.getResponseCode());
        client.disconnect();
    }

    @Test
    public void addMovie400() throws JSONException, IOException {
        JSONObject requestBody = new JSONObject();
        requestBody.put("movieId", "m1");
        HttpURLConnection client = getConnection("/api/v1/addMovie", "PUT");
        writeConnection(client.getOutputStream(), requestBody);
        client.connect();
        assertEquals(HttpURLConnection.HTTP_BAD_REQUEST, client.getResponseCode());
        client.disconnect();
    }

    @Test
    public void addRelationship200() throws JSONException, IOException {
        // populate database
        dao.addActor("a1", "Actor 1");
        dao.addMovie("m1", "Movie 1");

        JSONObject requestBody = new JSONObject();
        requestBody.put("movieId", "m1");
        requestBody.put("actorId", "a1");
        HttpURLConnection client = getConnection("/api/v1/addRelationship", "PUT");
        writeConnection(client.getOutputStream(), requestBody);
        client.connect();
        assertEquals(HttpURLConnection.HTTP_OK, client.getResponseCode());
        client.disconnect();
    }

    @Test
    public void addRelationship400() throws JSONException, IOException {
        JSONObject requestBody = new JSONObject();
        requestBody.put("movieId", "m1");
        HttpURLConnection client = getConnection("/api/v1/addRelationship", "PUT");
        writeConnection(client.getOutputStream(), requestBody);
        client.connect();
        assertEquals(HttpURLConnection.HTTP_BAD_REQUEST, client.getResponseCode());
        client.disconnect();
    }

    @Test
    public void getActor200() throws IOException, JSONException {
        // populate database
        dao.addActor("a1", "Actor 1"); // can replace with add request if needed.
        dao.addMovie("m1", "Movie 1");
        dao.addRelationship("a1", "m1");
        JSONObject requestBody = new JSONObject();
        requestBody.put("actorId", "a1");
        HttpURLConnection client = getConnection("/api/v1/getActor", "POST");
        writeConnection(client.getOutputStream(), requestBody);
        JSONObject response = readConnection(client.getInputStream());
        int responseCode = client.getResponseCode();
        client.disconnect();

        // check response
        String movies0 = response.getJSONArray("movies").getString(0);
        assertEquals(response.getString("name"), "Actor 1");
        assertEquals(movies0, "m1");
        assertEquals(HttpURLConnection.HTTP_OK, responseCode);
    }

    @Test
    public void getActor400() throws IOException, JSONException {
        // populate database
        dao.addActor("a1", "Actor 1"); // can replace with add request if needed.
        dao.addMovie("m1", "Movie 1");
        dao.addRelationship("a1", "m1");
        JSONObject requestBody = new JSONObject();
        requestBody.put("notActorId", "a1");
        HttpURLConnection client = getConnection("/api/v1/getActor", "POST");
        writeConnection(client.getOutputStream(), requestBody);

        int responseCode = client.getResponseCode();
        client.disconnect();

        // check response
        assertEquals(HttpURLConnection.HTTP_BAD_REQUEST, responseCode);
    }

    @Test
    public void hasRelationship200() throws IOException, JSONException {
        // populate database
        dao.addActor("a1", "Actor 1");
        dao.addMovie("m1", "Movie 1");
        dao.addRelationship("a1", "m1");

        JSONObject requestBody = new JSONObject();
        requestBody.put("actorId", "a1");
        requestBody.put("movieId", "m1");
        HttpURLConnection client = getConnection("/api/v1/hasRelationship", "POST");
        writeConnection(client.getOutputStream(), requestBody);
        JSONObject response = readConnection(client.getInputStream());
        int responseCode = client.getResponseCode();
        client.disconnect();

        // check response
        assertEquals("a1", response.getString("actorId"));
        assertEquals("m1", response.getString("movieId"));
        assertTrue(response.getBoolean("hasRelationship"));
        assertEquals(HttpURLConnection.HTTP_OK, responseCode);
    }

    @Test
    public void hasRelationship400() throws IOException, JSONException {
        // populate database
        dao.addActor("a1", "Actor 1");
        dao.addMovie("m1", "Movie 1");
        dao.addRelationship("a1", "m1");

        JSONObject requestBody = new JSONObject();
        requestBody.put("actorId", "a1");
        HttpURLConnection client = getConnection("/api/v1/hasRelationship", "POST");
        writeConnection(client.getOutputStream(), requestBody);

        int responseCode = client.getResponseCode();
        client.disconnect();

        // check response
        assertEquals(HttpURLConnection.HTTP_BAD_REQUEST, responseCode);
    }

    @Test
    public void computeBaconNumber200() throws IOException, JSONException {
        // populate database
        dao.addActor("a1", "Actor 1");
        dao.addMovie("m1", "Movie 1");
        dao.addActor("nm0000102", "Kevin Bacon");
        dao.addRelationship("a1", "m1");
        dao.addRelationship("nm0000102", "m1");

        JSONObject requestBody = new JSONObject();
        requestBody.put("actorId", "a1");
        HttpURLConnection client = getConnection("/api/v1/computeBaconNumber", "POST");
        writeConnection(client.getOutputStream(), requestBody);
        JSONObject response = readConnection(client.getInputStream());
        int responseCode = client.getResponseCode();
        client.disconnect();

        // check response
        assertEquals(1, response.getInt("baconNumber"));
        assertEquals(HttpURLConnection.HTTP_OK, responseCode);
    }

    @Test
    public void computeBaconNumber400() throws IOException, JSONException {
        // populate database
        dao.addActor("a1", "Actor 1");
        dao.addMovie("m1", "Movie 1");
        dao.addActor("nm0000102", "Kevin Bacon");
        dao.addRelationship("a1", "m1");
        dao.addRelationship("nm0000102", "m1");

        JSONObject requestBody = new JSONObject();
        requestBody.put("notActorId", "a1");
        HttpURLConnection client = getConnection("/api/v1/computeBaconNumber", "POST");
        writeConnection(client.getOutputStream(), requestBody);

        int responseCode = client.getResponseCode();
        client.disconnect();

        // check response
        assertEquals(HttpURLConnection.HTTP_BAD_REQUEST, responseCode);
    }

    @Test
    public void computeBaconNumber404() throws IOException, JSONException {
        // populate database
        dao.addActor("a1", "Actor 1");
        dao.addMovie("m1", "Movie 1");
        dao.addActor("nm0000102", "Kevin Bacon");
        dao.addRelationship("a1", "m1");

        JSONObject requestBody = new JSONObject();
        requestBody.put("actorId", "a1");
        HttpURLConnection client = getConnection("/api/v1/computeBaconPath", "POST");
        writeConnection(client.getOutputStream(), requestBody);

        int responseCode = client.getResponseCode();
        client.disconnect();

        // check response
        assertEquals(HttpURLConnection.HTTP_NOT_FOUND, responseCode);
    }

    @Test
    public void computeBaconPath200() throws IOException, JSONException {
        // populate database
        dao.addActor("a1", "Actor 1");
        dao.addMovie("m1", "Movie 1");
        dao.addActor("nm0000102", "Kevin Bacon");
        dao.addRelationship("a1", "m1");
        dao.addRelationship("nm0000102", "m1");

        JSONObject requestBody = new JSONObject();
        requestBody.put("actorId", "a1");
        HttpURLConnection client = getConnection("/api/v1/computeBaconPath", "POST");
        writeConnection(client.getOutputStream(), requestBody);
        JSONObject response = readConnection(client.getInputStream());
        int responseCode = client.getResponseCode();
        client.disconnect();

        JSONArray path = response.getJSONArray("baconPath");
        JSONArray correctPath = new JSONArray();
        correctPath.put("a1");
        correctPath.put("m1");
        correctPath.put("nm0000102");
        // check response
        for (int i = 0; i < correctPath.length(); i++) {
            assertEquals(correctPath.getString(i), path.getString(i));
        }
        assertEquals(responseCode, HttpURLConnection.HTTP_OK);
    }

    @Test
    public void computeBaconPath400() throws IOException, JSONException {
        // populate database
        dao.addActor("a1", "Actor 1");
        dao.addMovie("m1", "Movie 1");
        dao.addActor("nm0000102", "Kevin Bacon");
        dao.addRelationship("a1", "m1");
        dao.addRelationship("nm0000102", "m1");

        JSONObject requestBody = new JSONObject();
        requestBody.put("notActorId", "a1");
        HttpURLConnection client = getConnection("/api/v1/computeBaconPath", "POST");
        writeConnection(client.getOutputStream(), requestBody);

        int responseCode = client.getResponseCode();
        client.disconnect();

        // check response
        assertEquals(HttpURLConnection.HTTP_BAD_REQUEST, responseCode);
    }

    @Test
    public void computeBaconPath404() throws IOException, JSONException {
        // populate database
        dao.addActor("a1", "Actor 1");
        dao.addMovie("m1", "Movie 1");
        dao.addActor("nm0000102", "Kevin Bacon");
        dao.addRelationship("a1", "m1");

        JSONObject requestBody = new JSONObject();
        requestBody.put("actorId", "a1");
        HttpURLConnection client = getConnection("/api/v1/computeBaconPath", "POST");
        writeConnection(client.getOutputStream(), requestBody);

        int responseCode = client.getResponseCode();
        client.disconnect();

        // check response
        assertEquals(HttpURLConnection.HTTP_NOT_FOUND, responseCode);
    }

}
