const { BadRequestError } = require("../expressError");

/**
 * Helper for making selective update queries.
 *
 * The calling function can use it to make the SET clause of an SQL UPDATE
 * statement.
 *
 * @param dataToUpdate {Object} {field1: newVal, field2: newVal, ...}
 * @param jsToSql {Object} maps js-style data fields to database column names,
 *   like { firstName: "first_name", age: "age" }
 *
 * @returns {Object} {sqlSetCols, dataToUpdate}
 *
 * @example {firstName: 'Aliya', age: 32} =>
 *   { setCols: '"first_name"=$1, "age"=$2',
 *     values: ['Aliya', 32] }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

/** sqlForPartialInsert helper function
 * Helper for making selective insert statements.
 * The calling function can use it to make the INSERT and VALUES clause.
 * 
 * Parameters:
 * dataToInsert: obj - {field: val, field2: val, ...}
 * jsToSql: obj - maps js-style data fields to database column names {camelCase: col_name, ...}
 * 
 * Returns: obj - { insertColumns, valuesIndecies }
 */
function sqlForPartialInsert(dataToInsert, jsToSql) {
  // create keys array from dataToInsert
  const keys = Object.keys(dataToInsert);

  // if no data throw BadRequestError
  // if( keys.length === 0 ) throw new BadRequestError("No data");

  // create arrays to store the converted column names and there variable indexes;
  const cols = [];
  const valIdxArr = [];

  // iterate through keys and push values to respective arrays
  keys.forEach((colName, idx) => {
      // convert if necessary
      let properCol = jsToSql[colName] ? jsToSql[colName] : colName;
      let valIdx = "$" + (idx + 1);
      // push values to arrays
      cols.push(properCol);
      valIdxArr.push(valIdx);
  });

  // console.log("columns: ", cols.join(', '));
  // console.log("indecies: ", valIdxArr.join(', '));
  // console.log("values: ", Object.values(dataToInsert));

  return {
      insertColumns: cols.join(', '),
      valuesIndecies: valIdxArr.join(', '),
      values: Object.values(dataToInsert)
  }
}

module.exports = { sqlForPartialUpdate, sqlForPartialInsert };
