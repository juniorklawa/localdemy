export enum ActionTypes {
  updateCourse = 'UPDATE_COURSE',
  addNewCourse = 'ADD_NEW_COURSE',
  deleteCourse = 'DELETE_COURSE',
  loadStoragedCourses = 'LOAD_STORAGED_COURSES',
}

export interface ICatalogState {
  courses: ICourse[];
}

export interface ICourse {
  courseTitle: string;
  modules: IModule[];
  id: string;
  isCompleted?: boolean;
  courseThumbnail: string;
  lastIndex?: number;
  lastModuleIndex?: number;
  autoPlayEnabled?: boolean;
}

export interface IVideo {
  name: string;
  path: string;
  type: string;
  isCompleted?: boolean;
  duration?: number | null;
  lastPosition?: number;
}

export interface IModule {
  title: string;
  lessons: IVideo[];
  sectionActive: boolean;
}
