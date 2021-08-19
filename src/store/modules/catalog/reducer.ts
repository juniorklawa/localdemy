/* eslint-disable consistent-return */
import produce from 'immer';
import { WritableDraft } from 'immer/dist/types/types-external';
import { Reducer } from 'redux';
import { ActionTypes, ICatalogState } from './types';

const INITAL_STATE: ICatalogState = {
  courses: [],
};

const catalog: Reducer<ICatalogState> = (state = INITAL_STATE, action) => {
  return produce(state, (draft): void | WritableDraft<ICatalogState> => {
    switch (action.type) {
      case ActionTypes.addNewCourse: {
        const { course } = action.payload;
        draft.courses.push(course);

        localStorage.setItem(course.id, JSON.stringify(course));
        break;
      }

      case ActionTypes.updateCourse: {
        const { course } = action.payload;

        const courseId = draft.courses.findIndex(
          (draftCourse) => draftCourse.id === course.id
        );

        draft.courses[courseId] = course;
        localStorage.setItem(course.id, JSON.stringify(course));
        break;
      }

      case ActionTypes.deleteCourse: {
        const { course } = action.payload;

        const currentCourses = draft.courses;
        draft.courses = currentCourses.filter(
          (currentCourse) => currentCourse.id !== course.id
        );
        console.log(course.id);
        localStorage.removeItem(course.id);

        break;
      }

      case ActionTypes.loadStoragedCourses: {
        const { courses } = action.payload;
        draft.courses = courses;

        break;
      }

      default: {
        return draft;
      }
    }
  });
};

export default catalog;
