package com.exp.vaccinetracker.utils;

import com.exp.vaccinetracker.common.CommonConstants.DatabaseName;
import com.exp.vaccinetracker.couchbase.dao.CreateClusterConnection;
import com.exp.vaccinetracker.couchbase.dao.GetHandler;
import com.exp.vaccinetracker.couchbase.dao.InsertHandler;

import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonObject;

public class DatabaseOperations {
	
	InsertHandler insertHandler;
	GetHandler getHandler;
	
	public DatabaseOperations(JsonObject database) {
		if(DatabaseName.COUCHBASE.getName().equalsIgnoreCase(database.getString("name"))) {
			CreateClusterConnection.init(database.getString("uri"), database.getString("auth"));
			insertHandler = new InsertHandler();
			getHandler = new GetHandler();
		}
	}
	
	public Future<String> insert(JsonObject options, JsonObject body) {
		Promise<String> response = Promise.promise();
		insertHandler.insert(options, body).setHandler(result -> {
			if(result.succeeded()) {
				response.tryComplete(result.result());
			} else {
				response.tryFail(result.result());
			}
		});
		return response.future();
	}
	
	public Future<JsonObject> getById(JsonObject options, String id) {
		Promise<JsonObject> response = Promise.promise();
		getHandler.getById(options, id).setHandler(result -> {
			if(result.succeeded()) {
				response.tryComplete(result.result());
			} else {
				response.tryFail(result.cause().getMessage());
			}
		});
		return response.future();
	}
	
	public Future<JsonObject> getByQuery(String query) {
		Promise<JsonObject> response = Promise.promise();
		getHandler.getByQuery(query).setHandler(result -> {
			if(result.succeeded()) {
				response.tryComplete(result.result());
			} else {
				response.tryFail(result.cause().getMessage());
			}
		});
		return response.future();
	}

}
