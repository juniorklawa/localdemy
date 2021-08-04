import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import naturalSorting from '../../services/naturalSorting';

export interface ICourse {
  courseTitle: string;
  lessons: IVideo[];
  id: string;
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

      if (files && files.length) {
        const formattedFiles: IVideo[] = [];

        files.forEach((file: IVideo) => {
          const formattedFile = {
            name: file.name,
            path: file.path,
            type: file.type,
          };

          formattedFiles.push(formattedFile);
        });

        const path = require('path');
        // Return the directries:
        const folderName = path
          .dirname(formattedFiles[0].path)
          .split(path.sep)
          .pop();

        const courseId = uuidv4();

        const updatedLoadedCourse: ICourse = {
          courseTitle: folderName,
          lessons: formattedFiles.sort((a, b) => {
            return naturalSorting(a.name, b.name);
          }),
          id: courseId,
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
      <div style={{ backgroundColor: 'blue', width: 100, color: '#fff' }}>
        <input
          style={{ display: 'none' }}
          // accept=".zip,.rar"
          ref={inputFile}
          onChange={handleFileUpload}
          type="file"
          directory=""
          webkitdirectory=""
        />
        <div className="button" onClick={onButtonClick}>
          Upload
        </div>
      </div>
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#12181B',
        margin: 0,
        flex: 1,
        padding: 0,
      }}
    >
      <button type="button">Ir para courses</button>

      <SelectCourseFolder />
      {loadedCourseList.map((course) => (
        <button
          type="button"
          key={course.id}
          onClick={() => history.push(`/course/${course.id}`)}
          style={{
            backgroundColor: '#bdbdbd',
            width: 250,
            borderRadius: 8,
            padding: 32,
            margin: 16,
          }}
        >
          <p> {course.courseTitle}</p>
        </button>
      ))}
    </div>
  );
};

export default HomePage;
