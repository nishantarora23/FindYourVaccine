package com.exp.vaccinetracker.handlers;

import com.exp.vaccinetracker.utils.CommonUtils;
import com.exp.vaccinetracker.utils.DatabaseOperations;

import io.vertx.core.MultiMap;
import io.vertx.core.Vertx;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;

public class ConfigurationHandler {
	
	public static void handle(RoutingContext routingContext) {
		Vertx vertx = routingContext.vertx();
		JsonObject config = vertx.getOrCreateContext().config();
		String configId = routingContext.pathParam("configId");
		DatabaseOperations databaseOperations = vertx.getOrCreateContext().get("databaseOperations");
		databaseOperations.getById(config.getJsonObject("configOptions"), configId).setHandler(result -> {
			if(result.succeeded()) {
				CommonUtils.addCORSProps(routingContext.response()).end(Json.encodePrettily(result.result()));
			} else {
				CommonUtils.addCORSProps(routingContext.response()).setStatusCode(500).end(result.cause().getMessage());
			}
		});
	}
	
	public static void getConfigByLang(RoutingContext routingContext) {
		Vertx vertx = routingContext.vertx();
		JsonObject config = vertx.getOrCreateContext().config();
		String configId = routingContext.pathParam("configId");
		MultiMap queryParams = routingContext.queryParams();
		String cLang = queryParams.get("cLang");
		String dLang = queryParams.get("dLang");
		DatabaseOperations databaseOperations = vertx.getOrCreateContext().get("databaseOperations");
		databaseOperations.getById(config.getJsonObject("configOptions"), configId+"_"+cLang.toUpperCase()).setHandler(result -> {
			if(result.succeeded()) {
				CommonUtils.addCORSProps(routingContext.response()).end(Json.encodePrettily(result.result()));
			} else {
				databaseOperations.getById(config.getJsonObject("configOptions"), configId+"_"+dLang.toUpperCase()).setHandler(dLangResult -> {
					if(dLangResult.succeeded()) {
						CommonUtils.addCORSProps(routingContext.response()).end(Json.encodePrettily(dLangResult.result()));
					} else {
						CommonUtils.addCORSProps(routingContext.response()).setStatusCode(500).end(Json.encodePrettily(dLangResult.cause().getMessage()));
					}
				});
			}
		});
	}
	
	public static void getConfigList(RoutingContext routingContext) {
		Vertx vertx = routingContext.vertx();
		JsonObject config = vertx.getOrCreateContext().config();
		String query = config.getJsonObject("configList").getString("query");
		DatabaseOperations databaseOperations = vertx.getOrCreateContext().get("databaseOperations");
		databaseOperations.getByQuery(query).setHandler(handler -> {
			if(handler.succeeded()) {
				CommonUtils.addCORSProps(routingContext.response()).end(Json.encodePrettily(handler.result()));
			}
		});
	}
	
	public static void getNavbar(RoutingContext routingContext) {
		Vertx vertx = routingContext.vertx();
		JsonObject config = vertx.getOrCreateContext().config();
		String configId = "NAVBAR";
		MultiMap queryParams = routingContext.queryParams();
		String cLang = queryParams.get("cLang");
		String dLang = queryParams.get("dLang");
		String role = queryParams.get("role");
		DatabaseOperations databaseOperations = vertx.getOrCreateContext().get("databaseOperations");
		databaseOperations.getById(config.getJsonObject("configOptions"), configId+"_"+cLang.toUpperCase()).setHandler(result -> {
			if(result.succeeded()) {
				if(role != null) {
					CommonUtils.addCORSProps(routingContext.response()).end(Json.encodePrettily(result.result().getJsonObject(role)));
				} else {
					CommonUtils.addCORSProps(routingContext.response()).end(Json.encodePrettily(result.result().getJsonObject("default")));
				}
			} else {
				databaseOperations.getById(config.getJsonObject("configOptions"), configId+"_"+dLang.toUpperCase()).setHandler(dLangResult -> {
					if(dLangResult.succeeded()) {
						if(role != null) {
							CommonUtils.addCORSProps(routingContext.response()).end(Json.encodePrettily(dLangResult.result().getJsonObject(role)));
						} else {
							CommonUtils.addCORSProps(routingContext.response()).end(Json.encodePrettily(dLangResult.result().getJsonObject("default")));
						}
					} else {
						CommonUtils.addCORSProps(routingContext.response()).setStatusCode(500).end(Json.encodePrettily(dLangResult.cause().getMessage()));
					}
				});
			}
		});
	}
}
