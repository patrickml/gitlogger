_.extend(GitLogger, {
  getTrace(err, type) {
    return {
      type: type,
      name: err.message,
      stack : err.stack,
      thrownAt: (new Date())
    };
  },
  throwError () {
    process.nextTick(function() {

    });
  },
  createGitHubIssueOrComment (error, source, userAgent, callback) {
    let instance = this;

    //Authenticate our requests
    instance.authenticate();

    //Get all open issues
    instance.github.issues.repoIssues({
      user: Meteor.settings.github.user,
      repo: Meteor.settings.github.repo,
      state : 'open',
      labels : "Server"
    }, function (err, issues) {

      //Build the message for our github post
      let buildBodyMessage = function () {
        let body = "";

        if(userAgent) {
          body += "**User Agent**";
          body += "\n```\n"+JSON.stringify(userAgent)+"\n```";
        }

        body += "**Stack Trace**";
        body += "\n```\n"+error.stack+"\n```";

        return body;
      };

      //Create issue function
      let createIssue = function () {
        instance.github.issues.create({
          user: Meteor.settings.github.user,
          repo: Meteor.settings.github.repo,
          title: error.message,
          labels : [source, "error", "GitLogger", 'bug'],
          body : buildBodyMessage()
        }, callback);
      };

      //Check if there are any issues
      if(issues.length > 0) {
        //Loop through each issue to see if we currently have this issue
        _.each(issues, function (issue) {
          //If we have this issue then comment on the issue with more details
          if(issue.title === error.message) {
            instance.github.issues.createComment({
              user: Meteor.settings.github.user,
              repo: Meteor.settings.github.repo,
              number : parseInt(issue.number),
              body : buildBodyMessage()
            }, callback);
          }
          // In the case we dont already have the issue then we will create one
          else {
            //Create a new issue of this kind
            createIssue();
          }
        });
      } else {
        //Create a new issue of this kind
        createIssue();
      }
    });
  },
  trackerServerErrors () {
    //Add an event listener to the exceptions
    process.on('uncaughtException', function (error) {

      //Start the github flow
      GitLogger.createGitHubIssueOrComment(error, 'server', undefined, function() {
        console.error((new Date()).toUTCString() + ' uncaughtException:', error.message);
        console.error(error.stack);
        process.exit(7);
      });

    });
  }
});

GitLogger.trackerServerErrors();
