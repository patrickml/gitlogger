Meteor.methods({
  //Allow us to create issues from the client
  'GitLogger/createGitHubIssueOrComment' (error, userAgent) {
    console.log(error);
    //Call the real function to create github issues
    GitLogger.createGitHubIssueOrComment(error, 'server', userAgent);
  }
});
