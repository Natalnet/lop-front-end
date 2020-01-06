import React from "react";
import {formatDate} from '../../../util/auxiliaryFunctions.util'

export default props => {
  let {numQuestions,numQuestionsCompleted,width,dateBegin,dateEnd} = props
  const percentage = numQuestions && numQuestionsCompleted && (
    (numQuestionsCompleted / numQuestions) *
    100
  ).toFixed(2)
  let cor; 
  if (percentage < 30) {
    cor = "bg-red";
  } else if (percentage >= 30 && percentage < 70) {
    cor = "bg-yellow";
  } else {
    cor = "bg-green";
  }

  let largura;
  if (width) {
    largura = width;
  } else {
    largura = 45;
  }


  return (
    <div style={{ width: largura + "%" }}>
      <div className="clearfix">
        <div className="float-left">
          <strong>{`${percentage}% (${numQuestionsCompleted} de ${numQuestions})`}</strong>
        </div>
        <div className="float-right">
          <small className="text-muted">
            {dateBegin?formatDate(dateBegin).split(' - ')[0]:''}
            {dateEnd?` - ${formatDate(dateEnd).split(' - ')[0]}`:''}
          </small>
        </div>
      </div>
      <div className="progress progress-xs">
        <div
          className={("progress-bar", cor)}
          role="progressbar"
          style={{ width: percentage + "%" }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};
