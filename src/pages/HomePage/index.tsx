import path from 'path';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import naturalSorting from '../../services/naturalSorting';
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
    // extends React's HTMLAttributes
    directory?: string; // remember to make these attributes optional....
    webkitdirectory?: string;
  }
}

export interface ICourse {
  courseTitle: string;
  lessons: IVideo[];
  id: string;
  isCompleted?: boolean;
  courseThumbnail: string;
  lastIndex?: number;
  autoPlayEnabled?: boolean;
}

export interface IVideo {
  name: string;
  path: string;
  type: string;
  isCompleted?: boolean;
  lastPosition?: number;
}

const HomePage: React.FC = () => {
  const [loadedCourseList, setLoadedCoursesList] = useState<ICourse[]>([]);

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
            name: fileName,
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

        const updatedLoadedCourse: ICourse = {
          courseTitle: folderName as string,
          lessons: formattedFiles
            .sort((a, b) => {
              return naturalSorting(a.name, b.name);
            })
            .filter(
              (file) => file.type.includes('video') || file.type.includes('pdf')
            ),
          id: courseId,
          courseThumbnail: thumbnailFile?.path as string,
        };

        localStorage.setItem(courseId, JSON.stringify(updatedLoadedCourse));

        setLoadedCoursesList((prevState) => [
          ...prevState,
          updatedLoadedCourse,
        ]);
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

  const handleStoragedCourses = () => {
    const storagedKeys = Object.keys(localStorage);
    const formattedCourses: ICourse[] = storagedKeys.map((key) => {
      const course = localStorage.getItem(key) as string;
      return JSON.parse(course);
    });

    setLoadedCoursesList(formattedCourses);
  };

  const history = useHistory();

  useEffect(() => {
    // localStorage.clear();
    localStorage.removeItem('loglevel:webpack-dev-server');
    handleStoragedCourses();
  }, []);

  return (
    <Container>
      <Toolbar>
        <Title>My courses</Title>
        <SelectCourseFolder />
      </Toolbar>

      {loadedCourseList.length > 0 ? (
        <>
          <CoursesContainer
            style={{ flexWrap: 'wrap', display: 'flex', marginTop: 32 }}
          >
            {loadedCourseList.map((course) => {
              const completedLength = course.lessons.filter(
                (lesson) => lesson.isCompleted
              ).length;

              const percentage = Math.floor(
                (completedLength / course.lessons.length) * 100
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
          <Shrug alt="thumbnail" src="./white_shrukg.png" />
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
