import React from 'react';
import { ICourse } from '../../store/modules/catalog/types';
import CourseCard from '../CourseCard';
import { CoursesContainer } from './styles';

interface CourseListProps {
  courses: ICourse[];
}

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  return (
    <CoursesContainer>
      {courses.map((course) => (
        <CourseCard course={course} key={course.id} />
      ))}
    </CoursesContainer>
  );
};

export default CourseList;
