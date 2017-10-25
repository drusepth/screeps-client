module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-screeps');

  grunt.initConfig({
    // Run with: grunt screeps
    screeps: {
      options: {
        email:    'YOUR_EMAIL',
        password: 'YOUR_PASSWORD',
        branch:   'default',
        ptr:      false
      },
      dist: {
        files: [
          {
            expand:  true,
            cwd:     'dist/',
            src:     ['**/*.js'],
            flatten: true
          }
        ]
      }
    }
  });
}
