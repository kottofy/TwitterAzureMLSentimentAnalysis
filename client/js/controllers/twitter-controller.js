
app.controller('tweetsController', ['$scope', '$resource', 
    function($scope, $resource) {
        var Tweet = $resource('/api/tweets');
        
        // console.log("searching");
         console.log($scope);
        // var query = $scope.query;
        // if(query) {
        //     Tweet.query({query: query}, function (results) {
            
        //         $scope.tweets = results;
        //     });
        // }
        
        $scope.search = function () {
            console.log("searching");
            console.log($scope.query);
            var query = $scope.query;
            if(query) {
                Tweet.query({query: query}, function (results) {
                
                    $scope.tweets = results;
                });
            }
        }
    }
]);

