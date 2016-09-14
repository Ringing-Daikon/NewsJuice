var nodeModules = 'public/node_modules';
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    eslint: {
      target: [
        'Gruntfile.js',
        'app/**/*.js',
        'public/**/*.js',
        'lib/**/*.js',
        './*.js',
        'spec/**/*.js',
        'server/**/*.js'
      ]
    },

    concat: {
      dist: {
        src: [
          `${nodeModules}/angular/angular.min.js`, 
          `${nodeModules}/angular-ui-router/release/angular-ui-router.min.js`,
          `${nodeModules}//d3/build/d3.min.js`,
          `${nodeModules}/angular-sanitize/angular-sanitize.min.js`,
          `${nodeModules}/moment/min/moment.min.js`,
          `${nodeModules}/angular-cookies/angular-cookies.js`,
          `${nodeModules}/angular-ui-bootstrap/dist/ui-bootstrap.js`,
          `${nodeModules}/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js`,
          'public/services/services.js',
          'public/features/results/results.js',
          'public/features/home/home.js',
          'public/features/home/trends.js',
          'public/features/home/primaryArticle.js',
          'public/features/profile/profile.js',
          'public/layout.js',
          'public/features/nav/nav.js'

        ],
        dest: 'public/dist/bundle.js'
      }
    },

    uglify: {
      dist: {
        files: {
          'public/dist/bundle.min.js': ['public/dist/bundle.annotate.js']
        }
      }
    },

    shell: {
      prodServer: {
        command: 'ng-annotate -a public/dist/bundle.js > public/dist/bundle.annotate.js',
      }
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'public/dist/style.min.css': [`${nodeModules}/bootstrap/dist/css/bootstrap.min.css`, 'public/styles/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/features/**/*.js',
          'public/services/**/*.js',
          'public/layout.js',
          'public/styles/style.css'
        ],
        tasks: [
          'build',
        ]
      },
    }

  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-shell');

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'eslint'
  ]);

  grunt.registerTask('build', [
    'concat',
    'shell',
    'uglify',
    'cssmin'
  ]);

};
