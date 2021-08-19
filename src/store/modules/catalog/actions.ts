import { ActionTypes, ICourse } from './types';

export function updateCourse(course: ICourse) {
  return {
    type: ActionTypes.updateCourse,
    payload: {
      course,
    },
  };
}

export function addNewCourse(course: ICourse) {
  return {
    type: ActionTypes.addNewCourse,
    payload: {
      course,
    },
  };
}

export function deleteCourse(course: ICourse) {
  return {
    type: ActionTypes.deleteCourse,
    payload: {
      course,
    },
  };
}

export function loadStoragedCourses(courses: ICourse[]) {
  return {
    type: ActionTypes.loadStoragedCourses,
    payload: {
      courses,
    },
  };
}
