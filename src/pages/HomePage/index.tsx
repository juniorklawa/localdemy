import path from 'path';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import not_available from '../../not_available.png';
import {
  AddCourseButton,
  Container,
  CourseContainer,
  CoursesContainer,
  CourseTitle,
  EmptyListContainer,
  EmptyListLabel,
  InfoContainer,
  LoadingLabel,
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
  const [isLoading, setIsLoading] = useState(false);

  const getVideoDuration = async (file: IVideo) => {
    return new Promise((resolve) => {
      if (file?.type === 'video/mp4' && file.path) {
        const video = document.createElement('video');

        video.setAttribute('src', file?.path);

        video.onloadedmetadata = () => {
          resolve(video.duration);
        };
      } else {
        resolve(null);
      }
    });
  };

  const SelectCourseFolder = () => {
    const inputFile = useRef<HTMLInputElement>({} as HTMLInputElement);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFileUpload = async (e: any) => {
      setIsLoading(true);
      const { files } = e.target;
      if (files && files.length) {
        const formattedFiles: IVideo[] = [];

        // eslint-disable-next-line no-restricted-syntax
        for await (const file of files) {
          const fileName = file.path.substring(file.path.lastIndexOf('/') + 1);
          const formattedFile: IVideo = {
            name: fileName.replace(/\.[^/.]+$/, ''),
            path: file.path,
            type: file.type,
            duration: (await getVideoDuration(file)) as number,
          };

          formattedFiles.push(formattedFile);
        }

        const validImageTypes = [
          'image/gif',
          'image/jpeg',
          'image/png',
          'image/jpg',
        ];

        const notAvailable = {
          name: 'not_available',
          path: './not_available.png',
          type: 'image/png',
          duration: null,
        };

        const thumbnailFile = formattedFiles.find(
          (file) =>
            file.name.includes('thumbnail') &&
            validImageTypes.includes(file.type)
        );

        const foldersList = path
          .dirname(formattedFiles[0].path)
          .split(path.sep);

        const folderName =
          foldersList[
            thumbnailFile ? foldersList.length - 1 : foldersList.length - 2
          ];

        const courseId = uuidv4();

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

          console.log('allParentsFolders', allParentsFolders);
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
          modules: courseModules.sort((a, b) => {
            return naturalSorting(a.title, b.title);
          }),
          courseTitle: folderName as string,
          lastAccessedDate: new Date().getTime(),
          id: courseId,
          courseThumbnail: thumbnailFile?.path || not_available,
          videoSpeed: 1,
        };
        setIsLoading(false);

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

    const sortedFormattedCourses = formattedCourses.sort(
      (a, b) => b.lastAccessedDate - a.lastAccessedDate
    );

    dispatch(loadStoragedCourses(sortedFormattedCourses));
  }, [dispatch]);

  const history = useHistory();

  useEffect(() => {
    // localStorage.clear();

    localStorage.removeItem('loglevel:webpack-dev-server');
    try {
      handleStoragedCourses();
    } catch (err) {
      console.log(err);
    }
  }, [handleStoragedCourses]);

  if (isLoading) {
    return (
      <EmptyListContainer>
        <LoadingLabel>Loading...</LoadingLabel>
      </EmptyListContainer>
    );
  }

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
                  <Thumbnail src={course.courseThumbnail} alt="thumbnail" />
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
