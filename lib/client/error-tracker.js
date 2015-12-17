_.extend(GitLogger, {
  createGitHubIssueOrComment (error) {
    Meteor.call('GitLogger/createGitHubIssueOrComment', error, navigator.userAgent, function () {

    });
  }
});

var winError = window.onerror || Function.prototype;

window.onerror = function(message, url = '<anonymous>', line = 0, col = 0, error = 0) {

  //Create github issue
  GitLogger.createGitHubIssueOrComment({
    stack : error.stack,
    message : error.message
  });

  return winError(message, url, line, col, error);
};

// TestClientFunction();
