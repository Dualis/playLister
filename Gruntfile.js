module.exports = function(grunt) {
 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

          typescript: {
            base: {
             src: ['ts/*.ts'],
             dest: 'dist/',
            options: {
        module: 'commonjs', //or commonjs 
        target: 'es5', //or es3 
        keepDirectoryHierachy: true,
        sourceMap: true,
        declaration: true
            }
        }
    },
        
    watch: {
      files: ['server.ts'],
      tasks: ['typescript']
    },
	
	nodemon: {
		dev: {
			script: 'server.js'
		}
	},

	concurrent: {
		target1: ['typescript'],
		target2: ['watch', 'nodemon']
	}
	
	
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-typescript');
	grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
	
    grunt.registerTask('default', ['typescript', 'watch']);

};