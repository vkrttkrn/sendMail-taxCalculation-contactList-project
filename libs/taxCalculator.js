module.exports = (totalIncome, taxStep) => {
  //This line is filter for use step that totalIncome can calculate.
  const totalStep = taxStep.filter(
    (taxStep) => taxStep.initValue <= totalIncome
  );

  //This line is calculate tax.
  const result = totalStep.reduce(calStep, 0);

  const calStep = (ret, e, i) => {
    let devideValue = 0;
    //This condition is find income value for calculate tax in current step.
    if (e.targetValue == 0) {
      //If targetValue = 0 (net income more than 5 million) it will assign totalIncome to calculate.
      devideValue = totalIncome;
    } else if (totalIncome >= e.targetValue) {
      //If totalIncome more than targetValue it will assign targetValue to calculate.
      devideValue = e.targetValue;
    } else {
      //If totalIncome less than targetValue it will assign targetValue to calculate.
      devideValue = totalIncome;
    }
    //This log is explain value step by step.
    console.log(
      "Step" +
        (i + 1) +
        " calculate: " +
        totalIncome +
        " " +
        e.initValue +
        " " +
        (totalIncome - e.initValue) +
        " " +
        devideValue +
        " " +
        e.percent +
        " " +
        ret
    );

    //return value after calculate for next step or if is last step value will return data out.
    return ((devideValue - e.initValue) * e.percent) / 100 + ret;
  };

  console.log(totalStep);
  console.log(result);
  return result;
};
