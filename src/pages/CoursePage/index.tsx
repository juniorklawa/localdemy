import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Checkbox from 'react-simple-checkbox';
import Switch from 'react-switch';
import deleteIcon from '../../assets/delete.png';
import down_chevron from '../../assets/down-chevron.png';
import editing from '../../assets/editing.png';
import left_chevron from '../../assets/left-chevron.png';
import play_button from '../../assets/play-button.png';
import up_chevron from '../../assets/up-chevron.png';
import EditCourseModal from '../../components/EditCourseModal';
import FinishedCourseModal from '../../components/FinishedCourseModal';
import { IState } from '../../store';
import {
  deleteCourse,
  updateCourse,
} from '../../store/modules/catalog/actions';
import { ICourse } from '../../store/modules/catalog/types';
import getProgressPercentage from '../../utils/getProgressPercentage';
import secondsToHms from '../../utils/secondsToHms';
import sumDuration from '../../utils/sumDuration';
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
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinishedModalActive, setIsFinishedModalActive] = useState(false);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const dispatch = useDispatch();
  const [modalIsOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef();

  const lessonsScrollViewRef = useRef(null);

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
    if (lessonsScrollViewRef) {
      lessonsScrollViewRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }

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

  const handleAutoPlay = async (isChecked: boolean) => {
    setAutoPlayEnabled(isChecked);

    const updatedCurrentCourse: ICourse = {
      ...currentCourse,
      autoPlayEnabled: isChecked,
    };

    setCurrentCourse(updatedCurrentCourse);
    dispatch(updateCourse(updatedCurrentCourse));
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
                {`Duration: ${sumDuration(currentCourse)}`}
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
              handleDiameter={25}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              height={20}
              width={45}
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

      <EditCourseModal
        currentCourse={currentCourse}
        currentEditCourse={currentEditCourse}
        currentIndex={currentIndex}
        currentModuleIndex={currentModuleIndex}
        isModalOpen={modalIsOpen}
        setCurrentCourse={setCurrentCourse}
        setCurrentEditCourse={setCurrentEditCourse}
        setIsModalOpen={setIsModalOpen}
      />

      <FinishedCourseModal
        currentCourse={currentCourse}
        setIsFinishedModalActive={setIsFinishedModalActive}
        isFinishedModalActive={isFinishedModalActive}
      />
    </Container>
  );
};

export default CoursePage;
