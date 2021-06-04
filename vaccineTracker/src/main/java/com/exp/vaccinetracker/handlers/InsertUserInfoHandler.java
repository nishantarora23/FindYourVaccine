package com.exp.vaccinetracker.handlers;

import com.exp.vaccinetracker.utils.CommonUtils;
import com.exp.vaccinetracker.utils.DatabaseOperations;

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;

public class InsertUserInfoHandler {
	public static void handle(RoutingContext routingContext) {
		Vertx vertx = routingContext.vertx();
		JsonObject config = vertx.getOrCreateContext().config();
		JsonObject body = routingContext.getBodyAsJson();
		if (body != null) {
			System.out.println(body.toString());
			System.out.println("Inside InsertUserInfo");
			DatabaseOperations databaseOperations = vertx.getOrCreateContext().get("databaseOperations");
			databaseOperations.insert(config.getJsonObject("insertOptions"), body).setHandler(handler -> {
				if(handler.succeeded()) {
					CommonUtils.addCORSProps(routingContext.response()).end();
				} else {
					CommonUtils.addCORSProps(routingContext.response()).setStatusCode(500).end();
				}
			});
		} else {
			CommonUtils.addCORSProps(routingContext.response()).setStatusCode(400).end();
		}
		
	}
}
