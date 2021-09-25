import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Switch from 'react-switch';
import check_mark from '../../check-mark.png';
import deleteIcon from '../../delete.png';
import editing from '../../editing.png';
import left_chevron from '../../left-chevron.png';
import { IState } from '../../store';
import {
  deleteCourse,
  updateCourse,
} from '../../store/modules/catalog/actions';
import { ICourse } from '../../store/modules/catalog/types';
import { AddCourseButton } from '../HomePage/styles';
import {
  BottomTab,
  ClassContainerButton,
  ClassesContainer,
  Container,
  ContentContainer,
  CourseTitle,
  GoBackButton,
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
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const dispatch = useDispatch();
  const [modalIsOpen, setIsModalOpen] = useState(false);

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  const getProgressPercentage = () => {
    const completedLength = currentCourse.modules.reduce((acc, item) => {
      const completedModuleLength = item.lessons.filter(
        (lesson) => lesson.isCompleted
      ).length;

      return acc + completedModuleLength;
    }, 0);

    const totalLength = currentCourse.modules.reduce((acc, item) => {
      return acc + item.lessons.length;
    }, 0);

    const percentage = Math.floor((completedLength / totalLength) * 100);

    return `${percentage}%`;
  };

  const selectedCourse = useSelector<IState, ICourse>(
    (state) =>
      state.catalog.courses.find(
        (storagedCourse) => storagedCourse.id === id
      ) as ICourse
  );

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // if (selectedCourse.lastIndex) {
        //   setCurrentIndex(selectedCourse.lastIndex);
        // }

        if (selectedCourse.autoPlayEnabled) {
          setAutoPlayEnabled(true);
        }

        setCurrentCourse(selectedCourse);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, selectedCourse]);

  const markLessonAsCompleted = async (lessonIndex: number) => {
    const updatedCurrentCourseLessons = currentCourse.modules[
      currentModuleIndex
    ].lessons.map((lesson, index) => {
      if (index === lessonIndex) {
        return {
          ...lesson,
          isCompleted: true,
          lastPosition: 0,
        };
      }

      return lesson;
    });

    const updatedCurrentCourse: ICourse = {
      ...currentCourse,
      lessons: updatedCurrentCourseLessons,
      modules: currentCourse.modules.map((module, index) => {
        if (index === currentModuleIndex) {
          return {
            ...module,
            lessons: updatedCurrentCourseLessons,
          };
        }

        return module;
      }),
      lastIndex: currentIndex,
    };

    setCurrentCourse(updatedCurrentCourse);
    dispatch(updateCourse(updatedCurrentCourse));

    if (autoPlayEnabled) {
      if (currentIndex !== currentCourse.lessons.length - 1) {
        setTimeout(() => {
          setCurrentIndex((prevState) => prevState + 1);
        }, 2000);
      }
    }
  };

  const handleGoToNext = () => {
    markLessonAsCompleted(currentIndex);

    // if (currentIndex !== currentCourse.lessons.length - 1) {
    //   setCurrentIndex((prevState) => prevState + 1);
    // }
  };

  const handleAutoPlay = async (isChecked: boolean) => {
    setAutoPlayEnabled(isChecked);

    const updatedCurrentCourse: ICourse = {
      ...currentCourse,
      autoPlayEnabled: isChecked,
    };

    setCurrentCourse(updatedCurrentCourse);
    dispatch(updateCourse(updatedCurrentCourse));
  };

  const history = useHistory();

  const handleDeleteCourse = () => {
    dispatch(deleteCourse(currentCourse));
    history.push('/');
  };

  const saveLastPosition = async (e: any) => {
    const updatedCurrentCourseLessons = currentCourse.modules[
      currentModuleIndex
    ].lessons.map((lesson, index) => {
      if (index === currentIndex) {
        return {
          ...lesson,
          lastPosition: e.target.currentTime,
        };
      }

      return lesson;
    });

    const updatedCurrentCourse: ICourse = {
      ...currentCourse,
      modules: currentCourse.modules.map((module, index) => {
        if (index === currentModuleIndex) {
          return {
            ...module,
            lessons: updatedCurrentCourseLessons,
          };
        }

        return module;
      }),
      lessons: updatedCurrentCourseLessons,
      lastIndex: currentIndex,
    };

    setCurrentCourse(updatedCurrentCourse);
    dispatch(updateCourse(updatedCurrentCourse));
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

  const onButtonClick = () => {
    inputFile.current.click();
  };

  const handleFileUpload = async (event: any) => {
    const updatedCurrentCourse: ICourse = {
      ...currentCourse,
      courseThumbnail: event.target.files[0].path,
    };

    setCurrentCourse(updatedCurrentCourse);
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Container>
      <Toolbar>
        <NavigationContainer>
          <GoBackButton type="button" onClick={() => history.push('/')}>
            <Icon src={left_chevron} />
          </GoBackButton>

          <CourseTitle>{currentCourse?.courseTitle}</CourseTitle>
        </NavigationContainer>

        <OptionsContainer>
          <OptionButton type="button" onClick={() => setIsModalOpen(true)}>
            <OptionButtonLabel>Edit</OptionButtonLabel>
            <Icon src={editing} />
          </OptionButton>

          <OptionButton type="button" onClick={() => handleDeleteCourse()}>
            <OptionButtonLabel>Delete</OptionButtonLabel>
            <Icon src={deleteIcon} />
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
            <div style={{ minHeight: 810 }}>
              <video
                autoPlay={autoPlayEnabled}
                key={
                  currentCourse.modules[currentModuleIndex].lessons[
                    currentIndex
                  ].path
                }
                width="100%"
                onPause={(e) => saveLastPosition(e)}
                onEnded={() => markLessonAsCompleted(currentIndex)}
                controls
              >
                <source
                  src={`${
                    currentCourse.modules[currentModuleIndex].lessons[
                      currentIndex
                    ].path
                  }#t=${
                    currentCourse.modules[currentModuleIndex].lessons[
                      currentIndex
                    ].lastPosition || 0
                  }`}
                  type="video/mp4"
                />
              </video>
            </div>
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

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            width: '100%',
          }}
        >
          <div
            style={{
              width: '100%',
              padding: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <p style={{ fontFamily: 'OpenSans-Bold', color: '#fff' }}>
              {`Progress ${getProgressPercentage()}`}
            </p>
            <Switch
              onChange={(isChecked) => handleAutoPlay(isChecked)}
              checked={autoPlayEnabled}
            />
          </div>

          <ClassesContainer>
            {currentCourse?.modules?.map((module, moduleIndex) => {
              return (
                <div
                  style={{
                    backgroundColor: '#949494',
                    width: '100%',
                    margin: 16,
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  key={String(module.path)}
                >
                  <div style={{ padding: 36 }}>
                    <p
                      style={{
                        color: '#fff',
                        fontFamily: 'OpenSans-Bold',
                        flex: 3,
                        textAlign: 'left',
                        marginLeft: 16,
                        fontSize: 14,
                      }}
                    >
                      {module.title}
                    </p>
                  </div>

                  {module?.lessons?.map((item, i) => (
                    <ClassContainerButton
                      currentIndex={currentIndex}
                      isSelected={
                        currentIndex === i && currentModuleIndex === moduleIndex
                      }
                      lessonIndex={i}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(i);
                        setCurrentModuleIndex(moduleIndex);
                      }}
                      key={String(item.path)}
                    >
                      {module.lessons[i].isCompleted ? (
                        <div
                          style={{
                            height: 30,
                            width: 30,
                            borderRadius: 15,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#00C853',
                          }}
                        >
                          <Icon
                            style={{ height: 15, width: 15 }}
                            src={check_mark}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            height: 30,
                            width: 30,
                            borderRadius: 15,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#bdbdbd',
                          }}
                        >
                          <Icon
                            style={{ height: 15, width: 15 }}
                            src={check_mark}
                          />
                        </div>
                      )}

                      <p
                        style={{
                          color: '#fff',
                          fontFamily: 'OpenSans-Bold',
                          flex: 3,
                          textAlign: 'left',
                          marginLeft: 16,
                          fontSize: 14,
                        }}
                      >
                        {item.name}
                      </p>
                    </ClassContainerButton>
                  ))}
                </div>
              );
            })}
          </ClassesContainer>
        </div>
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

          <AddCourseButton type="button" onClick={onButtonClick}>
            <input
              style={{ display: 'none' }}
              ref={inputFile}
              onChange={async (e) => handleFileUpload(e)}
              type="file"
            />
            Add
          </AddCourseButton>

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
              dispatch(updateCourse(currentCourse));
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
