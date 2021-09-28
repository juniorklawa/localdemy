import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Checkbox from 'react-simple-checkbox';
import deleteIcon from '../../delete.png';
import down_chevron from '../../down-chevron.png';
import play_button from '../../play-button.png';
import editing from '../../editing.png';
import left_chevron from '../../left-chevron.png';
import { IState } from '../../store';
import {
  deleteCourse,
  updateCourse,
} from '../../store/modules/catalog/actions';
import { ICourse } from '../../store/modules/catalog/types';
import up_chevron from '../../up-chevron.png';
import { AddCourseButton } from '../HomePage/styles';
import {
  BottomTab,
  ClassContainerButton,
  ClassesContainer,
  ClassSubContainerButton,
  Container,
  ContentContainer,
  CourseTitle,
  GoBackButton,
  Icon,
  LessonTitle,
  ModuleContainerButton,
  NavigationContainer,
  OptionButton,
  OptionButtonLabel,
  PlayIcon,
  StyledModal,
  ToggleIcon,
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
        console.log('salve', selectedCourse);

        setCurrentIndex(selectedCourse.lastIndex || 0);
        setCurrentModuleIndex(selectedCourse.lastModuleIndex || 0);

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
  }, [id]);

  const handleGoToNextLesson = () => {
    if (
      currentIndex ===
        currentCourse.modules[currentModuleIndex].lessons.length - 1 &&
      currentModuleIndex === currentCourse.modules.length - 1
    ) {
      return null;
    }

    if (
      currentIndex !==
      currentCourse.modules[currentModuleIndex].lessons.length - 1
    ) {
      return setCurrentIndex((prevState) => prevState + 1);
    }
    setCurrentIndex(0);
    return setCurrentModuleIndex((prevState) => prevState + 1);
  };

  const handleCheckLesson = async (
    lessonIndex: number,
    alwaysAstrue = false
  ) => {
    const updatedCurrentCourseLessons = currentCourse.modules[
      currentModuleIndex
    ].lessons.map((lesson, index) => {
      if (index === lessonIndex) {
        return {
          ...lesson,
          isCompleted: alwaysAstrue
            ? true
            : !currentCourse.modules[currentModuleIndex].lessons[lessonIndex]
                .isCompleted,
          lastPosition: 0,
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
      lastIndex: currentIndex,
      lastModuleIndex: currentModuleIndex,
    };

    setCurrentCourse(updatedCurrentCourse);
    dispatch(updateCourse(updatedCurrentCourse));
  };

  const handleGoToNext = () => {
    handleCheckLesson(currentIndex, true);
    handleGoToNextLesson();
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
      lastIndex: currentIndex,
      lastModuleIndex: currentModuleIndex,
    };

    setCurrentCourse(updatedCurrentCourse);
    dispatch(updateCourse(updatedCurrentCourse));
  };

  const handleOnInputModuleNameChange = async (e: any, moduleIndex: number) => {
    const updatedCurrentCourseModule = currentCourse.modules.map(
      (item, index) => {
        if (index === moduleIndex) {
          return {
            ...item,
            title: e.target.value,
          };
        }

        return item;
      }
    );

    const updatedCurrentCourse: ICourse = {
      ...currentCourse,
      modules: updatedCurrentCourseModule,
      lastIndex: currentIndex,
      lastModuleIndex: currentModuleIndex,
    };

    setCurrentCourse(updatedCurrentCourse);
  };

  const handleOnInputLessonNameChange = async (
    e: any,
    lessonPath: string,
    moduleIndex: number
  ) => {
    const updatedCurrentCourseLessons = currentCourse.modules[
      moduleIndex
    ].lessons.map((lesson) => {
      if (lesson.path === lessonPath) {
        return {
          ...lesson,
          name: e.target.value,
        };
      }

      return lesson;
    });

    const updatedModules = currentCourse.modules.map((module, index) => {
      if (index === moduleIndex) {
        return {
          ...module,
          lessons: updatedCurrentCourseLessons,
        };
      }

      return module;
    });

    const updatedCurrentCourse: ICourse = {
      ...currentCourse,
      modules: updatedModules,
      lastIndex: currentIndex,
      lastModuleIndex: currentModuleIndex,
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

  const handleToggle = (moduleIndex: number) => {
    const updatedModules = currentCourse.modules.map((item, index) => {
      if (index === moduleIndex) {
        return {
          ...item,
          sectionActive: !item.sectionActive,
        };
      }

      return item;
    });

    const updatedCourse: ICourse = {
      ...currentCourse,
      modules: updatedModules,
    };

    setCurrentCourse(updatedCourse);
  };

  function secondsToHms(d: any) {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);

    const hDisplay = h > 0 ? `${h}h ` : '';
    const mDisplay = m > 0 ? `${m}m` : '';
    return hDisplay + mDisplay;
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Container>
      <ContentContainer>
        <div
          style={{
            height: '5%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            // justifyContent: 'center',
          }}
        >
          <NavigationContainer>
            <GoBackButton type="button" onClick={() => history.push('/')}>
              <Icon src={left_chevron} />
            </GoBackButton>

            <CourseTitle>{currentCourse?.courseTitle}</CourseTitle>
          </NavigationContainer>
        </div>
        <VideoContainer>
          <div style={{ minHeight: 820 }}>
            <video
              autoPlay={autoPlayEnabled}
              key={
                currentCourse.modules[currentModuleIndex].lessons[currentIndex]
                  .path
              }
              width="100%"
              onPause={(e) => saveLastPosition(e)}
              onEnded={() => handleCheckLesson(currentIndex, true)}
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

          <div>
            <BottomTab>
              <LessonTitle>
                {`${
                  currentCourse?.modules[currentModuleIndex].lessons[
                    currentIndex
                  ].name.split('.mp4')[0]
                }`}
              </LessonTitle>
              <button
                type="button"
                onClick={handleGoToNext}
                style={{
                  color: '#fff',
                  backgroundColor: '#00C853',
                  borderRadius: 10,
                  marginTop: 8,
                  marginRight: 16,
                  paddingRight: 16,
                  paddingLeft: 16,
                  height: 50,
                  fontFamily: 'OpenSans-SemiBold',
                }}
              >
                Finish and go to Next
              </button>
            </BottomTab>

            <div style={{ marginTop: 4, marginLeft: 16 }}>
              <h3
                style={{
                  fontFamily: 'OpenSans-Bold',
                  color: '#BDBDBD',
                  marginTop: 12,
                }}
              >
                About this course
              </h3>
              <p
                style={{
                  fontFamily: 'OpenSans-Regular',
                  color: '#BDBDBD',
                  marginTop: 8,
                  fontSize: 12,
                }}
              >
                {`Classes: ${currentCourse.modules.reduce((acc, item) => {
                  return acc + item.lessons.length;
                }, 0)}`}
              </p>
              <p
                style={{
                  fontFamily: 'OpenSans-Regular',
                  color: '#BDBDBD',
                  marginTop: 2,
                  fontSize: 12,
                }}
              >
                {`Duration: ${secondsToHms(
                  currentCourse.modules.reduce((acc, item) => {
                    return (
                      acc +
                      item.lessons.reduce((lAcc, lItem) => {
                        return acc + lItem.duration;
                      }, 0)
                    );
                  }, 0)
                )}`}
              </p>
            </div>
          </div>
        </VideoContainer>
      </ContentContainer>
      <div style={{ backgroundColor: '#0E1315', flex: 1 }}>
        <div
          style={{
            height: '5%',
            alignSelf: 'center',
            flexDirection: 'row',
            paddingRight: 16,
            paddingLeft: 16,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <OptionButton type="button" onClick={() => setIsModalOpen(true)}>
            <OptionButtonLabel>Edit</OptionButtonLabel>
            <Icon src={editing} />
          </OptionButton>

          <OptionButton type="button" onClick={() => handleDeleteCourse()}>
            <OptionButtonLabel>Delete</OptionButtonLabel>
            <Icon src={deleteIcon} />
          </OptionButton>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            width: '100%',
            backgroundColor: '#12181b',
          }}
        >
          <p style={{ fontFamily: 'OpenSans-Bold', color: '#fff', margin: 16 }}>
            {`Course content - ${getProgressPercentage()} completed`}
          </p>
        </div>

        <ClassesContainer>
          {currentCourse?.modules?.map((module, moduleIndex) => {
            return (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                key={String(module.title)}
              >
                {module.title && (
                  <ModuleContainerButton
                    type="button"
                    onClick={() => handleToggle(moduleIndex)}
                  >
                    <div
                      style={{
                        flexDirection: 'row',
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between',
                      }}
                    >
                      <p
                        style={{
                          color: '#fff',
                          fontFamily: 'OpenSans-Bold',
                          flex: 3,
                          textAlign: 'left',
                          fontSize: 16,
                        }}
                      >
                        {module.title}
                      </p>

                      <button
                        type="button"
                        onClick={() => handleToggle(moduleIndex)}
                      >
                        {module.sectionActive ? (
                          <ToggleIcon src={up_chevron} />
                        ) : (
                          <ToggleIcon src={down_chevron} />
                        )}
                      </button>
                    </div>

                    <p
                      style={{
                        marginTop: 4,
                        color: '#E0E0E0',
                        fontFamily: 'OpenSans-Regular',
                        flex: 3,
                        textAlign: 'left',
                        fontSize: 14,
                      }}
                    >
                      {`${
                        module.lessons.filter((lesson) => lesson.isCompleted)
                          .length
                      }/${module.lessons.length} | ${secondsToHms(
                        module.lessons.reduce((acc, item) => {
                          return (acc + item.duration) as number;
                        }, 0)
                      )}`}
                    </p>
                  </ModuleContainerButton>
                )}

                {module.sectionActive && (
                  <>
                    {module?.lessons?.map((item, i) => (
                      <ClassContainerButton
                        isSelected={
                          currentIndex === i &&
                          currentModuleIndex === moduleIndex
                        }
                        type="button"
                        onClick={() => {
                          setCurrentIndex(i);
                          setCurrentModuleIndex(moduleIndex);
                        }}
                        key={String(item.path)}
                      >
                        <div style={{ marginTop: -16 }}>
                          <Checkbox
                            color="#00C853"
                            size={2}
                            onChange={() => handleCheckLesson(i)}
                            tickAnimationDuration={100}
                            backAnimationDuration={200}
                            delay={0}
                            checked={module.lessons[i].isCompleted}
                          />
                        </div>
                        <ClassSubContainerButton>
                          <p
                            style={{
                              color: '#fff',
                              fontFamily: 'OpenSans-Regular',
                              flex: 3,
                              textAlign: 'left',
                              marginLeft: 0,
                              fontSize: 14,
                            }}
                          >
                            {item.name}
                          </p>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <PlayIcon src={play_button} />

                            <p
                              style={{
                                color: '#e0e0e0',
                                fontFamily: 'OpenSans-Regular',
                                flex: 3,
                                textAlign: 'left',
                                marginLeft: 4,
                                fontSize: 12,
                              }}
                            >
                              {secondsToHms(item.duration)}
                            </p>
                          </div>
                        </ClassSubContainerButton>
                      </ClassContainerButton>
                    ))}
                  </>
                )}
              </div>
            );
          })}
        </ClassesContainer>
      </div>

      <StyledModal
        isOpen={modalIsOpen}
        ariaHideApp={false}
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

          <p style={{ marginTop: 16 }}>Course Modules</p>

          {currentCourse.modules.map((module, index) => {
            return (
              <>
                <input
                  onChange={(e) => handleOnInputModuleNameChange(e, index)}
                  key={String(index)}
                  style={{ margin: 8 }}
                  value={module.title}
                />
                {currentCourse.modules[index].lessons.map((lesson) => (
                  <input
                    onChange={(e) =>
                      handleOnInputLessonNameChange(e, lesson.path, index)
                    }
                    key={lesson.path}
                    style={{ margin: 8 }}
                    value={lesson.name}
                  />
                ))}
              </>
            );
          })}

          <></>

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
