import { csvParse } from 'd3';

export function CSV2JSON(file_content) {
  let rows = [];
  csvParse(file_content, function(row) { 
     let obj = {};
     Object.keys(row).forEach(key => { if (key && key.trim()) obj[key.trim()] = row[key] ? row[key].trim() : ''; }); 
     rows.push(obj);
  });
  return rows;
}
