!(function(){

  'use strict';

  /**
   * @ngdoc function
   * @name ContactsCtrl
   * @description
   * # Contacts Controller
   * Contacts controller of the app
   */

  angular
    .module( 'app' )
    .controller( 'ContactsCtrl', contactsController );

  // Explicit DI defn
  contactsController.$inject = [ '$scope', '$timeout', 'ContactsFactory', 'UtilityFactory' ];

  function contactsController( $scope, $timeout, contactsFactory, utils ){

    // display options
    $scope.displays = [{value: 10, name: '10'},
                       {value: 20, name: '20'},
                       {value: 50, name: '50'}];

    // states available scope
    $scope.states = null;

    // table scoped things
    $scope.table = {

      mapping: [{value: "k", name: "Index Reference"},
                {value: "first_name", name: "First Name"},
                {value: "last_name", name: "Last Name"},
                {value: "phone", name: "Phone"},
                {value: "address", name: "Address"},
                {value: "city", name: "City"},
                {value: "state", name: "State"},
                {value: "zip", name: "Zip"},
                {value: "email", name: "Email"},
                {value: "join_date", name: "Date Added"}],

      // order options - default to last name
      orderBy: "last_name",

      pages: [],

      at: 0

    };

    // contact related items
    $scope.contacts = {
      range: [1, 10],
      display: 10,
      table: null,
      count: 0,
      data: []
    };

    // master view
    $scope.masterView = {
      show: false,
      value: null
    };

    $scope.showMasterDetail = showMasterView;
    $scope.hideMasterDetail = hideMasterView;
    $scope.setPage = setPage;
    $scope.prevPage = prevPage;
    $scope.nextPage = nextPage;
    $scope.filterByName = filterByName;
    $scope.setDisplayCount = setDisplayCount;
    $scope.setOrderBy = setOrderBy;
    $scope.setStateFilter = setStateFilter;
    $scope.filtered = [];
    $scope.mapToHeader = mapToHeader;
    $scope.prevStateSelected = null;
    $scope.prevData = null;

    // Set watcher on the filter bar
    $scope.$watch( "search", searchbarWatcher );

    /*
    *  INITIAL DATA FETCH
    */
    getContactList();

    /*
    * Private scope augmenting fns
    */
    function setScope( data ){

      var indexedData = utils.index( data );
      var indexedArray = indexedData.array;
      var hashTable = indexedData.hashTable;

      $scope.contacts.count = data.length;
      $scope.contacts.table = hashTable;
      $scope.contacts.data = indexedArray;

      // Generate kv map of distinct sorted state values
      $scope.states = utils.kvMap(
        utils.distinct(
          utils.values( "state", data )
          .sort()));

      page( indexedArray );
      setPage( 0 );
      establishCache( indexedData );

      return;

    }

    function setViewScope( page ){
      var displayCount = $scope.contacts.display;
      var from = page * displayCount;
      var to = from + displayCount;
      $scope.contacts.range = [++from, to];
      return;
    }

    function mapToHeader( header ){
      return $scope.table.mapping.filter(function( item ){
        return item.value === header;
      });
    }

    /*
    * Display Counts
    */
    function setDisplayCount(){
      $scope.contacts.display = $scope.displayCount.value;
      page( $scope.contacts.data );
      return;
    }

    /*
    * Sorting and filtering
    */
    function searchbarWatcher(){
      $timeout( function(){
        page( $scope.filtered );
      }, 300);
      return;
    }

    function setStateFilter(){

      var cachedContent = contactsFactory.getCache();

      if( $scope.stateSelected && $scope.stateSelected.value !== "" ){
        $scope.contacts.data = utils.only( "state", $scope.stateSelected.value, cachedContent);
      } else {
        $scope.contacts.data = cachedContent;
      }

      page( $scope.contacts.data );

      var currentDataLength = $scope.contacts.data.length;

      $scope.contacts.count = currentDataLength;

      if( currentDataLength < $scope.contacts.range[1]){
        $scope.contacts.range = [$scope.contacts.range[0], currentDataLength - 1];
      }
      return;
    }

    function filterByName( item ){
      if( $scope.search ){
        var query = $scope.search.toLowerCase();
        var firstName = item.first_name.toLowerCase();
        var lastName = item.last_name.toLowerCase();
        return firstName.indexOf( query ) != -1 || lastName.indexOf( query ) != -1;
      }
      return true;
    }

    function setOrderBy(){
      $scope.table.orderBy = $scope.sortSelected.value;
      return;
    }

    /*
    * Pagination fns
    */

    function page( d ){
      var partitionedSet = utils.partition( d, $scope.contacts.display );
      $scope.table.pages = partitionedSet;

      if( $scope.table.at > partitionedSet.length ){
        setPage( partitionedSet.length - 1 );
      }

      return;
    }

    function setPage( index ){
      $scope.table.at = index;
      setViewScope( index );
      return;
    }

    function prevPage(){
      var curr = $scope.table.at;
      var newIndex = curr > 0 ? --curr : 0;
      setPage( newIndex );
      return;
    };

    function nextPage(){
      var curr = $scope.table.at;
      var maxPage = $scope.table.pages.length - 1;
      var newIndex = curr < maxPage ? ++curr : maxPage;
      setPage( newIndex );
      return;
    };

    /*
    * Master / Detail fns
    */
    function setMasterView( details ){
      $scope.masterView.value = details;
      return;
    }

    function showMasterView( k ){
      $scope.masterView.show = true;
      setMasterView( $scope.contacts.table[ k ] );
      return;
    }

    function hideMasterView(){
      $scope.masterView.show = false;
      return;
    }

    /*
    * Cache and data retrieval
    */

    function establishCache( data ){
      contactsFactory.setCache( data );
      return;
    }

    function getContactList(){
      var cacheSet = contactsFactory.hasCache();
      return cacheSet ?
        contactsFactory.get()
      .success( setScope )
      .error( contactsFactory.error ) :
      setScope
      .call( this, contactsFactory.getCache())
    }

  }

}());
