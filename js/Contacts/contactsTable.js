!(function(){

  'use strict';

  /**
   * @ngdoc function
   * @name Contacts Table View directive
   */

  angular
    .module( 'app' )
    .directive( 'contactsTable', contactsTable )

  function contactsTable(){

    var directive = {
      link: link,
      templateUrl: "views/partials/table.html"
    };

    // Add dom based manipulation for any table manipulation
    function link( scope, element, attrs ) {

      console.log( scope );
      console.log( element );
      console.log( attrs );

      return;
    }

    return directive;

  }

}())
