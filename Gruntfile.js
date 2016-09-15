const nodeModules = 'public/node_modules';
const features = 'public/features';

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
          `${features}/results/results.js`,
          `${features}/home/home.js`,
          `${features}/home/trends.js`,
          `${features}/home/primaryArticle.js`,
          `${features}/profile/profile.js`,
          'public/layout.js',
          `${features}/nav/nav.js`,
          `${features}/home/comments.js`

        ],
        dest: 'public/dist/bundle.js'
      }
    },

    shell: {
      prodServer: {
        command: 'ng-annotate -a public/dist/bundle.js > public/dist/bundle.annotate.js',
      }
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015'],
        compact: false
      },
      dist: {
        files: {
          'public/dist/bundle.trans.js': 'public/dist/bundle.annotate.js'
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'public/dist/bundle.min.js': ['public/dist/bundle.trans.js']
        }
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
          `${features}/**/*.js`,
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
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'eslint'
  ]);

  grunt.registerTask('build', [
    'concat',
    // 'shell',
    // 'babel',
    // 'uglify',
    'cssmin'
  ]);

};
