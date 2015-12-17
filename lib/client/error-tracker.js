_.extend(GitLogger, {
  //The error cache
  _errors : [],

  //Give up access to the cache of errors
  getErrors () {
    return this._errors;
  },

  //reset the errors
  resetErrors () {
    this._errors = [];
  },

  //Add the issue into a cache and attempt to send them
  createGitHubIssueOrComment (error) {
    this._errors.push(error);
    this.sendErrors();
  },

  //Using a debounce method we can capture all of the errors
  //in a sequence before we send them off to the server
  sendErrors : _.debounce(function () {

    //Send off the errors
    Meteor.call('GitLogger/createGitHubIssueOrComment', GitLogger.getErrors(), navigator.userAgent, function () {
      //TODO Create option for user notifications
    });

    //Reset the errors imedietly to deduce the change of duplicates
    GitLogger.resetErrors();
    
  }, 1000)

});

//Allow us to catch errors on the client
var winError = window.onerror || Function.prototype;
window.onerror = function(message, url = '<anonymous>', line = 0, col = 0, error = 0) {

  //Queue github issue or comment
  GitLogger.createGitHubIssueOrComment({
    url : window.location.toString(),
    stack : error.stack,
    message : error.message
  });

  //Return the error normally
  return winError(message, url, line, col, error);
};
