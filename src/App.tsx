/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

interface ICourse {
  title: string;
  lessons: IVideo[];
}

interface IVideo {
  title: string;
  path: string;
  id: string;
}

const VideoPage = () => {
  const [currentCourse, setCurrentCourse] = useState<ICourse>({} as ICourse);

  const [videoList, setVideoList] = useState<IVideo[]>([
    {
      id: '1',
      path: './firestore_data_modeling_course/1.mp4',
      title: 'Introduction',
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const folderName = 'firestore_data_modeling_course';

  useEffect(() => {
    setVideoList([]);
    setCurrentCourse({
      title: 'Firestore Data Modeling',
      lessons: [],
    } as ICourse);
    const path = require('path');
    const fs = require('fs');
    // joining path of directory
    const directoryPath = path.join(__dirname, folderName);
    // passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
      // handling error
      if (err) {
        return console.log(`Unable to scan directory: ${err}`);
      }
      files.forEach((file: string) => {
        setVideoList((prevState) => [
          ...prevState,
          { title: file, path: `./${folderName}/${file}`, id: file },
        ]);
      });
    });
  }, []);

  const handleGoToNext = () => {
    setCurrentIndex((prevState) => prevState + 1);
  };

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
      <div
        style={{
          height: 50,
          width: '100%',
          backgroundColor: '#263238',
          padding: 8,
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <h2 style={{ color: '#fff', fontFamily: 'OpenSans-ExtraBold' }}>
          {currentCourse?.title}
        </h2>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <div style={{ width: '75%' }}>
          <video
            key={String(videoList[currentIndex]?.id)}
            width="100%"
            controls
          >
            <source src={videoList[currentIndex]?.path} type="video/mp4" />
          </video>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: 16,
              justifyContent: 'space-between',
              flex: 1,
              width: '100%',
            }}
          >
            <div style={{ padding: 16 }}>
              <h2 style={{ color: '#fff', fontFamily: 'OpenSans-Bold' }}>
                {`${currentIndex} ${videoList[currentIndex]?.title}`}
              </h2>
            </div>
            <button
              type="button"
              onClick={handleGoToNext}
              style={{ width: '30%', margin: 16 }}
            >
              Next
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#212121',
            width: '25%',
            height: '100vh',
            alignItems: 'center',
            borderWidth: 3,
            overflow: 'auto',
          }}
        >
          {videoList.map((item, i) => (
            <div
              onClick={() => setCurrentIndex(i)}
              style={{
                margin: 8,
                padding: 16,
                backgroundColor: currentIndex === i ? '#454E55' : '#2A2E35',
                display: 'flex',
                width: '80%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              key={String(i)}
            >
              <p style={{ color: '#fff', fontFamily: 'OpenSans-Bold' }}>
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={VideoPage} />
      </Switch>
    </Router>
  );
}
