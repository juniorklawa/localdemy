import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Checkbox from 'react-simple-checkbox';
import Switch from 'react-switch';
import close from '../../close.png';
import confetti from '../../confetti.png';
import deleteIcon from '../../delete.png';
import down_chevron from '../../down-chevron.png';
import editing from '../../editing.png';
import left_chevron from '../../left-chevron.png';
import play_button from '../../play-button.png';
import { IState } from '../../store';
import {
  deleteCourse,
  updateCourse,
} from '../../store/modules/catalog/actions';
import { ICourse } from '../../store/modules/catalog/types';
import up_chevron from '../../up-chevron.png';
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
  VideoButtonSpeed,
  VideoContainer,
} from './styles';

interface IRouteParams {
  id: string;
}

const CoursePage = () => {
  const [currentCourse, setCurrentCourse] = useState<ICourse>({} as ICourse);
  const [currentEditCourse, setCurrentEditCourse] = useState<ICourse>(
    {} as ICourse
  );
  const { id } = useParams<IRouteParams>();
  const inputFile = useRef<HTMLInputElement>({} as HTMLInputElement);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinishedModalActive, setIsFinishedModalActive] = useState(false);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const dispatch = useDispatch();
  const [modalIsOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef();

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  const lessonsScrollViewRef = useRef(null);

  const getProgressPercentage = (course: ICourse) => {
    const completedLength = course.modules.reduce((acc, item) => {
      const completedModuleLength = item.lessons.filter(
        (lesson) => lesson.isCompleted
      ).length;

      return acc + completedModuleLength;
    }, 0);

    const totalLength = course.modules.reduce((acc, item) => {
      return acc + item.lessons.length;
    }, 0);

    const percentage = Math.floor((completedLength / totalLength) * 100);

    return percentage;
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

        setCurrentIndex(selectedCourse.lastIndex || 0);
        setCurrentModuleIndex(selectedCourse.lastModuleIndex || 0);
        setPlaybackRate(selectedCourse.videoSpeed || 1);

        if (selectedCourse.autoPlayEnabled) {
          setAutoPlayEnabled(true);
        }
        dispatch(
          updateCourse({
            ...selectedCourse,
            lastAccessedDate: new Date().getTime(),
          })
        );

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

  const handleChangeVideoSpeed = (videoSpeed: number) => {
    setPlaybackRate(videoSpeed);
    videoRef.current.playbackRate = videoSpeed;

    const updatedCurrentCourse: ICourse = {
      ...currentCourse,
      videoSpeed,
    };

    setCurrentCourse(updatedCurrentCourse);
    dispatch(updateCourse(updatedCurrentCourse));
  };

  const handleCheckLesson = async (
    lessonIndex: number,
    alwaysAstrue = false,
    moduleIndex: number
  ) => {
    console.log('oioioi');

    if (lessonsScrollViewRef) {
      lessonsScrollViewRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    // window.scrollTo(0, lessonsScrollViewRef.current.offsetTop);
    // scrollToComponent(lessonsScrollViewRef.current);

    const updatedCurrentCourseLessons = currentCourse.modules[
      moduleIndex
    ].lessons.map((lesson, index) => {
      if (index === lessonIndex) {
        return {
          ...lesson,
          isCompleted: alwaysAstrue
            ? true
            : !currentCourse.modules[moduleIndex].lessons[lessonIndex]
                .isCompleted,
          lastPosition: 0,
        };
      }

      return lesson;
    });

    const updatedCurrentCourse: ICourse = {
      ...currentCourse,
      modules: currentCourse.modules.map((module, index) => {
        if (index === moduleIndex) {
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

    if (getProgressPercentage(updatedCurrentCourse) === 100) {
      console.log('oi');
      setIsFinishedModalActive(true);
    }

    setCurrentCourse(updatedCurrentCourse);
    dispatch(updateCourse(updatedCurrentCourse));
  };

  const handleGoToNext = () => {
    handleCheckLesson(currentIndex, true, currentModuleIndex);
    handleGoToNextLesson();
  };

  const getNextScrollPoistion = (
    currentIndex: number,
    itemIndex: number,
    moduleIndex: number
  ) => {
    if (
      currentIndex ===
        currentCourse.modules[currentModuleIndex].lessons.length - 1 &&
      currentModuleIndex === currentCourse.modules.length - 1
    ) {
      return null;
    }

    if (
      currentIndex <
        currentCourse.modules[currentModuleIndex].lessons.length - 1 &&
      currentIndex + 1 === itemIndex &&
      currentModuleIndex === moduleIndex
    ) {
      return lessonsScrollViewRef;
    }
  };

  const history = useHistory();

  const handleDeleteCourse = () => {
    if (confirm('Are you sure you want to delete this course?')) {
      dispatch(deleteCourse(currentCourse));
      history.push('/');
    }
  };

  const secondsToHms = (seconds: number) => {
    const duration = moment.duration(seconds / 60, 'minutes');

    const hh =
      duration.years() * (365 * 24) +
      duration.months() * (30 * 24) +
      duration.days() * 24 +
      duration.hours();

    const mm = duration.minutes();

    const hours = hh > 0 ? `${hh}h` : ``;

    return `${hours} ${mm}m`;
  };

  const sumDuration = () => {
    let seconds = 0;

    currentCourse.modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        seconds += Math.floor(lesson.duration as number);
      });
    });

    return secondsToHms(seconds);
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
    const updatedCurrentCourseModule = currentEditCourse.modules.map(
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
      ...currentEditCourse,
      modules: updatedCurrentCourseModule,
      lastIndex: currentIndex,
      lastModuleIndex: currentModuleIndex,
    };

    setCurrentEditCourse(updatedCurrentCourse);
    // setCurrentCourse(updatedCurrentCourse);
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

  const handleOnInputLessonNameChange = async (
    e: any,
    lessonPath: string,
    moduleIndex: number
  ) => {
    const updatedCurrentCourseLessons = currentEditCourse.modules[
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

    const updatedModules = currentEditCourse.modules.map((module, index) => {
      if (index === moduleIndex) {
        return {
          ...module,
          lessons: updatedCurrentCourseLessons,
        };
      }

      return module;
    });

    const updatedCurrentCourse: ICourse = {
      ...currentEditCourse,
      modules: updatedModules,
      lastIndex: currentIndex,
      lastModuleIndex: currentModuleIndex,
    };
    setCurrentEditCourse(updatedCurrentCourse);
    // setCurrentCourse(updatedCurrentCourse);
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

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flex: 1,
          height: '100vh',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1 style={{ color: '#fff', fontFamily: 'OpenSans-Bold' }}>
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <Container>
      <ContentContainer>
        <div
          style={{
            height: 60,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <NavigationContainer>
            <div style={{ flexDirection: 'row', display: 'flex' }}>
              <GoBackButton type="button" onClick={() => history.push('/')}>
                <Icon src={left_chevron} />
              </GoBackButton>

              <CourseTitle>{currentCourse?.courseTitle}</CourseTitle>
            </div>

            <div
              style={{
                flexDirection: 'row',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <VideoButtonSpeed
                type="button"
                isSelected={playbackRate === 0.5}
                onClick={() => handleChangeVideoSpeed(0.5)}
              >
                0.5x
              </VideoButtonSpeed>

              <VideoButtonSpeed
                isSelected={playbackRate === 1}
                type="button"
                onClick={() => handleChangeVideoSpeed(1)}
              >
                1x
              </VideoButtonSpeed>

              <VideoButtonSpeed
                type="button"
                isSelected={playbackRate === 1.5}
                onClick={() => handleChangeVideoSpeed(1.5)}
              >
                1.5x
              </VideoButtonSpeed>

              <VideoButtonSpeed
                type="button"
                isSelected={playbackRate === 2}
                onClick={() => handleChangeVideoSpeed(2)}
              >
                2x
              </VideoButtonSpeed>
            </div>
          </NavigationContainer>
        </div>
        <VideoContainer>
          <div style={{ minHeight: 820 }}>
            <video
              ref={videoRef}
              onLoadedData={() => {
                videoRef.current.playbackRate = playbackRate;
              }}
              autoPlay={autoPlayEnabled}
              key={
                currentCourse.modules[currentModuleIndex].lessons[currentIndex]
                  .path
              }
              width="100%"
              onPause={(e) => saveLastPosition(e)}
              onEnded={async () => {
                await handleCheckLesson(currentIndex, true, currentModuleIndex);
                if (autoPlayEnabled) {
                  handleGoToNextLesson();
                }
              }}
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
              <h4
                style={{
                  fontFamily: 'OpenSans-Bold',
                  color: '#BDBDBD',
                }}
              >
                About this course
              </h4>
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
                {`Duration: ${sumDuration()}`}
              </p>
            </div>
          </div>
        </VideoContainer>
      </ContentContainer>
      <div style={{ backgroundColor: '#0E1315', flex: 1 }}>
        <div
          style={{
            height: 60,
            alignSelf: 'center',
            flexDirection: 'row',
            paddingRight: 16,
            paddingLeft: 16,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <OptionButton
            type="button"
            onClick={() => {
              setCurrentEditCourse(currentCourse);
              setIsModalOpen(true);
            }}
          >
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
            flexDirection: 'row',
            flex: 1,
            height: 60,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            backgroundColor: '#12181b',
          }}
        >
          <p
            style={{
              fontFamily: 'OpenSans-Bold',
              color: '#fff',
              marginLeft: 16,
            }}
          >
            {`Content - ${getProgressPercentage(currentCourse)}% completed`}
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginRight: 16,
              alignItems: 'center',
              backgroundColor: '#12181b',
            }}
          >
            <p
              style={{
                fontFamily: 'OpenSans-Regular',
                color: '#fff',
                marginRight: 8,
              }}
            >
              Autoplay
            </p>
            <Switch
              onChange={(isChecked) => handleAutoPlay(isChecked)}
              checked={autoPlayEnabled}
              onColor="#00c853"
              onHandleColor="#fff"
              handleDiameter={30}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              height={20}
              width={50}
              className="react-switch"
              id="material-switch"
            />
          </div>
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
                        ref={getNextScrollPoistion(
                          currentIndex,
                          i,
                          moduleIndex
                        )}
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
                            onChange={() =>
                              handleCheckLesson(i, false, moduleIndex)
                            }
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
        contentLabel="modal"
      >
        <div
          style={{
            backgroundColor: '#0e1315',
            width: '50%',
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <button
            style={{
              color: '#fff',
              display: 'flex',
              alignSelf: 'flex-end',
              fontFamily: 'OpenSans-Bold',
            }}
            type="button"
            onClick={() => setIsModalOpen(false)}
          >
            <Icon src={close} />
          </button>

          <h1 style={{ color: '#fff', fontFamily: 'OpenSans-Bold' }}>Cover</h1>

          <button
            style={{ display: 'flex' }}
            type="button"
            onClick={onButtonClick}
          >
            <input
              style={{ display: 'none' }}
              ref={inputFile}
              onChange={async (e) => handleFileUpload(e)}
              type="file"
            />
            <img
              style={{ width: '50%', marginTop: 8, borderRadius: 6 }}
              src={currentCourse.courseThumbnail}
              alt="course thumbnail"
            />

            <Icon
              style={{
                position: 'relative',
                bottom: 0,
                top: 32,
                left: -40,
                right: 0,
              }}
              src={editing}
            />
          </button>

          {/* <AddCourseButton type="button" onClick={onButtonClick}>

            Add
          </AddCourseButton> */}

          <h1
            style={{
              color: '#fff',
              fontFamily: 'OpenSans-Bold',
              marginTop: 32,
            }}
          >
            Title
          </h1>

          <input
            onChange={(e) =>
              setCurrentEditCourse((prevState) => ({
                ...prevState,
                courseTitle: e.target.value,
              }))
            }
            style={{
              borderRadius: 6,
              marginTop: 8,
              fontSize: 14,
              border: 'none',
              width: '100%',
              fontFamily: 'OpenSans-Regular',
              padding: 16,
              color: '#fff',
              backgroundColor: '#292F31',
            }}
            value={currentEditCourse?.courseTitle}
          />

          <h1
            style={{
              color: '#fff',
              fontFamily: 'OpenSans-Bold',
              marginTop: 32,
            }}
          >
            Modules
          </h1>

          {currentEditCourse?.modules?.map((module, index) => {
            return (
              <div
                style={{
                  paddingRight: 16,
                  marginTop: 16,
                  paddingBottom: 16,
                  paddingLeft: 16,
                  backgroundColor: '#090D0E',
                  borderRadius: 6,
                }}
                key={String(index)}
              >
                <h2
                  style={{
                    color: '#fff',
                    fontFamily: 'OpenSans-Bold',
                    marginTop: 32,
                  }}
                >
                  Title
                </h2>
                <input
                  onChange={(e) => handleOnInputModuleNameChange(e, index)}
                  key={String(index)}
                  style={{
                    borderRadius: 6,
                    marginTop: 8,
                    fontSize: 14,
                    border: 'none',
                    width: '100%',
                    fontFamily: 'OpenSans-Regular',
                    padding: 16,
                    color: '#fff',
                    backgroundColor: '#292F31',
                  }}
                  value={module.title}
                />

                <h2
                  style={{
                    color: '#fff',
                    fontFamily: 'OpenSans-Bold',
                    marginTop: 32,
                  }}
                >
                  Lessons
                </h2>
                {currentEditCourse?.modules[index].lessons.map((lesson) => (
                  <input
                    onChange={(e) =>
                      handleOnInputLessonNameChange(e, lesson.path, index)
                    }
                    key={lesson.path}
                    style={{
                      borderRadius: 6,
                      marginTop: 8,
                      fontSize: 14,
                      border: 'none',
                      width: '100%',
                      fontFamily: 'OpenSans-Regular',
                      padding: 16,
                      color: '#fff',
                      backgroundColor: '#292F31',
                    }}
                    value={lesson.name}
                  />
                ))}
              </div>
            );
          })}
        </div>
        <button
          disabled={
            JSON.stringify(currentCourse) === JSON.stringify(currentEditCourse)
          }
          style={{
            backgroundColor:
              JSON.stringify(currentCourse) ===
              JSON.stringify(currentEditCourse)
                ? '#171b1c'
                : '#00C853',
            width: '50%',
            height: 50,
            color:
              JSON.stringify(currentCourse) ===
              JSON.stringify(currentEditCourse)
                ? '#616161'
                : '#fff',
            fontSize: 18,
            fontFamily: 'OpenSans-Bold',
          }}
          type="button"
          onClick={async () => {
            const courseWithChanges = currentEditCourse;
            setCurrentCourse(courseWithChanges);
            dispatch(updateCourse(courseWithChanges));
            setIsModalOpen(false);
          }}
        >
          Save changes
        </button>
      </StyledModal>

      <StyledModal
        isOpen={isFinishedModalActive}
        ariaHideApp={false}
        onAfterOpen={afterOpenModal}
        onRequestClose={() => setIsFinishedModalActive(false)}
        contentLabel="modal"
      >
        <div
          style={{
            backgroundColor: '#0e1315',
            width: '35%',
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'auto',
          }}
        >
          <Icon style={{ height: 256, width: 256 }} src={confetti} />
          <h1
            style={{
              color: '#fff',
              fontFamily: 'OpenSans-Bold',
              marginTop: 32,
            }}
          >
            Congratulations!
          </h1>
          <p
            style={{
              color: '#fff',
              textAlign: 'center',
              fontFamily: 'OpenSans-Regular',
              marginTop: 8,
            }}
          >
            You have just finished the course: {currentCourse.courseTitle}
          </p>
          <p
            style={{
              color: '#fff',
              fontFamily: 'OpenSans-Regular',
              textAlign: 'center',
            }}
          >
            {`with ${currentCourse.modules.reduce((acc, item) => {
              return acc + item.lessons.length;
            }, 0)} lessons in total of ${sumDuration()} `}
          </p>

          <button
            type="button"
            onClick={() => {
              setIsFinishedModalActive(false);
            }}
            style={{
              color: '#fff',
              backgroundColor: '#00C853',
              borderRadius: 10,
              marginTop: 32,
              fontSize: 20,
              alignSelf: 'center',
              paddingRight: 16,
              width: '90%',
              paddingLeft: 16,
              height: 50,
              fontFamily: 'OpenSans-Bold',
            }}
          >
            Nice!
          </button>
        </div>
      </StyledModal>
    </Container>
  );
};

export default CoursePage;
