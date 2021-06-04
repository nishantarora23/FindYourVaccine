package com.exp.vaccinetracker.common;

public class CommonConstants {
	
	public enum DatabaseName {
		COUCHBASE("couchbase");
		
		private String dbName;
		DatabaseName(String field){
			this.dbName = field;
		}
		
		public String getName() {
			return dbName;
		}
	}

}
