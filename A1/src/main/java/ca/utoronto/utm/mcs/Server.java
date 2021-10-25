package ca.utoronto.utm.mcs;

import com.sun.net.httpserver.HttpContext;
import com.sun.net.httpserver.HttpServer;

import javax.inject.Inject;

public class Server {
    private HttpServer server;

    @Inject
    public Server(HttpServer server) {
        this.server = server;
    }

    /**
     * Initializes root server context and starts the server accepting requests
     */
    public void start() {
        ReqHandlerComponent handlerComponent = DaggerReqHandlerComponent.create();
        ReqHandler handler = handlerComponent.buildHandler();

        HttpContext context = server.createContext("/");
        context.setHandler(handler);
        server.start();
    }
}
