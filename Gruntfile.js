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
					<style type="text/css">
					html {
						background: #fff;
						font: 10pt/1 -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen-Sans", "Ubuntu", "Cantarell", "Helvetica Neue", sans-serif;
						color: #999;
					}

					a:link, a:visited {
						color: #999;
					}

					a:active {
						color: #1fc1ad;
					}

					h1 {
						text-align: center;
						font-size: 24pt;
					}

					body > p {
						text-align: center;
						margin-bottom: 2em;
					}

					body {
						max-width: 900px;
						margin: 100px auto;
					}

					.icons {
						padding: 0 20px;
						overflow: hidden;
						margin-bottom: 50px;
					}

					.icons div {
						width: 64px;
						height: 64px;
						float: left;
						padding: 6px 2px;
						position: relative;
						font-size: 7pt;
						cursor: pointer;
						text-align: center;
					}

					.icons div p {
						margin: 0;
						color: #bbb;
						text-align: center;
						overflow: hidden;
						max-height: 1.9em;
						word-break: break-word;
					}

					.icons div svg {
						width: 48px;
						height: 48px;
						fill: #000;
					}

					.icons div:hover svg {
						fill: #1fc1ad;
					}
					</style>
					<script type="text/javascript">
					window.onload = function () {
					    var rows = document.getElementsByTagName( 'svg' );
					    for ( i=0; i<rows.length; i++ ) {
					        rows[i].onclick = function () {
					            var cssClass = this.getAttribute( 'class' );
					            var iconID = '#' + cssClass.split(' genericons-neue-')[1];
					            var fileLocation = 'genericons-neue.svg';
					            var suggestion = '<svg class="'+ cssClass +'" width="16px" height="16px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + fileLocation + iconID + '"></use></svg>';
					            window.prompt( 'Copy this, paste in your HTML.', suggestion );
					        }
					    }
					}
					</script>
					</head>
					<body>

					<h1>Genericons Neue</h1>

					<p>Generic looking icons, suitable for a blog or simple website.</p>

					{{{svg}}}

					<div class="icons">
					{{#each icons}}
						<div>
							<svg width="16" height="16" class="genericons-neue genericons-neue-{{name}}">
							<use xlink:href="#{{name}}" />
							</svg>
							<p>{{title}}</p>
						</div>
					{{/each}}
					</div>

					<p><a href="https://github.com/Automattic/genericons-neue">GitHub</a> &nbsp; <a href="https://www.npmjs.com/package/genericons-neue">NPM</a></p>
					<p>An <a href="https://automattic.com">Automattic</a> Portrayal</p>

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

		copy: {
			main: {
				src: 'svg-sprite/index.html',
				dest: 'docs/index.html'
			}
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

	grunt.registerTask('default', ['svgmin', 'group', 'svgstore', 'rename', 'copy', 'webfont', 'cssmin','addsquare']);

};
