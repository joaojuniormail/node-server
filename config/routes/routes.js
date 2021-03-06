'use strict';

let routes = [];

// Padrão para criação de rotas
// {
// 		nomedarota : {
// 			path : 'nomedarota', // /nomedarota (a ser respondida no HTTP)
// 			handler : 'onde_está_o_handler_da_rota' // controllers.nomedarota, interpretado no index.js
// 			// (nomedarota deve ser uma pasta dentro da pasta app)
// 		}
// }
function createRoute(strRouteName, strMethod, strHandlerMethod, strPath, strHandler) {
	routes[strRouteName] = routes[strRouteName] || {};
	routes[strRouteName][strMethod] = routes[strRouteName][strMethod] || [];
	routes[strRouteName][strMethod].push({
		'path': strPath,
		'handler': (strHandler ? strHandler : strRouteName) + '.' + strHandlerMethod
	});

	return routes[strRouteName];
}

// Gera um rota diretamente a partir da raiz, sem padrão
function generateDirectRoute(strRouteName, strMethod, strHandlerMethod, strPath) {
	strPath = '/' + (strPath ? strPath : '');
	return createRoute(strRouteName, strMethod, strHandlerMethod, strPath);
}

// Gera uma rota com padrão de nome, caminho e método
function generateStandardRoute(strRouteName, strMethod, strHandlerMethod, strPath, strResourceVersion, strHandler) {
	strResourceVersion = strResourceVersion ? (strResourceVersion + '/') : '';
	strPath = '/' + strResourceVersion + strRouteName + (strPath ? strPath : '');
	return createRoute(strRouteName, strMethod, strHandlerMethod, strPath, strHandler);
}

// Gera uma rota do tipo CRUD, com padrão de tratamento de métodos
function generateStandardCRUDRoute(strEndpoint, strPath, strVersion = 'v1') {
	strPath = strPath || '';
	generateStandardRoute(strEndpoint, 'get', 'getOne', strPath + '/:id', strVersion);
	generateStandardRoute(strEndpoint, 'get', 'getAll', strPath, strVersion);
	generateStandardRoute(strEndpoint, 'post', 'createOne', strPath, strVersion);
	generateStandardRoute(strEndpoint, 'put', 'updateOne', strPath + '/:id', strVersion);
	generateStandardRoute(strEndpoint, 'delete', 'deleteOne', strPath + '/:id', strVersion);
	return routes[strEndpoint];
}

// Gera uma rota para apenas visualização, com padrão de tratamento para GET_ALL
function generateStandardListRoute(strEndpoint, strVersion = 'v1') {
	return generateStandardRoute(strEndpoint, 'get', 'getAll', null, strVersion);
}

function generateDominiosRoute() {

	let configs = {
		name: 'dominios',
		folder: {
			comum: 'dominios/dominios-comum'
		},
		url: {
			comum: '/comum'
		},
		version: 'v1'
	};

	function generateDominiosComum() {
		generateStandardRoute(
			configs.name,
			'get',
			'getOne',
			configs.url.comum + '/:id',
			configs.version,
			configs.folder.comum
		);

		generateStandardRoute(
			configs.name,
			'get',
			'getAll',
			configs.url.comum,
			configs.version,
			configs.folder.comum
		);

		generateStandardRoute(
			configs.name,
			'post',
			'createOne',
			configs.url.comum,
			configs.version,
			configs.folder.comum
		);

		generateStandardRoute(
			configs.name,
			'put',
			'updateOne',
			configs.url.comum,
			configs.version,
			configs.folder.comum
		);

		generateStandardRoute(
			configs.name,
			'delete',
			'deleteOne',
			configs.url.comum + '/:id',
			configs.version,
			configs.folder.comum
		);
	}

	function init() {
		// dominios/comum
		// URLs maiores/complexas devem vir antes das mais simples

		generateDominiosComum();

		// dominios
		generateStandardCRUDRoute(configs.name);

	}

	init();
}

function getRoutes() {
	return routes;
}

function makePublic() {
	module.exports = exports = getRoutes;
}

function init() {
	makePublic();
}

init();
