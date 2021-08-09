import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Switch from 'react-switch';
import asyncLocalStorage from '../../services/asyncLocalStorage';
import { ICourse } from '../HomePage';

interface IRouteParams {
  id: string;
}

const CoursePage = () => {
  const [currentCourse, setCurrentCourse] = useState<ICourse>({} as ICourse);
  const { id } = useParams<IRouteParams>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const loadedCourse = await asyncLocalStorage.getItem(id);

        const parsedCourse: ICourse = JSON.parse(loadedCourse as string);

        if (parsedCourse.lastIndex) {
          setCurrentIndex(parsedCourse.lastIndex);
        }

        if (parsedCourse.autoPlayEnabled) {
          setAutoPlayEnabled(true);
        }

        setCurrentCourse(parsedCourse);

        console.log(parsedCourse);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const markLessonAsCompleted = async (lessonIndex: number) => {
    const updatedCurrentCourseLessons = currentCourse.lessons.map(
      (lesson, index) => {
        if (index === lessonIndex) {
          return {
            ...lesson,
            isCompleted: true,
            lastPosition: 0,
          };
        }

        return lesson;
      }
    );

    const updatedCurrentCourse: ICourse = {
      ...currentCourse,
      lessons: updatedCurrentCourseLessons,
      lastIndex: currentIndex,
    };

    setCurrentCourse(updatedCurrentCourse);
    await asyncLocalStorage.setItem(
      updatedCurrentCourse.id,
      JSON.stringify(updatedCurrentCourse)
    );

    if (currentIndex !== currentCourse.lessons.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prevState) => prevState + 1);
      }, 2000);
    }
  };

  const handleGoToNext = () => {
    markLessonAsCompleted(currentIndex);

    if (currentIndex !== currentCourse.lessons.length - 1) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  const handleAutoPlay = async (isChecked: boolean) => {
    setAutoPlayEnabled(isChecked);

    const updatedCurrentCourse: ICourse = {
      ...currentCourse,
      autoPlayEnabled: isChecked,
    };

    setCurrentCourse(updatedCurrentCourse);
    await asyncLocalStorage.setItem(
      updatedCurrentCourse.id,
      JSON.stringify(updatedCurrentCourse)
    );
  };

  const history = useHistory();

  const handleDeleteCourse = () => {
    localStorage.removeItem(id);
    history.push('/');
  };

  const saveLastPosition = async (e) => {
    const updatedCurrentCourseLessons = currentCourse.lessons.map(
      (lesson, index) => {
        if (index === currentIndex) {
          return {
            ...lesson,
            lastPosition: e.target.currentTime,
          };
        }

        return lesson;
      }
    );

    const updatedCurrentCourse: ICourse = {
      ...currentCourse,
      lessons: updatedCurrentCourseLessons,
      lastIndex: currentIndex,
    };

    setCurrentCourse(updatedCurrentCourse);
    await asyncLocalStorage.setItem(
      updatedCurrentCourse.id,
      JSON.stringify(updatedCurrentCourse)
    );
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        flex: 1,
        padding: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: '#263238',
        }}
      >
        <button type="button" onClick={() => history.push('/')}>
          <img
            style={{
              height: 24,
              width: 24,
            }}
            src="./left-chevron.png"
            alt="thumbnail"
          />
        </button>

        <div
          style={{
            height: 50,
            width: '100%',
            backgroundColor: '#263238',
            padding: 8,
            alignItems: 'center',
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <h2 style={{ color: '#fff', fontFamily: 'OpenSans-ExtraBold' }}>
            {currentCourse?.courseTitle}
          </h2>
        </div>

        <button
          style={{ marginRight: 320 }}
          type="button"
          onClick={() => handleDeleteCourse()}
        >
          Edit
        </button>

        <button type="button" onClick={() => handleDeleteCourse()}>
          Deletar
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <div style={{ width: '75%', height: '100%' }}>
          {currentCourse.lessons[currentIndex].type === 'application/pdf' ? (
            <div>
              <iframe
                src={currentCourse.lessons[currentIndex].path}
                frameBorder="0"
                height={740}
                width="100%"
                title="pdf"
              />
            </div>
          ) : (
            <video
              autoPlay={autoPlayEnabled}
              key={currentCourse.lessons[currentIndex].path}
              width="100%"
              onPause={(e) => saveLastPosition(e)}
              onEnded={() => markLessonAsCompleted(currentIndex)}
              controls
            >
              <source
                src={`${currentCourse.lessons[currentIndex].path}#t=${
                  currentCourse.lessons[currentIndex].lastPosition || 0
                }`}
                type="video/mp4"
              />
            </video>
          )}

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
                {`${
                  currentCourse?.lessons[currentIndex].name.split('.mp4')[0]
                }`}
              </h2>
            </div>
            <button
              type="button"
              onClick={handleGoToNext}
              style={{
                margin: 16,
                padding: 16,
                color: '#fff',
                backgroundColor: '#00C853',
                borderRadius: 10,
                fontFamily: 'OpenSans-SemiBold',
              }}
            >
              Finish and go to Next
            </button>

            <Switch
              onChange={(isChecked) => handleAutoPlay(isChecked)}
              checked={autoPlayEnabled}
            />
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
          {currentCourse?.lessons?.map((item, i) => (
            <button
              type="button"
              onClick={() => setCurrentIndex(i)}
              style={{
                margin: 8,
                padding: 16,
                backgroundColor: currentIndex === i ? '#454E55' : '#2A2E35',
                display: 'flex',
                width: '80%',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}
              key={String(i)}
            >
              {currentCourse.lessons[i].isCompleted ? (
                <div
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    backgroundColor: 'green',
                  }}
                />
              ) : (
                <div
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    backgroundColor: '#bdbdbd',
                  }}
                />
              )}

              <p
                style={{ color: '#fff', fontFamily: 'OpenSans-Bold', flex: 3 }}
              >
                {item.name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
