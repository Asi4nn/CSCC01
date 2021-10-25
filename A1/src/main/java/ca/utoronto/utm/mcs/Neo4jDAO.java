package ca.utoronto.utm.mcs;

import org.json.JSONArray;
import org.neo4j.driver.Record;
import org.neo4j.driver.*;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;

import static org.neo4j.driver.Values.parameters;

// All your database transactions or queries should
// go in this class
public class Neo4jDAO {

    private final Driver driver;

    /**
     * Constructs the Neo4jDAO
     * @param driver The driver for the database.
     */
    @Inject
    public Neo4jDAO(Driver driver)
    {
        this.driver = driver;
    }

    /**
     * Adds the actor to the database.
     * @param actorId The actor's id.
     * @param name The name of the actor.
     */
    public void addActor(String actorId, String name){
        Session session = driver.session();
        session.writeTransaction((TransactionWork<String>) tx -> {
            tx.run("CREATE (a: Actor{actorId:$actorId,name:$name})", parameters("actorId",
                    actorId, "name", name));
            return null;
        });
    }

    /**
     * Adds the movie to the database.
     * @param movieId The movie id.
     * @param name The name of the movie.
     */
    public void addMovie(String movieId, String name){
        Session session = driver.session();
        session.writeTransaction((TransactionWork<String>) tx -> {
            tx.run("CREATE (m: Movie{movieId:$movieId,name:$name})", parameters("movieId",
                    movieId, "name", name));
            return null;
        });
    }

    /**
     * Adds a ACTED_IN relationship between the actor and movie.
     * @param actorId The actor's actorId who acted in the movie.
     * @param movieId The movie in question.
     */
    public void addRelationship(String actorId, String movieId){
        Session session = driver.session();
        session.writeTransaction((TransactionWork<String>) tx -> {
            String matchQuery = "MATCH (a: Actor{actorId:$actorId}), (m: Movie{movieId:$movieId}) ";
            String createQuery = "CREATE (a)-[:ACTED_IN]->(m)";
            tx.run(matchQuery + createQuery, parameters("actorId",
                    actorId, "movieId", movieId));
            return null;
        });
    }

    /**
     * Returns the actor's name.
     * @param actorId The actor's actorId.
     * @return The actor's name.
     */
    public String getActorName(String actorId) {
        Session session = driver.session();
        return session.readTransaction(tx -> {
            Result result = tx.run("MATCH (a: Actor{actorId:$actorId}) " +
                            "RETURN a.name",
                    parameters("actorId", actorId));
            return result.single().get(0).asString();
        });
    }

    /**
     * Returns whether the actor exists or not.
     * @param actorId The actor's actorId.
     * @return True if it exists.
     */
    public boolean existActor(String actorId){
        Session session = driver.session();
        return session.readTransaction(tx -> {
            Result result = tx.run("MATCH (a: Actor{actorId:$actorId}) " +
                            "RETURN a.name",
                    parameters("actorId", actorId));
            return result.list().size() > 0;
        });
    }

    /**
     * Returns whether the movie exists or not.
     * @param movieId The movie's movieId.
     * @return True if it exists.
     */
    public boolean existMovie(String movieId){
        Session session = driver.session();
        return session.readTransaction(tx -> {
            Result result = tx.run("MATCH (a: Movie{movieId:$movieId}) " +
                            "RETURN a.name",
                    parameters("movieId", movieId));
            return result.list().size() > 0;
        });
    }

    /**
     * Returns a list of movieIds that the actor took part in.
     * @param actorId The actor's actorId
     * @return List of movieIds.
     */
    public List<String> getActorMovieIds(String actorId) {
        Session session = driver.session();
        return session.readTransaction(tx -> {

            // preform query
            Result result = tx.run("MATCH (a: Actor{actorId:$actorId}), (m: Movie) " +
                            "WHERE EXISTS((a)-[:ACTED_IN]->(m)) " +
                            "RETURN m.movieId",
                    parameters("actorId", actorId));

            // get list of movies
            List<Record> resultList = result.list();
            List<String> movieIds = new ArrayList<>();
            for (Record record : resultList) {
                movieIds.add(record.get("m.movieId").asString());
            }
            return movieIds;
        });
    }

    /**
     * Returns a boolean as to whether they acted in the movie.
     * @param actorId The actor's id.
     * @param movieId The movie's id.
     * @return boolean of whether they acted in the movie or not.
     */
    public boolean hasRelationship(String actorId, String movieId){
        Session session = driver.session();
        return session.readTransaction(tx -> {
            Result result = tx.run("MATCH (a: Actor{actorId:$actorId}), (m: Movie{movieId:$movieId}) " +
                            "RETURN EXISTS((a)-[:ACTED_IN]->(m))",
                    parameters("actorId", actorId, "movieId", movieId));
            return result.single().get(0).asBoolean();
        });
    }

    /**
     * Remove everything in the database.
     */
    public void deleteAll(){
        Session session = driver.session();
        session.writeTransaction(tx -> {
            tx.run("MATCH (a)-[r]->() DELETE a, r");
            tx.run("MATCH (a) DELETE a;");
            return null;
        });
    }

    /**
     * Gets the shortest path of nodes from the given actorId to Kevin Bacon
     * Note: Kevin Bacon's actorId is always "nm0000102"
     * @param actorId The starting actor's id.
     * @return JSONArray Ordered list of actors/movie ids from actorId's node to Kevin Bacon
     */
    public JSONArray shortestPath(String actorId) {
        JSONArray path;
        Session session = driver.session();
        path = session.readTransaction(tx -> {
            Result result = tx.run(
                    "MATCH (a:Actor {actorId: $actorId}), (KevinB:Actor {actorId: 'nm0000102'}),\n" +
                    "p = shortestPath((a)-[ACTED_IN*]-(KevinB))\n" +
                    "WHERE length(p) > 1\n" +
                    "WITH reduce(output = [], n IN nodes(p) | output + n ) as nodeCollection\n" +
                    "UNWIND nodeCollection as client\n" +
                    "RETURN distinct client",

                    parameters("actorId", actorId)
                );
            List<Record> resultList = result.list();
            JSONArray nodes = new JSONArray();
            for (int i = 1; i <= resultList.size(); i++) {
                if (i % 2 == 1) {
                    nodes.put(resultList.get(i - 1).get(0).get("actorId").asString());
                }
                else {
                    nodes.put(resultList.get(i - 1).get(0).get("movieId").asString());
                }
            }
            return nodes;
        });
        return path;
    }
}
