import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import naturalSorting from '../../services/naturalSorting';
import {
  Container,
  CourseContainer,
  CourseTitle,
  InfoContainer,
  ProgressLabel,
  Thumbnail,
} from './styles';

export interface ICourse {
  courseTitle: string;
  lessons: IVideo[];
  id: string;
  isCompleted?: boolean;
  courseThumbnail: string;
}

export interface IVideo {
  name: string;
  path: string;
  type: string;
  isCompleted?: boolean;
}

const HomePage: React.FC = () => {
  const [loadedCourseList, setLoadedCoursesList] = useState<ICourse[]>([]);

  const SelectCourseFolder = () => {
    const inputFile = useRef(null);

    const handleFileUpload = (e) => {
      const { files } = e.target;

      console.log('FILES', files);

      if (files && files.length) {
        const formattedFiles: IVideo[] = [];

        files.forEach((file: IVideo) => {
          const formattedFile = {
            name: file?.path?.match(/([^\\/]*)\/*$/)[1],
            path: file.path,
            type: file.type,
          };

          console.log(formattedFile);
          formattedFiles.push(formattedFile);
        });

        const path = require('path');
        const folderName = path
          .dirname(formattedFiles[0].path)
          .split(path.sep)
          .pop();

        const placeholderThumbNail = path.dirname('../../not_available.png');
        console.log('placeholderThumbNail', placeholderThumbNail);

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
          courseTitle: folderName,
          lessons: formattedFiles.sort((a, b) => {
            return naturalSorting(a.name, b.name);
          }),
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
      <button
        type="button"
        style={{
          backgroundColor: '#00C853',
          width: 120,
          color: '#fff',
          borderRadius: 50,
          fontFamily: 'OpenSans-Bold',
        }}
      >
        <input
          style={{ display: 'none' }}
          ref={inputFile}
          onChange={handleFileUpload}
          type="file"
          directory=""
          webkitdirectory=""
        />
        <div className="button" onClick={onButtonClick}>
          Add
        </div>
      </button>
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
      <div
        style={{
          padding: 16,
          flexDirection: 'row',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <h1 style={{ color: '#fff', fontFamily: 'OpenSans-ExtraBold' }}>
          My courses
        </h1>
        <SelectCourseFolder />
      </div>

      <div style={{ flexDirection: 'row', display: 'flex' }}>
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
      </div>
    </Container>
  );
};

export default HomePage;
