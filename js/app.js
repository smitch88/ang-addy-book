!(function(){

  'use strict';

  /**
   * @ngdoc overview
   * @name uaContacts
   * @description
   * # uaContacts
   *
   * Root module of the application
   * Adds in base modules and router configuration
   */

  // Take note that I'm not going to namespace off of app since this is a simple app
  angular
    .module( 'app', [ 'ngRoute' ])
    .config( baseConfiguration );

  baseConfiguration.$inject = [ '$routeProvider' ];

  function baseConfiguration( $routeProvider ){

    var defaultHandler = {
      redirectTo: '/'
    };

    var contactsPageHandler = {
      templateUrl: 'views/contacts.html',
      controller: 'ContactsCtrl'
    };

    $routeProvider
      .when('/', contactsPageHandler )
      .otherwise( defaultHandler );

  }

}());
