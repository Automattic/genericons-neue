/*
 * Export Genericons
 */

'use strict';

var multiline = require('multiline');

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({

		// Minify SVGs from svg directory, output to svg-min
		svgmin: {
			dist: {
				files: [{
					attrs: 'fill',
					expand: true,
					cwd: 'svg',
					src: ['*.svg'],
					dest: 'svg-min/',
					ext: '.svg'
				}]
			},
			options: {
				plugins: [
					{ removeAttrs: { attrs: ['fill', 'id', 'style'] } },
					{ removeViewBox: false },
					{ removeEmptyAttrs: false }
				]
			}
		},

		// Create single SVG sprite for use outside of React environments, output to svg-sprite
		svgstore: {
			withCustomTemplate:{
				options: {
					prefix : '', // Unused by us, but svgstore demands this variable
					svg: { // will add and overide the the default xmlns="http://www.w3.org/2000/svg" attribute to the resulting SVG
						viewBox : '0 0 16 16',
						xmlns: 'http://www.w3.org/2000/svg'
					},

					cleanup : ['style', 'fill', 'id'],

					includedemo : multiline.stripIndent(function(){/*
					<!DOCTYPE html>
					<html>
					<head>
					<title>Genericons Neue</title>
					<meta name="robots" content="noindex">
					<link rel="stylesheet" type="text/css" href="genericons-neue-demo.css" />
					<script src="genericons-neue-demo.js"></script>
					</head>
					<body>

					<h1>Genericons Neue</h1>

					{{{svg}}}

					<div id="icons">
					{{#each icons}}
						<div>
							<svg width="16" height="16" class="genericons-neue genericons-neue-{{name}}">
							<use xlink:href="#{{name}}" />
							</svg>
							<p>{{title}}</p>
						</div>
					{{/each}}
					</div>

					</body>
					</html>
					*/})

				},
				files: {
					'svg-sprite/genericons-neue.svg': ['svg/*.svg']
				}
			},
		},

		rename: {
			moveThis: {
					src: 'svg-sprite/genericons-neue-demo.html',
					dest: 'svg-sprite/index.html'
			},
		},

		// generate a web font
		webfont: {
			icons: {
				src: 'svg/*.svg',
				dest: 'icon-font'
			},
			options: {
				'font': 'Genericons-Neue',
				'types': 'eot,woff2,woff,ttf',
				'order': 'eot,woff,ttf',
				'embed': true,
				'relativeFontPath': 'icon-font',
				templateOptions: {
					baseClass: 'genericons-neue',
					classPrefix: 'genericons-neue-',
					mixinPrefix: 'genericon-neue-'
				},
				codepointsFile: 'codepoints.json'
			}
		},

		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'icon-font/',
					src: ['*.css', '!*.min.css'],
					dest: 'icon-font/',
					ext: '.min.css'
				}]
			}
		},
	});

	// Load the copier
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Load the SVGstore
	grunt.loadNpmTasks('grunt-svgstore');

	// Load the renamer
	grunt.loadNpmTasks('grunt-rename');

	// Load svgmin
	grunt.loadNpmTasks('grunt-svgmin');

	// load the webfont creater
	grunt.loadNpmTasks('grunt-webfont');

	// minify css files
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	// Update all files in svg-min to add a <g> group tag
	grunt.registerTask( 'group', 'Add <g> tag to SVGs', function() {
		var svgFiles = grunt.file.expand( { filter: 'isFile', cwd: 'svg-min/' }, [ '**/*.svg' ] );

		// Add stuff
		svgFiles.forEach( function( svgFile ) {

			// Grab the relevant bits from the file contents
			var fileContent = grunt.file.read( 'svg-min/' + svgFile );

			// Add transparent rectangle to each file
			fileContent = fileContent.slice( 0, fileContent.indexOf('viewBox="0 0 16 16">') + 20 ) +	// opening SVG tag
						'<g>' +
						fileContent.slice( fileContent.indexOf('viewBox="0 0 16 16">') + 20, -6 ) + 	// child elements of SVG
						'</g>' +
						fileContent.slice( -6 );	// closing SVG tag

			// Save and overwrite the files in svg-min
			grunt.file.write( 'svg-min/' + svgFile, fileContent );

		} );

	});

	// Update all files in svg-min to add transparent square, this ensures copy/pasting to Sketch maintains a 16x16 size
	grunt.registerTask( 'addsquare', 'Add transparent square to SVGs', function() {
		var svgFiles = grunt.file.expand( { filter: 'isFile', cwd: 'svg-min/' }, [ '**/*.svg' ] );

		// Add stuff
		svgFiles.forEach( function( svgFile ) {

			// Grab the relevant bits from the file contents
			var fileContent = grunt.file.read( 'svg-min/' + svgFile );


			// Add transparent rectangle to each file
			fileContent = fileContent.slice( 0, fileContent.indexOf('viewBox="0 0 16 16">') + 20 ) +
						'<rect x="0" fill="none" width="16" height="16"/>' +
						fileContent.slice( fileContent.indexOf('viewBox="0 0 16 16">') + 20, -6 ) +
						fileContent.slice( -6 );

			// Save and overwrite the files in svg-min
			grunt.file.write( 'svg-min/' + svgFile, fileContent );

		} );

	});

	// Default task(s).

	grunt.registerTask('default', ['svgmin', 'group', 'svgstore', 'rename', 'webfont', 'cssmin','addsquare']);

};