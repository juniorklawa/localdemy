import React, { useEffect, useRef, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const HomePage: React.FC = () => {
  interface IVideo {
    name: string;
    path: string;
    type: string;
  }

  interface ICourse {
    courseTitle: string;
    files: IVideo[];
    id: string;
  }

  const [loadedCourse, setLoadedCourses] = useState({} as ICourse);

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

        console.log('FolderName', folderName);
        const updatedLoadedCourse: ICourse = {
          courseTitle: folderName,
          files: formattedFiles,
          id: uuidv4(),
        };

        // setLoadedFiles(formattedFiles);
        console.log('updatedLoadedCourse', updatedLoadedCourse);

        localStorage.setItem(
          `@course/abc`,
          JSON.stringify(updatedLoadedCourse)
        );

        console.log('salvo');
      }
    };

    const onButtonClick = () => {
      inputFile.current.click();
    };

    return (
      <div>
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
      const course: ICourse = localStorage.getItem(key);
      console.log(course);
      return course;
    });
    // console.log(formattedCourses.filter((course) => ));
    setLoadedCoursesList(formattedCourses.filter((course) => course.id));
  };

  useEffect(() => {
    // localStorage.clear();
    handleStoragedCourses();
  }, []);

  return (
    <div>
      {/* <button type="button" onClick={() => history.push('/course')}>
        Ir para courses
      </button> */}
      <Link to="/course">CoursePage</Link>

      <SelectCourseFolder />

      {loadedCourseList.map((course) => (
        <p key={course.id}> {course.courseTitle}</p>
      ))}
    </div>
  );
};

export default HomePage;
