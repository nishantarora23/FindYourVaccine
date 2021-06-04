package com.exp.vaccinetracker.utils;

import java.util.UUID;

import io.vertx.core.http.HttpServerResponse;

public class CommonUtils {

	public static HttpServerResponse addCORSProps(HttpServerResponse response) {
		response.putHeader("Access-Control-Allow-Headers",
				"Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
		.putHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT,PATCH, HEAD, DELETE, CONNECT")
		.putHeader("Access-Control-Allow-Origin", "*")
		.putHeader("Access-Control-Expose-Headers", "access_token, refresh_token");
		return response;
	}
	
	public static String generateUUID() {
		UUID uuid = UUID.randomUUID();
		return uuid.toString();
	}
}
