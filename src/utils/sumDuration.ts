import { ICourse } from '../store/modules/catalog/types';
import secondsToHms from './secondsToHms';

const sumDuration = (currentCourse: ICourse) => {
  let seconds = 0;

  currentCourse?.modules.forEach((module) => {
    module.lessons.forEach((lesson) => {
      seconds += Math.floor(lesson.duration as number);
    });
  });

  return secondsToHms(seconds);
};

export default sumDuration;
