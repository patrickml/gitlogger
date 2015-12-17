Meteor.methods({
  //Allow us to create issues from the client
  'GitLogger/createGitHubIssueOrComment' (errors, userAgent) {
    //Call the real function to create github issues
    GitLogger.createGitHubIssueOrComment(errors, 'client', userAgent);
  }
});
