!(function(){

  'use strict';

  /**
   * @ngdoc function
   * @name Contacts Table View directive
   */

  angular
  .module( 'app' )
  .directive( 'contactsTable', contactsTable )

  contactsTable.$inject = [ '$timeout', 'ContactsFactory' ];

  function contactsTable( $timeout, contactsFactory ){

    var directive = {
      link: link,
      templateUrl: "views/partials/table.html"
    };

    // Add dom based manipulation for any table manipulation
    function link( scope, element, attrs ) {

      var el = element[0];
      var addButton = el.querySelector( 'button.add-contact' );
      var tableEl = el.querySelector( 'table' );
      var tableFooter = el.querySelector( '.table-footer' );

      var create = function(){

        var inCreate = false;
        var addForm = el.querySelector( 'form#addContactForm' );

        // very hacky inefficient clone just for brevity sake
        var origButtonStyle = addButton.style.backgroundColor;
        var origButtonText = addButton.innerHTML;

        addButton.addEventListener( "click",  addButtonHandler );
        addForm.addEventListener( "submit",  addSubmitHandler );

        function makeInvisible( el ){
          el.style.visibility = "hidden";
          return;
        }

        function makeVisible( el ){
          el.style.visibility = "visible";
          return;
        }

        function hide( el ){
          el.style.display = "none";
          return;
        }

        function show( el ){
          el.style.display = "block";
          return;
        }

        function toggleButtonView(){
          var displayText = !inCreate ? "x Cancel": origButtonText;
          var bgColor = !inCreate ? "red": origButtonStyle;
          addButton.style.backgroundColor = bgColor;
          addButton.innerHTML = displayText;
          return;
        }

        function toggleTransitionEls(){

          inCreate ? ( makeVisible( tableEl ), makeVisible( tableFooter ), ( hide( addForm ))) :
                      ( makeInvisible( tableEl ), makeInvisible( tableFooter ), ( show( addForm )));

          inCreate = !inCreate;

          return;
        }

        function addButtonHandler(){

          toggleButtonView();

          toggleTransitionEls();

          return;
        }

        function addSubmitHandler(){

          var contactInformation = {
            first_name: this.first_name.value,
            last_name: this.last_name.value,
            phone: this.phone.value,
            address: this.address.value,
            city: this.city.value,
            state: this.state.value,
            zip: this.zip.value,
            join_date: new Date(),
            email: this.email.value
          };

          contactsFactory.post( contactInformation );

          addButtonHandler();

          $timeout( scope.refresh, 300 );

          return;

        };

        return;

      }

      // Create instance of a
      var userInstance = create();

      return;

    }

    return directive;

  }

}())
