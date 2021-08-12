import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Switch from 'react-switch';
import asyncLocalStorage from '../../services/asyncLocalStorage';
import { ICourse } from '../HomePage';
import { AddCourseButton } from '../HomePage/styles';
import {
  BottomTab,
  ClassesContainer,
  Container,
  ContentContainer,
  CourseTitle,
  GoBackButton,
  GoBackIcon,
  Icon,
  LessonTitle,
  NavigationContainer,
  OptionButton,
  OptionButtonLabel,
  OptionsContainer,
  StyledModal,
  Toolbar,
  VideoContainer,
} from './styles';

interface IRouteParams {
  id: string;
}

const CoursePage = () => {
  const [currentCourse, setCurrentCourse] = useState<ICourse>({} as ICourse);
  const { id } = useParams<IRouteParams>();
  const inputFile = useRef<HTMLInputElement>({} as HTMLInputElement);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);

  const [modalIsOpen, setIsModalOpen] = useState(false);

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

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

  const handleOnInputLessonNameChange = async (e: any, lessonPath: string) => {
    console.log(e.target.value);

    const updatedCurrentCourseLessons = currentCourse.lessons.map((lesson) => {
      if (lesson.path === lessonPath) {
        return {
          ...lesson,
          name: e.target.value,
        };
      }

      return lesson;
    });

    const updatedCurrentCourse: ICourse = {
      ...currentCourse,
      lessons: updatedCurrentCourseLessons,
      lastIndex: currentIndex,
    };

    setCurrentCourse(updatedCurrentCourse);
  };

  const saveCurrentCourse = async () => {
    await asyncLocalStorage.setItem(
      currentCourse.id,
      JSON.stringify(currentCourse)
    );
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  const handleFileUpload = (event: any) => {
    console.log(event.target.files[0]);
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Container>
      <Toolbar>
        <NavigationContainer>
          <GoBackButton type="button" onClick={() => history.push('/')}>
            <Icon src="./left-chevron.png" />
          </GoBackButton>

          <CourseTitle>{currentCourse?.courseTitle}</CourseTitle>
        </NavigationContainer>

        <OptionsContainer>
          <OptionButton type="button" onClick={() => setIsModalOpen(true)}>
            <OptionButtonLabel>Edit</OptionButtonLabel>
            <Icon src="./editing.png" />
          </OptionButton>

          <OptionButton type="button" onClick={() => handleDeleteCourse()}>
            <OptionButtonLabel>Delete</OptionButtonLabel>
            <Icon src="./delete.png" />
          </OptionButton>
        </OptionsContainer>
      </Toolbar>

      <ContentContainer>
        <VideoContainer>
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

          <BottomTab>
            <LessonTitle>
              {`${currentCourse?.lessons[currentIndex].name.split('.mp4')[0]}`}
            </LessonTitle>
            <button
              type="button"
              onClick={handleGoToNext}
              style={{
                padding: 16,
                color: '#fff',
                backgroundColor: '#00C853',
                borderRadius: 10,
                fontFamily: 'OpenSans-SemiBold',
              }}
            >
              Finish and go to Next
            </button>
          </BottomTab>
        </VideoContainer>

        <ClassesContainer>
          <Switch
            onChange={(isChecked) => handleAutoPlay(isChecked)}
            checked={autoPlayEnabled}
          />

          {currentCourse?.lessons?.map((item, i) => (
            <button
              type="button"
              onClick={() => setCurrentIndex(i)}
              style={{
                margin: 4,
                padding: 16,
                backgroundColor: currentIndex === i ? '#454E55' : '#2A2E35',
                display: 'flex',
                width: '100%',
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
        </ClassesContainer>
      </ContentContainer>

      <StyledModal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Example Modal"
      >
        <div
          style={{
            backgroundColor: '#fff',
            width: '50%',
            padding: 32,
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <button type="button" onClick={() => setIsModalOpen(false)}>
            close
          </button>

          <p>Course title</p>

          <input
            onChange={(e) =>
              setCurrentCourse((prevState) => ({
                ...prevState,
                courseTitle: e.target.value,
              }))
            }
            style={{ margin: 8 }}
            value={currentCourse.courseTitle}
          />

          <p>Course thumbanil</p>

          <img
            style={{ width: '25%', marginTop: 16 }}
            src={currentCourse.courseThumbnail}
            alt="course thumbanil"
          />

          <button
            style={{ alignSelf: 'flex-start' }}
            type="button"
            onClick={() => onButtonClick()}
          >
            <input
              ref={inputFile}
              onChange={(e) => handleFileUpload(e)}
              type="file"
              name="file"
            />
          </button>

          <p style={{ marginTop: 16 }}>Course lessons</p>

          {currentCourse.lessons.map((lesson) => (
            <input
              onChange={(e) => handleOnInputLessonNameChange(e, lesson.path)}
              key={lesson.path}
              style={{ margin: 8 }}
              value={lesson.name}
            />
          ))}

          <button
            type="button"
            onClick={async () => {
              saveCurrentCourse();
              setIsModalOpen(false);
            }}
          >
            save
          </button>
        </div>
      </StyledModal>
    </Container>
  );
};

export default CoursePage;
