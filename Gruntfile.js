const nodeModules = 'node_modules';
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
      options: {
        sourceMap: true
      },
      dist: {
        src: [
          'node_modules/angular/angular.min.js', 
          'node_modules/angular-ui-router/release/angular-ui-router.min.js',
          'node_modules//d3/build/d3.min.js',
          'node_modules/angular-sanitize/angular-sanitize.min.js',
          'node_modules/moment/min/moment.min.js',
          'node_modules/angular-cookies/angular-cookies.js',
          'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
          'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
          'public/layout.js',
          'public/services/services.js',
          `${features}/results/results.js`,
          `${features}/home/home.js`,
          `${features}/home/trends.js`,
          `${features}/home/primaryArticle.js`,
          `${features}/profile/profile.js`,
          `${features}/home/comments.js`,
          `${features}/nav/nav.js`,

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
          'public/dist/style.min.css': ['node_modules/bootstrap/dist/css/bootstrap.min.css', 'public/styles/style.css']
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
