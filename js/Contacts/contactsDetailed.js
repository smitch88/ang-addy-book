!(function(){

  'use strict';

  /**
   * @ngdoc function
   * @name Master Detailed View directive
   */

  angular
    .module( 'app' )
    .directive( 'masterView', masterView )

  function masterView(){

    var directive = {
      link: link,
      templateUrl: "views/partials/detailed.html"
    };

    // Add dom related master/view manipulation if necessary
    function link( scope, element, attrs ) {

      console.log( scope );
      console.log( element );
      console.log( attrs );

      return;
    }

    return directive;

  }

}())
