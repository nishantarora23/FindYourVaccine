package com.exp.vaccinetracker.couchbase.dao;

import com.couchbase.client.core.error.AmbiguousTimeoutException;
import com.couchbase.client.java.Bucket;
import com.couchbase.client.java.Cluster;
import com.couchbase.client.java.Collection;
import com.couchbase.client.java.json.JsonObject;
import com.exp.vaccinetracker.utils.CommonUtils;

import io.vertx.core.Future;
import io.vertx.core.Promise;


public class InsertHandler {
	
	Cluster cluster;
	
	public InsertHandler() {
		cluster = CreateClusterConnection.getConnection();
	}
	
	public Future<String> insert(io.vertx.core.json.JsonObject options, io.vertx.core.json.JsonObject body) {
		Promise<String> response = Promise.promise();
		Bucket bucket = cluster.bucket(options.getString("bucket"));
		Collection collection = bucket.defaultCollection();
		if(options.getString("collection") != null) {
			body.put("_type", options.getString("collection"));
		}
		String id;
		if(body.containsKey("id")) {
			id = body.getString("id");
			body.remove("id");
		} else if (body.containsKey("_id")) {
			id = body.getString("_id");
			body.remove("_id");
		} else {
			id = CommonUtils.generateUUID();
		}
		try {
			collection.upsert(
				id,
			    JsonObject.fromJson(body.toString())
			);
			response.tryComplete("upsert successfully");
		} catch (AmbiguousTimeoutException e) {
			response.tryFail(e.getMessage());
		}
		return response.future();
	}
}
