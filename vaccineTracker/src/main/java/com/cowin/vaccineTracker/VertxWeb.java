package com.cowin.vaccineTracker;

import io.vertx.core.Vertx;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.ext.web.Route;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;

public class VertxWeb {
	public static void main(String[] args) {
	
		
		Vertx vertx = Vertx.vertx();
		HttpServer server = vertx.createHttpServer();

		Router router = Router.router(vertx);
		
		//TO restrict to one kind of method
		//Router router1 = (Router) Router.router(vertx).route().method(HttpMethod.GET);

		router.get("/states")
							.handler(routingContext -> {

			HttpServerResponse response = routingContext.response();
			response.putHeader("content-type", "text/plain");
			response.write("Hello");
			response.end();
		});
		
		// to take param from request path
		router.get("/states/:id")
		.handler(routingContext -> {

			String id = routingContext.request().getParam("id");
			HttpServerResponse response = routingContext.response();
			response.putHeader("content-type", "text/plain");
			response.write("This is for "+ id +"\n");
			response.end();
		});
		
		
		//how to consume json
		router.post("/findByDistrict")
		.consumes("*/json")
		.handler(routingContext -> {
		HttpServerResponse response = routingContext.response();
			response.putHeader("content-type", "text/plain");
			response.write("This is for testing json");
			response.end();
		});

		server.requestHandler(router).listen(8889);
		
	}
}

