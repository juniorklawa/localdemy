import moment from 'moment';

const secondsToHms = (seconds: number) => {
  const duration = moment.duration(seconds / 60, 'minutes');

  const hh =
    duration.years() * (365 * 24) +
    duration.months() * (30 * 24) +
    duration.days() * 24 +
    duration.hours();

  const mm = duration.minutes();

  const hours = hh > 0 ? `${hh}h` : ``;

  return `${hours} ${mm}m`;
};

export default secondsToHms;
