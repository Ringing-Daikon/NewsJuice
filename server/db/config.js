const mongoUri = 'mongodb://localhost/voraciousscroll'

require('mongoose').connect(mongoUri).connection
  .on('error', err => console.error(err))
  .once('open', () => console.log(require('chalk').green(`Connected to ${mongoUri}`)));