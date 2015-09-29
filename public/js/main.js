var app = angular.module('TwassitApp', []);
app.controller('ProfileController', function($scope, $http) {

    $scope.feedURI = "/feed";
    
    
    $scope.feed = function(username) {
        $scope.feedURI = '/user/' + username;
        $http.get($scope.feedURI).success(function(data, status) {
            $scope.posts = data.reverse();
        });
    };

    $scope.reloadFeed = function() {
        $scope.feedURI = '/feed';
        $http.get($scope.feedURI).success(function(data, status) {
            $scope.posts = data.reverse();
        });
    };
    $scope.agree = function(id) {
        $http.get('/agree/' + id).success(function(response) {
            if (response === "Agreed") {
                $scope.status = "You have agreed on post number:" + id;
            }
            else {
                $scope.status = "Error while agreeing on post number:" + id;
            }

            $http.get($scope.feedURI).success(function(data, status) {
                $scope.posts = data.reverse();
            });
        });
    };

    $scope.disagree = function(id) {
        $http.get('/disagree/' + id).success(function(response) {
            if (response === "Disagreed") {
                $scope.status = "You have disagreed on post number:" + id;
            }
            else {
                $scope.status = "Error while disagreeing on post number:" + id;
            }

            $http.get($scope.feedURI).success(function(data, status) {
                $scope.posts = data.reverse();
            });
        });
    };
    $scope.user = "Loading... retreiving data!";
    $scope.status = "Not Posted!";
    $http.get("/getuser")
        .success(function(response) {
            if (response == "Not user") {
                window.location.assign("http://" + window.location.host + "/login");
            }
            $scope.user = response;
            $scope.rcist = "Watchdog Racism FTW!";
            setInterval(function() {
                $scope.left = 140 - $scope.rcist.length;
            }, 100);

            $scope.posts = [];
            setInterval(function() {
                $http.get($scope.feedURI).success(function(data, status) {
                    $scope.posts = data.reverse();
                });
            }, 30000);
            $http.get($scope.feedURI).success(function(data, status) {
                $scope.posts = data.reverse();
            });
            $scope.share = function() {

                $http.post("/postRcist", {
                    'rcist': $scope.rcist
                }).success(function(data, status) {
                    if (data != "Not Authenticated") {
                        $scope.status = "Posted!";

                        $scope.rcist = "";
                        $http.get($scope.feedURI).success(function(data, status) {
                            $scope.posts = data.reverse();
                        });
                    }
                });
            };


        });


});
