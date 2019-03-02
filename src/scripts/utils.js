
  const getCurrentDateArray = () => {
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    return [year, month, date];
  };

  export const goBackInTimeOneMonth = (dateArray) => {
    const monthMinusOne = dateArray.map((n, index) => {
      return index === 1 ? n - 1 : n;
    });
    if (monthMinusOne[1] === 0) {
      const yearAdjustedArray = monthMinusOne.map((n, index) => {
        if (index === 0) { return n - 1; }
        if (index === 1) { return n = 12; }
        else return n;
      });
      return yearAdjustedArray;
    } else return monthMinusOne;
  };

  const goForwardInTimeOneMonth = (dateArray) => {
    const monthPlusOne = dateArray.map((n, index) => {
      return index === 1 ? n + 1 : n;
    });
    if (monthPlusOne[1] === 13) {
      const yearAdjustedArray = monthPlusOne.map((n, index) => {
        if (index === 0) { return n + 1; }
        if (index === 1) { return n = 1; }
        else return n;
      });
      return yearAdjustedArray;
    } else return monthPlusOne;
  };

  const dateToHyphenString = (dateArray) => {
    let year = dateArray[0];
    let month = dateArray[1];
    let date = dateArray[2];
    if (month < 10) {
      month = `0${month}`;
    }
    if (date < 10) {
      date = `0${date}`;
    }
    // TODO actual date handling by month
    if (date > 28) {
      date = 28;
    }
    return `${year}-${month}-${date}`;
  };

  export const utils = {
    getCurrentDateArray,
    goBackInTimeOneMonth,
    goForwardInTimeOneMonth,
    dateToHyphenString
  };



