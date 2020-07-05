import React, { useMemo } from "react";
import moment from "moment";


export default ({numQuestions,numQuestionsCompleted,width,dateBegin,dateEnd}) => {

  const percentage = useMemo(()=>(
    numQuestions && numQuestionsCompleted && ((numQuestionsCompleted / numQuestions) * 100).toFixed(2)
  ),[numQuestions, numQuestionsCompleted]);

  const percentageInfo = useMemo(()=>(
    `${percentage}% (${numQuestionsCompleted} de ${numQuestions})`
  ),[percentage]);

  const color = useMemo(()=>{
    if (percentage < 30) {
      return "bg-red";
    } else if (percentage >= 30 && percentage < 70) {
      return "bg-yellow";
    } else {
      return "bg-green";
    }  
  },[percentage])

  const widthPercentage = useMemo(()=> 
    width || 45
  ,[width])

  const dateRange = useMemo(()=>{
    const begin = dateBegin?moment(dateBegin).format("DD/MM/YYYY"):'';
    const end = dateEnd?moment(dateEnd).format("DD/MM/YYYY"):'';
    return `${begin?  begin: ''}${end? ` - ${end}`: ''}`
  },[dateBegin, dateEnd])

  return (
    <div style={{ width: widthPercentage + "%" }}>
      <div className="clearfix">
        <div className="float-left">
          <strong>{`${percentageInfo}`}</strong>
        </div>
        <div className="float-right">
          <small className="text-muted">
            {dateRange}
          </small>
        </div>
      </div>
      <div className="progress progress-xs">
        <div
          className={("progress-bar", color)}
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
