package ca.utoronto.utm.mcs;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.neo4j.driver.*;

public class Utils {
   public static String uriDb = "bolt://neo4j:7687";
   public static Driver driver = GraphDatabase.driver(uriDb, AuthTokens.basic("neo4j", "123456"));

   public static String convert(InputStream inputStream) throws IOException {

      try (BufferedReader br = new BufferedReader(new InputStreamReader(inputStream))) {
         return br.lines().collect(Collectors.joining(System.lineSeparator()));
      }
   }

   public static void DeleteDB() {
      Session session = Utils.driver.session();
      session.writeTransaction(tx -> {
         tx.run("MATCH (a)-[r]->() DELETE a, r");
         tx.run("MATCH (a) DELETE a;");
         return null;
      });
   }

   /**
    * returns the url parameters in a map
    * @param query
    * @return map
    */
   public static Map<String, String> queryToMap(String query){
      Map<String, String> result = new HashMap<String, String>();
      for (String param : query.split("&")) {
         String pair[] = param.split("=");
         if (pair.length>1) {
            result.put(pair[0], pair[1]);
         }else{
            result.put(pair[0], "");
         }
      }
      return result;
   }
}
