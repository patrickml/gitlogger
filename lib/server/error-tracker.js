_.extend(GitLogger, {
  createGitHubIssueOrComment (error, source, userAgent, callback) {
    let instance = this;
    
    //Authenticate our requests
    GitLogger.authenticate();

    //Check if there is an array of errors and if so
    //Convert the data into the format needed
    if(error instanceof Array && error.length > 0) {
      error._errors = error;
      error.message = error._errors[0].message;
      error.stack = error._errors[0].stack;
    }

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

        //Format the body message for each error
        let addMessage = function (error) {
          body += "\n\n**Message**";
          body += "\n```\n"+error.message+"\n```";
          body += "\n**Stack Trace**";
          body += "\n```\n"+error.stack+"\n```";

          if(error.url) {
            body += "\n**URL**";
            body += "\n```\n"+error.url+"\n```";
          }

          body += "\n--\n";
        };

        //If we have userAgent data add it
        if(userAgent) {
          body += "\n**User Agent**";
          body += "\n```\n"+JSON.stringify(userAgent)+"\n```";
        }

        //If we have multiple errors dump them
        if(error._errors) {
          _.each(error._errors, function (err, index) {
            addMessage(err);
          });
        } else {
          //If there is only one error
          addMessage(error);
        }

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
