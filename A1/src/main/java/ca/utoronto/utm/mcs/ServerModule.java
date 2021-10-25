package ca.utoronto.utm.mcs;

import com.sun.net.httpserver.HttpServer;
import dagger.Module;
import dagger.Provides;

import java.io.IOException;
import java.net.InetSocketAddress;

@Module
public class ServerModule {

    @Provides
    InetSocketAddress provideInetSocketAddress() {
        return new InetSocketAddress("localhost", App.port);
    }

    @Provides
    Server provideServer(InetSocketAddress addr) {
        try {
            return new Server(HttpServer.create(addr, 5));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

}
