/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library cassini.custom.
 */
sap.ui.define(["jquery.sap.global",
		"sap/ui/core/library"
	], // library dependency
	function ( /*jQuery*/ ) {

		"use strict";

		/**
		 * Custtom Controls
		 *
		 * @namespace
		 * @name cassini.custom
		 * @author SAP SE
		 * @version ${version}
		 * @public
		 */

		// delegate further initialization of this library to the Core
		sap.ui.getCore().initLibrary({
			name: "com.vSimpleApp",
			version: "${version}",
			dependencies: ["sap.ui.core"],
			types: [],
			interfaces: [],
			controls: [
				"com.vSimpleApp.controls.Example",
				"com.vSimpleApp.controls.Tile"
			],
			elements: []
		});

		/* eslint-disable */
		return com.vSimpleApp;
		/* eslint-enable */

	}, /* bExport= */ false);