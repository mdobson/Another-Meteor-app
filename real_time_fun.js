User = new Meteor.Collection("user");
Links = new Meteor.Collection("links");
Shares = new Meteor.Collection("shares");
Friends = new Meteor.Collection("friends");
Comments = new Meteor.Collection("comments");
Copies = new Meteor.Collection("copies");

if (Meteor.is_client) {

  Template.main.events = {
    'click .enter' : function () {
      var username = document.getElementById("username");
      if(User.findOne({username : username.value}) === undefined)
      {
        User.insert({username:username.value})
        Session.set("username", username.value);
      }
      else
      {
        var user = User.findOne({username:username.value});
        Session.set("username", user.username);
      }
    }
  };

  Template.login.userset = function()
  {
      return Session.get("username") != undefined;
  };

  Template.greeting.username = function(){
     if(Session.get("username") === undefined)
     {
        return "Unknown";
     }
     else
     {
        return Session.get("username");
     }
  };

  Template.posts.events = {
    'click .share' : function(){
      var post = document.getElementById("link");
      var username = Session.get("username");
      Links.insert({link:post.value, user:username});
    }
  };

  Template.posts.submitted_links = function(){
    var user = Session.get("username");
    return Links.find({user:user});
  }

  Template.post.events = {
    'click .Up' : function(){
      Links.update({_id:this._id}, {$inc: {score:1}});
    },
    'click .Down' : function(){
      Links.update({_id:this._id}, {$inc: {score:-1}});
      Links.remove({score: {$lt:0}});
      Comments.remove({postid:this._id});
    },
    'click .comment' : function(){
      var comment = document.getElementById("comment").value;
      Comments.insert({postid:this._id, comment:comment});
    }
  };

  Template.friends.events = 
  {
    'click .friend' : function(){
      var target = document.getElementById("friendname");
      var source = Session.get("username");
      if(Friends.findOne({target:target.value, source:source}) === undefined)
      {
        Friends.insert({target:target.value,source:source})
      }
    }
  };

  Template.friends.friends = function(){
    var source = Session.get("username");
    return Friends.find({source:source});
  };

  Template.followers.followers = function(){
    var target = Session.get("username");
    return Friends.find({target:target});
  };

  Template.post.comments = function(){
    return Comments.find({postid:this._id});
  };

}

if (Meteor.is_server) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}