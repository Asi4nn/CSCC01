package ca.utoronto.utm.mcs;

public class App
{
    static int port = 8080;

    public static void main(String[] args)
    {
        // start server up
        ServerComponent serverComponent = DaggerServerComponent.create();
        Server server = serverComponent.buildServer();
        server.start();
    	System.out.printf("Server started on port %d\n", port);
    }
}
