// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)
    */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict

    hasRowConflictAt: function(rowIndex) {
      // input - array index
      // output - boolean
      // create a count variable
      var count = 0;
      // iterate through rowIndex
      for (var i = 0; i < rowIndex.length; i++) {
        // if value at index equals 1
        if (rowIndex[i] === 1) {
          // increment count variable
          count++;
        }
      }
      // if count is less than 1
      if (count > 1) {
        return true;
      }
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {

      var board = this.rows();
      // variable for rowConflict
      var rowConflict;
      // iterate through the board
      for (var i = 0; i < board.length; i++) {
        // run hasRowConflict on each index of board
        rowConflict = this.hasRowConflictAt(board[i]);
        // if rowClinfict === false
        if (rowConflict === true) {
          return true;
        }
      }
      //if for loop ends, it means it did not find any row conflicts. Thus, return true.
      return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {

      var board = this.rows();
      //create count variable
      var countVar = 0;
      //for loop iteration over board
      for (var i = 0; i < board.length; i++) {
        //get row equal to board[i]
        var row = board[i];
        //if row[colIndex] = 1
        if (row[colIndex] === 1) {
          //increase count
          countVar++;
        }
      }
      //if count is more than 1
      if (countVar > 1) {
        //return true
        return true;
      }
      //else, return false
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {

      // create the board
      var board = this.rows();
      // create an indexStorage variable
      var indexStorage, indexValue, colConflict, row;
      // iterate over the boards first row
      for (var i = 0; i < board.length; i++) {
        row = board[i];
        for (var j = 0; j < row.length; j++) {
          // if any index value equals 1
          indexValue = row[j];
          if (indexValue === 1) {
            // set indexStorage variable to the matching index
            indexStorage = j;
            // check the other rows at the indexStorage index for value 1
            colConflict = this.hasColConflictAt(indexStorage);
          }
          // if a value of 1 is found at index
          if (colConflict === true) {
            return true;
          }
        }
      }
      // if no match is found return false
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {

      //variables
      var board = this.rows();
      var valueIndexCount = majorDiagonalColumnIndexAtFirstRow;
      var firstConflict = 0;

      //for loop iterates over the board where it i starts at columnindex
      for (var i = 0; i < board.length; i++) {
        //if board[i][valueIndexCount] = 1
        if (board[i][valueIndexCount] === 1) {
          //for the first 1 found, we are just gonna give it a pass
          if (firstConflict === 0) {
            firstConflict++;
            valueIndexCount++;
          } else {
          //return true for every other 1 found
            return true;
          }
        } else if (board[i][valueIndexCount] === 0 && firstConflict === 0) {
          continue;
        //else increase valueIndexCount for the next iteration check
        } else {
          valueIndexCount++;
        }
      }
      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {

      // variables
      var countVar = 0;
      var board = this.rows();
      var row, diagonalConflict;

      //for loop iterates over the board
      for (var i = 0; i < board.length; i++) {
        //row = board[i]
        row = board[i];
        //for loop to iterate over row => use j
        for (var j = 0; j < row.length; j++) {
          //if row[j] = 1
          if (row[j] === 1) {
            //pass row[i] and value[j] index to hasmajor... and set that equal to diagonalConflict
            diagonalConflict = this.hasMajorDiagonalConflictAt(j);
            //if diagonalConflict = true
            if (diagonalConflict) {
              //return true
              return true;
            }
          }
        }
      }
      //return false if diagonalConflict didn't find true
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {

      // variables
      var board = this.rows();
      var valueIndexCount = minorDiagonalColumnIndexAtFirstRow;
      var firstConflict = 0;

      // for loop iterates over the board where it i starts at columnindex
      for (var i = 0; i < board.length; i++) {
        // if board[i][valueIndexCount] = 1
        if (board[i][valueIndexCount] === 1) {
          // for the first 1 found, we are just gonna give it a pass
          if (firstConflict === 0) {
            firstConflict++;
            valueIndexCount--;
          } else {
          // return true for every other 1 found
            return true;
          }
        } else if (board[i][valueIndexCount] === 0 && firstConflict === 0) {
          continue;
        // else decrease valueIndexCount for the next iteration check
        } else {
          valueIndexCount--;
        }
      }
      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {

      // variables
      var countVar = 0;
      var board = this.rows();
      var row, diagonalConflict;

      // iterates over the board
      for (var i = 0; i < board.length; i++) {
        // set row variable equal to the current board index
        row = board[i];
        // iterate over row
        for (var j = 0; j < row.length; j++) {
          // if row index equals 1
          if (row[j] === 1) {
            // pass index (j) to hasMinorDiagonalConflictAt and set the result to diagonalConflict
            diagonalConflict = this.hasMinorDiagonalConflictAt(j);
            // if diagonalConflict = true
            if (diagonalConflict) {
              // return true
              return true;
            }
          }
        }
      }
      //return false if diagonalConflict didn't find true
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());