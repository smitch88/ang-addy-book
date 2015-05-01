!(function(){

  'use strict';

  /**
   * @ngdoc function
   * @name UtilityFactory
   * @description
   * # Utility Factory
   */

  angular
    .module( 'app' )
    .factory( 'UtilityFactory' , utilityFactory );

  function utilityFactory() {

    function inclusive( from, to, data ){
      var isFiniteTo = isFinite( to ) && to < data.length;
      return isFiniteTo ? data.slice( from, to ) : data;
    }

    function simpleHash( str ){
      var hash = 0, i, chr, len;
      if (str.length == 0) return hash;
      for (i = 0, len = str.length; i < len; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    }

    function stringify( record ){
      return JSON.stringify( record );
    }

    function index( data ){
      var indexedMapping = {};
      var indexedData = data.map(function( record ){
        var indexedKey = simpleHash( stringify( record ) );
        record.k = indexedKey;
        indexedMapping[ indexedKey ] = record;
        return record;
      });

      return {
        hashTable: indexedMapping,
        array: indexedData
      }

    }

    function partition( input, spacing ) {
      var p = [];
      for ( var i = 0; i < input.length; i += spacing ){
          p[ p.length ] = input.slice( i, i + spacing );
      }
      return p;
    }

    function values( key, data ){
      var vs = [];
      for ( var i = 0; i < data.length; i++){
        if( data[i] && data[i][ key ] ){
          var v = data[i][ key ];
          vs.push( v );
        }
      }
      return vs;
    }

    function distinct(a){
      var seen = {};
      return a.filter(function(item) {
          return seen.hasOwnProperty(item) ? false : (seen[item] = true);
      });
    }

    function kvMap( k ){
      return k.map(function(item){
        return {value: item, name: item};
      });
    }

    function only( k, v, data ){
      return data.filter(function(item){
        return item[ k ] === v;
      });
    }

    return {

      inclusive: inclusive,

      index: index,

      partition: partition,

      values: values,

      distinct: distinct,

      kvMap: kvMap,

      only: only

    }

  }

}())
