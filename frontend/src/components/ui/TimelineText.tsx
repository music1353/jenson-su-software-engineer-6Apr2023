import React from "react";
import DateUtil from "utils/DataUtil";


interface Props {
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  isPresent: boolean;
}

const TimelineText: React.FC<Props> = ({ startMonth, startYear, endMonth, endYear, isPresent }) => {
  const startMonthName = DateUtil.getMonthName(startMonth);
  const endMonthName = DateUtil.getMonthName(endMonth);
  const duration = DateUtil.getDuration(startYear, startMonth, endYear, endMonth, isPresent)

  return (
    <div>
      {startMonthName} {startYear}
      <span> - </span>
      {isPresent ? "Present" : `${endMonthName} ${endYear}`}
      {duration ? " · " : ""}
      {duration}
    </div>
  )
}

export default TimelineText;