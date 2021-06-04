package com.exp.vaccinetracker.handlers;

import com.exp.vaccinetracker.utils.CommonUtils;

import io.vertx.ext.web.RoutingContext;

public class OptionsHandler {
	public static void handle(RoutingContext routingContext) {
		CommonUtils.addCORSProps(routingContext.response()).end();
	}
}
