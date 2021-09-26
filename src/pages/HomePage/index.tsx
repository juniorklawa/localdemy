import path from 'path';
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import naturalSorting from '../../services/naturalSorting';
import { IState } from '../../store';
import {
  addNewCourse,
  loadStoragedCourses,
} from '../../store/modules/catalog/actions';
import { ICourse, IModule, IVideo } from '../../store/modules/catalog/types';
import white_shrug from '../../white_shrukg.png';
import {
  AddCourseButton,
  Container,
  CourseContainer,
  CoursesContainer,
  CourseTitle,
  EmptyListContainer,
  EmptyListLabel,
  InfoContainer,
  ProgressLabel,
  Shrug,
  Thumbnail,
  Title,
  Toolbar,
} from './styles';

declare module 'react' {
  interface HTMLAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}

const HomePage: React.FC = () => {
  const courses = useSelector<IState, ICourse[]>(
    (state) => state.catalog.courses
  );

  const dispatch = useDispatch();

  const SelectCourseFolder = () => {
    const inputFile = useRef<HTMLInputElement>({} as HTMLInputElement);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFileUpload = (e: any) => {
      const { files } = e.target;
      if (files && files.length) {
        const formattedFiles: IVideo[] = [];
        files.forEach((file: IVideo) => {
          const fileName = file.path.substring(file.path.lastIndexOf('/') + 1);
          const formattedFile = {
            name: fileName.replace(/\.[^/.]+$/, ''),
            path: file.path,
            type: file.type,
          };

          formattedFiles.push(formattedFile);
        });
        const folderName = path
          .dirname(formattedFiles[0].path)
          .split(path.sep)
          .pop();
        const courseId = uuidv4();
        const validImageTypes = [
          'image/gif',
          'image/jpeg',
          'image/png',
          'image/jpg',
        ];
        const thumbnailFile = formattedFiles.find(
          (file) =>
            file.name.includes('thumbnail') &&
            validImageTypes.includes(file.type)
        );

        const sortedFormatedFiles = formattedFiles
          .sort((a, b) => {
            return naturalSorting(a.name, b.name);
          })
          .filter((file) => file.type.includes('video'));

        const courseModules: IModule[] = [];

        sortedFormatedFiles.forEach((formattedFile) => {
          const allParentsFolders = path
            .dirname(formattedFile.path)
            .split(path.sep);

          const courseTitleIndex = allParentsFolders.findIndex(
            (file) => file === folderName
          );

          const parentFolderName = allParentsFolders[courseTitleIndex + 1];

          const moduleExists = courseModules.find(
            (module) => module.title === parentFolderName
          );

          if (!moduleExists) {
            courseModules.push({
              title: parentFolderName,
              lessons: [formattedFile],
              sectionActive: true,
            });
            return;
          }

          moduleExists.lessons.push(formattedFile);
        });

        const updatedLoadedCourse: ICourse = {
          modules: courseModules,
          courseTitle: folderName as string,

          id: courseId,
          courseThumbnail: thumbnailFile?.path as string,
        };

        dispatch(addNewCourse(updatedLoadedCourse));
      }
    };

    const onButtonClick = () => {
      inputFile.current.click();
    };

    return (
      <AddCourseButton type="button" onClick={onButtonClick}>
        <input
          style={{ display: 'none' }}
          ref={inputFile}
          onChange={(e) => handleFileUpload(e)}
          type="file"
          directory=""
          webkitdirectory=""
        />
        Add
      </AddCourseButton>
    );
  };

  const handleStoragedCourses = useCallback(() => {
    const storagedKeys = Object.keys(localStorage);
    const formattedCourses: ICourse[] = storagedKeys.map((key) => {
      const course = localStorage.getItem(key) as string;
      return JSON.parse(course);
    });

    dispatch(loadStoragedCourses(formattedCourses));
  }, [dispatch]);

  const history = useHistory();

  useEffect(() => {
    // localStorage.clear();
    localStorage.removeItem('loglevel:webpack-dev-server');
    handleStoragedCourses();
  }, [handleStoragedCourses]);

  return (
    <Container>
      <Toolbar>
        <Title>My courses</Title>
        <SelectCourseFolder />
      </Toolbar>

      {courses.length > 0 ? (
        <>
          <CoursesContainer
            style={{ flexWrap: 'wrap', display: 'flex', marginTop: 32 }}
          >
            {courses.map((course) => {
              const completedLength = course.modules.reduce((acc, item) => {
                const completedModuleLength = item.lessons.filter(
                  (lesson) => lesson.isCompleted
                ).length;

                return acc + completedModuleLength;
              }, 0);

              const totalLength = course.modules.reduce((acc, item) => {
                return acc + item.lessons.length;
              }, 0);

              const percentage = Math.floor(
                (completedLength / totalLength) * 100
              );

              return (
                <CourseContainer
                  type="button"
                  key={course.id}
                  onClick={() => history.push(`/course/${course.id}`)}
                >
                  <Thumbnail
                    src={course.courseThumbnail || `./not_available.png`}
                    alt="thumbnail"
                  />
                  <InfoContainer>
                    <CourseTitle> {course.courseTitle}</CourseTitle>
                    <ProgressLabel>{`${percentage}% concluido`}</ProgressLabel>
                  </InfoContainer>
                </CourseContainer>
              );
            })}
          </CoursesContainer>
        </>
      ) : (
        <EmptyListContainer>
          <Shrug alt="thumbnail" src={white_shrug} />
          <EmptyListLabel>
            Looks like you haven't added any courses yet, press the green button
            to add the first one!
          </EmptyListLabel>
        </EmptyListContainer>
      )}
    </Container>
  );
};

export default HomePage;
