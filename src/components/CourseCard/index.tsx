import React from 'react';
import { useHistory } from 'react-router-dom';
import { ICourse } from '../../store/modules/catalog/types';
import {
  CourseContainer,
  CourseTitle,
  InfoContainer,
  ProgressLabel,
  Thumbnail,
} from './styles';

interface CourseCardProps {
  course: ICourse;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const history = useHistory();

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

  return (
    <CourseContainer
      type="button"
      key={course.id}
      onClick={() => history.push(`/course/${course.id}`)}
    >
      <Thumbnail src={course.courseThumbnail} alt="thumbnail" />
      <InfoContainer>
        <CourseTitle> {course.courseTitle}</CourseTitle>
        <ProgressLabel>{`${percentage}% completed`}</ProgressLabel>
      </InfoContainer>
    </CourseContainer>
  );
};

export default CourseCard;
