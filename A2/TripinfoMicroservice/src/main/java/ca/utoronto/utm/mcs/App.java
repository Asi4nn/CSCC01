package ca.utoronto.utm.mcs;

import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;

public class App {
   static int PORT = 8000;

   public static void main(String[] args) throws IOException {
      HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", PORT), 0);
      server.createContext("/trip/request", new request());
      server.createContext("/trip/confirm", new confirm());
      server.createContext("/trip/", new id());
      server.createContext("/trip/passenger/", new passenger());
      server.createContext("/trip/driver/", new driver());
      server.createContext("/trip/driverTime/", new driverTime());

      server.start();
      System.out.printf("Server started on port %d...\n", PORT);
   }
}
