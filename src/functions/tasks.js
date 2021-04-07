export function performTask(fx, data, bulkResults = true) {
  return new Promise(function (resolve, reject) {
    let results = [];
    if (!data.length) return reject();
    nextItem();

    function nextItem() {
      if (!data.length) return resolve(results);
      let params = data.pop();
      if (!params) {
        nextItem();
      } else {
        fx(params).then(delayNext, handleError);
      }
    }

    function handleError(result) {
      delayNext(result);
    }
    function delayNext(result) {
      if (bulkResults) results.push(result);
      nextItem();
    }
  });
}
