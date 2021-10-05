import { ICourse } from '../store/modules/catalog/types';

const getProgressPercentage = (course: ICourse) => {
  const completedLength = course.modules.reduce((acc, item) => {
    const completedModuleLength = item.lessons.filter(
      (lesson) => lesson.isCompleted
    ).length;

    return acc + completedModuleLength;
  }, 0);

  const totalLength = course.modules.reduce((acc, item) => {
    return acc + item.lessons.length;
  }, 0);

  const percentage = Math.floor((completedLength / totalLength) * 100);

  return percentage;
};

export default getProgressPercentage;
