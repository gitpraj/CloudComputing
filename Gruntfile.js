module.exports = function(grunt) {

	grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concurrent: {
	  dev: {
	    tasks: ['nodemon', 'watch'],
	    options: {
	      logConcurrentOutput: true
	    }
	  }
	},
	nodemon: {
	  dev: {
	    script: 'app.js',
	    options: {
	    	ignore: [
	    		'node_modules/**',
	    		'public/**'
	    	]
	    }
	  }
	},
    cssmin: {
	  	target: {
		    files: [{
		      expand: true,
		      cwd: 'public/',
		      src: ['*.css', '!*.min.css'],
		      dest: 'build/',
		      ext: '.min.css'
		    }]
		}
	},

	uglify: {
	    my_target: {
	      files: {
	        'build/form.min.js': ['public/form.js']
	      }
	    }
	},

	watch: {
		scripts: {
		    files: ['public/*.js'],
		    tasks: ['uglify'],
		    options: {
		    	spawn: false,
		    }
		 },

		styles: {
			files: ['public/*.css'],
		    tasks: ['cssmin'],
		    options: {
		    	spawn: false,
		    },
		}

	}

  });

	// grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-nodemon');

	grunt.registerTask('default', ['cssmin', 'uglify', 'concurrent']);

};
