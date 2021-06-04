package com.exp.vaccinetracker.common;

import java.util.Optional;

import com.exp.vaccinetracker.handlers.ConfigurationHandler;
import com.exp.vaccinetracker.handlers.InsertUserInfoHandler;
import com.exp.vaccinetracker.handlers.OptionsHandler;
import com.exp.vaccinetracker.utils.DatabaseOperations;

import io.vertx.config.ConfigRetriever;
import io.vertx.config.ConfigRetrieverOptions;
import io.vertx.config.ConfigStoreOptions;
import io.vertx.core.Vertx;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.http.HttpServer;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.BodyHandler;

public class VertxWeb {
	
	private static final String CONFIG_FILE_PATH = "conf.file";
	private static final String FILE = "file";
	private static final String CONFIG_FILE_FORMAT = "hocon";
	private static final String PATH = "path";

	public static void main(String[] args) {
		Vertx vertx = Vertx.vertx();
//		System.setProperty("conf.file", "config.hocon");
//		String path = System.getProperty(CONFIG_FILE_PATH);
		String path = "config.hocon";
		ConfigStoreOptions store = new ConfigStoreOptions().setType(FILE).setFormat(CONFIG_FILE_FORMAT)
				.setConfig(new JsonObject().put(PATH, path));
		ConfigRetriever retriever = ConfigRetriever.create(vertx, new ConfigRetrieverOptions().addStore(store));
		retriever.getConfig(conf -> {
			vertx.getOrCreateContext().config().mergeIn(
					Optional.ofNullable(conf.result()).orElse(new JsonObject()));
			DatabaseOperations databaseOperations = new DatabaseOperations(conf.result().getJsonObject("database"));
			vertx.getOrCreateContext().put("databaseOperations", databaseOperations);
			HttpServer server = vertx.createHttpServer();
			BodyHandler bodyHandler = BodyHandler.create();
			Router router = Router.router(vertx);
			router.route(HttpMethod.OPTIONS, "/*").handler(OptionsHandler::handle);
			router.route(HttpMethod.POST, "/insertUserInfo").handler(bodyHandler).handler(InsertUserInfoHandler::handle);
			router.route(HttpMethod.GET, "/config/configList").handler(bodyHandler).handler(ConfigurationHandler::getConfigList);
			router.route(HttpMethod.GET, "/getNavbar").handler(bodyHandler).handler(ConfigurationHandler::getNavbar);
			router.route(HttpMethod.GET, "/config/:configId").handler(bodyHandler).handler(ConfigurationHandler::handle);
			router.route(HttpMethod.GET, "/config/lang/:configId").handler(bodyHandler).handler(ConfigurationHandler::getConfigByLang);
			server.requestHandler(router).listen(8889);
		});
	}

}
