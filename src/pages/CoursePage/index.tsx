import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import RLDD, { RLDDItem } from 'react-list-drag-and-drop/lib/RLDD';
import asyncLocalStorage from '../../services/asyncLocalStorage';
import { ICourse, IVideo } from '../HomePage';

interface IRouteParams {
  id: string;
}

const CoursePage = () => {
  const [currentCourse, setCurrentCourse] = useState<ICourse>({} as ICourse);
  const { id } = useParams<IRouteParams>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const loadedCourse = await asyncLocalStorage.getItem(id);

        const parsedCourse: ICourse = JSON.parse(loadedCourse as string);

        const updatedLessons: IVideo[] = parsedCourse?.lessons.map(
          (lesson, i) => ({
            ...lesson,
            id: i,
          })
        );

        setCurrentCourse({
          id: parsedCourse.id,
          courseTitle: parsedCourse.courseTitle,
          lessons: updatedLessons,
        } as ICourse);

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
          };
        }

        return lesson;
      }
    );

    const updatedCurrentCourse: ICourse = {
      ...currentCourse,
      lessons: updatedCurrentCourseLessons,
    };

    setCurrentCourse(updatedCurrentCourse);
    await asyncLocalStorage.setItem(
      updatedCurrentCourse.id,
      JSON.stringify(updatedCurrentCourse)
    );
  };

  const handleGoToNext = () => {
    markLessonAsCompleted(currentIndex);
    setCurrentIndex((prevState) => prevState + 1);
  };

  const history = useHistory();

  const handleDeleteCourse = () => {
    localStorage.removeItem(id);
    history.push('/');
  };

  function handleRLDDChange(reorderedItems: Array<any>) {
    // console.log('Example.handleRLDDChange');
    setCurrentCourse((prevState) => ({
      ...prevState,
      lessons: reorderedItems,
    }));
  }

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
              />
            </div>
          ) : (
            <video
              key={currentCourse.lessons[currentIndex].path}
              width="100%"
              onEnded={() => markLessonAsCompleted(currentIndex)}
              controls
            >
              <source
                src={currentCourse.lessons[currentIndex].path}
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
          <RLDD
            items={currentCourse?.lessons}
            itemRenderer={(item, i) => {
              return (
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

                  <p style={{ color: '#fff', fontFamily: 'OpenSans-Bold' }}>
                    {item.name}
                  </p>
                </button>
              );
            }}
            onChange={(items) => handleRLDDChange(items)}
          />

          {/* {currentCourse?.lessons?.map((item, i) => (
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

              <p style={{ color: '#fff', fontFamily: 'OpenSans-Bold' }}>
                {item.name}
              </p>
            </button>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
