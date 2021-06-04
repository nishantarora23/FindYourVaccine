package com.exp.vaccinetracker.couchbase.dao;

import java.util.List;

import org.apache.commons.lang3.text.StrSubstitutor;

import com.couchbase.client.core.error.DocumentNotFoundException;
import com.couchbase.client.java.Bucket;
import com.couchbase.client.java.Cluster;
import com.couchbase.client.java.Collection;
import com.couchbase.client.java.kv.GetResult;
import com.couchbase.client.java.query.QueryResult;

import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonObject;

public class GetHandler {
	
	Cluster cluster;
	
	public GetHandler() {
		cluster = CreateClusterConnection.getConnection();
	}
	
	public Future<JsonObject> getById(JsonObject options, String id) {
		Promise<JsonObject> response = Promise.promise();
		try {
			Bucket bucket = cluster.bucket(options.getString("bucket"));
			Collection collection = bucket.defaultCollection();
			GetResult getResult = collection.get(id);
			com.couchbase.client.java.json.JsonObject result = getResult.contentAsObject();
			JsonObject resultBody = JsonObject.mapFrom(result.toMap());
			response.tryComplete(resultBody);
		} catch (DocumentNotFoundException e) {
			response.tryFail("Document with the given id not found");
		}
		return response.future();
	}
	
	public Future<JsonObject> getByQuery(JsonObject options) {
		Promise<JsonObject> response = Promise.promise();
		String query = this.createQuery(options);
		this.getByQuery(query).setHandler(handler -> {
			if(handler.succeeded()) {
				response.tryComplete(handler.result());
			} else {
				response.tryFail(handler.cause().getMessage());
			}
		});
		return response.future();
	}
	
	public Future<JsonObject> getByQuery(String query) {
		Promise<JsonObject> response = Promise.promise();
		QueryResult result = cluster.query(query);
		List<com.couchbase.client.java.json.JsonObject> resultObject = result.rowsAsObject();
		com.couchbase.client.java.json.JsonObject resp = com.couchbase.client.java.json.JsonObject.create();
		resp.put("result", resultObject);
		JsonObject resultBody = JsonObject.mapFrom(resp.toMap());
		response.tryComplete(resultBody);
		return response.future();
	}
	
	private String createQuery(JsonObject options) {
		if(!options.containsKey("include")) {
			options.put("include", "*");
		}
		if(options.containsKey("page") && options.containsKey("size")) {
			int page = options.getInteger("page");
			int size = options.getInteger("size");
			options.put("size", page * size);
		}
		StringBuilder query = new StringBuilder("select ${include} from `${bucket}`");
		if(options.containsKey("collection") && options.containsKey("query")) {
			query.append(" where _type='${collection}' AND ${query}");
		} else if(options.containsKey("collection")) {
			query.append(" where _type='${collection}'");
		} else if(options.containsKey("query")) {
			query.append(" where ${query}");
		}
		if(options.containsKey("size")) {
			query.append("LIMIT ${size}");
		}
		if(options.containsKey("page")) {
			query.append("OFFSET ${page}");
		}
		StrSubstitutor strSubstitutor = new StrSubstitutor(options.getMap());
		return strSubstitutor.replace(query);
	}

}
