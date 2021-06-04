package com.exp.vaccinetracker.couchbase.dao;

import java.util.Base64;

import com.couchbase.client.java.Cluster;

public class CreateClusterConnection {
	
	private static Cluster cluster;
	
	public static void init(String uri, String encodedAuth) {
		String decodedAuth = new String(Base64.getDecoder().decode(encodedAuth));
		String[] auth = decodedAuth.split(":");
		cluster = setConnect(uri, auth[0], auth[1]);
	}
	
	public static Cluster setConnect(String connectionString, String username, String password) {
		return Cluster.connect(connectionString, username, password);
	}
	
	public static Cluster getConnection() {
		return cluster;
	}
}
