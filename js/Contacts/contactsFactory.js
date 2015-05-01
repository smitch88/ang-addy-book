!(function(){

  'use strict';

  /**
   * @ngdoc function
   * @name ContactsFactory
   * @description
   * # Contacts Factory
   * Contacts factory of the app
   */

  angular
    .module( 'app' )
    .factory( 'ContactsFactory' , contactsFactory );

  // Explicit DI defn
  contactsFactory.$inject = [ '$http' ];

  function contactsFactory( $http ) {

    // contacts cache, probably a built in way to do this but this is simple
    var contactsCache = null;

    var indexedCache = null;



    // base data path
    var BASE_DATA_PATH = function(){
      // hacky way to get github pages working as I want hah
      if( window.location.href.indexOf( "github" ) > -1 ) {
        return "http://smitch88.github.io/ang-addy-book/public/data/"
      } else {
        return "/public/data/";
      }
    }();

    // Exposed api functionality
    var contactsAPI = {
      get: get,
      post: post,
      put: put,
      del: del,
      search: search,
      error: error,
      hasCache: hasCache,
      getCache: getCache,
      setCache: setCache,
      dumpCache: dumpCache
    };

    function getCache(){
      return contactsCache;
    }


    function hasCache(){
      return !contactsCache;
    }

    function setCache( data ){
      contactsCache = data.array;
      indexedCache = data.hashTable;
      return;
    }

    function dumpCache(){
      setCache(null);
      return;
    }

    function get( id ){

      var retrievalSettings = {
        method: 'get',
        cache: true,
        url: BASE_DATA_PATH + 'contacts.json'
      };

      return $http( retrievalSettings );

    }

    function post( opts ){
      contactsCache.push( opts );
      return;
    }

    // TODO: Updating records to cache
    function put( opts ){
      return;
    }

    function del( k ){
      contactsCache = contactsCache.filter(function(c){
          return c.k !== k;
      });
    }

    function parseQueryString(){
      return;
    }

    // TODO: Searching thru cache
    function search( queryString, opts ){
      return;
    }

    function error(){
      console.error( "error while getting contacts records" );
    }

    return contactsAPI;
  }

}())
