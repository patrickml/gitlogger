//Add github to our namespace
let github = Npm.require('github');
_.extend(GitLogger, {
  github : new (Npm.require('github'))({
    version: "3.0.0",
    debug : !!Meteor.settings.github.debug
  }),
  authenticate () {
    this.github.authenticate({
      type: "oauth",
      token: Meteor.settings.github.token
    });
  }
});
