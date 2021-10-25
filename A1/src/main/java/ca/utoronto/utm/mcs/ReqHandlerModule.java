package ca.utoronto.utm.mcs;

import dagger.Module;
import dagger.Provides;
import org.neo4j.driver.AuthTokens;
import org.neo4j.driver.Driver;
import org.neo4j.driver.GraphDatabase;

@Module
public class ReqHandlerModule {

    @Provides
    Driver provideDriver() {
        return GraphDatabase.driver("bolt://localhost:7687/", AuthTokens.basic("neo4j", "1234"));
    }

    @Provides
    ReqHandler provideReqHandler(Driver driver) {
        return new ReqHandler(new Neo4jDAO(driver));
    }
}
