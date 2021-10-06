import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import left_chevron from '../../assets/left-chevron.png';
import EditCourseModal from '../../components/EditCourseModal';
import FinishedCourseModal from '../../components/FinishedCourseModal';
import Loader from '../../components/Loader';
import Sidebar from '../../components/Sidebar';
import VideoPlayer from '../../components/VideoPlayer';
import { IState } from '../../store';
import {
  deleteCourse,
  updateCourse,
} from '../../store/modules/catalog/actions';
import { ICourse } from '../../store/modules/catalog/types';
import getProgressPercentage from '../../utils/getProgressPercentage';
import sumDuration from '../../utils/sumDuration';
import {
  AboutThisCourseLabel,
  BottomTab,
  Container,
  ContentContainer,
  ContentToolBar,
  CourseDuration,
  CourseInfoContainer,
  CourseTitle,
  FinishAndGoToNextButton,
  GoBackButton,
  Icon,
  LessonTitle,
  NavigationContainer,
  SpeedControlContainer,
  TotalClasses,
  VideoButtonSpeed,
  VideoContainer,
  VideoWrapper,
} from './styles';

interface IRouteParams {
  id: string;
}

interface ILastPosition {
  currentTime: number;
}

const CoursePage = () => {
  const [currentCourse, setCurrentCourse] = useState<ICourse>({} as ICourse);
  const [currentEditCourse, setCurrentEditCourse] = useState<ICourse>(
    {} as ICourse
  );
  const { id } = useParams<IRouteParams>();
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinishedModalActive, setIsFinishedModalActive] = useState(false);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const dispatch = useDispatch();
  const [modalIsOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>();

  const lessonsScrollViewRef = useRef<HTMLButtonElement>(null);

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
        setVolume(selectedCourse.videoVolume || 1);

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

    setTimeout(() => {
      lessonsScrollViewRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleOnEditCoursePress = () => {
    setCurrentEditCourse(currentCourse);
    setIsModalOpen(true);
  };

  const history = useHistory();

  const handleDeleteCourse = () => {
    if (confirm('Are you sure you want to delete this course?')) {
      dispatch(deleteCourse(currentCourse));
      history.push('/');
    }
  };

  const saveVolume = (currentVolume: number) => {
    setVolume(currentVolume);

    const updatedCurrentCourse: ICourse = {
      ...currentCourse,
      videoVolume: currentVolume,
    };
    dispatch(updateCourse(updatedCurrentCourse));
  };

  const saveLastPosition = async (
    e: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    const lessonTarget = (e.target as unknown) as ILastPosition;

    const updatedCurrentCourseLessons = currentCourse.modules[
      currentModuleIndex
    ].lessons.map((lesson, index) => {
      if (index === currentIndex) {
        return {
          ...lesson,
          lastPosition: lessonTarget.currentTime,
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

  const getLessonTitle = () => {
    return `${
      currentCourse?.modules[currentModuleIndex].lessons[
        currentIndex
      ].name.split('.mp4')[0]
    }`;
  };

  const getTotalClasses = () => {
    return `Classes: ${currentCourse.modules.reduce((acc, item) => {
      return acc + item.lessons.length;
    }, 0)}`;
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
    return <Loader />;
  }

  return (
    <Container>
      <ContentContainer>
        <ContentToolBar>
          <NavigationContainer>
            <GoBackButton onClick={() => history.push('/')}>
              <Icon src={left_chevron} />
            </GoBackButton>

            <CourseTitle>{currentCourse?.courseTitle}</CourseTitle>
          </NavigationContainer>

          <SpeedControlContainer>
            <VideoButtonSpeed
              isSelected={playbackRate === 0.5}
              onClick={() => handleChangeVideoSpeed(0.5)}
            >
              0.5x
            </VideoButtonSpeed>

            <VideoButtonSpeed
              isSelected={playbackRate === 1}
              onClick={() => handleChangeVideoSpeed(1)}
            >
              1x
            </VideoButtonSpeed>

            <VideoButtonSpeed
              isSelected={playbackRate === 1.5}
              onClick={() => handleChangeVideoSpeed(1.5)}
            >
              1.5x
            </VideoButtonSpeed>

            <VideoButtonSpeed
              isSelected={playbackRate === 2}
              onClick={() => handleChangeVideoSpeed(2)}
            >
              2x
            </VideoButtonSpeed>
          </SpeedControlContainer>
        </ContentToolBar>
        <VideoContainer>
          <VideoWrapper>
            <VideoPlayer
              saveVolume={saveVolume}
              volume={volume}
              currentCourse={currentCourse}
              currentIndex={currentIndex}
              currentModuleIndex={currentModuleIndex}
              onEnded={async () => {
                await handleCheckLesson(currentIndex, true, currentModuleIndex);
                if (autoPlayEnabled) {
                  handleGoToNextLesson();
                }
              }}
              playbackRate={playbackRate}
              saveLastPosition={saveLastPosition}
              videoRef={videoRef}
              autoPlayEnabled={autoPlayEnabled}
            />
          </VideoWrapper>

          <BottomTab>
            <LessonTitle>{getLessonTitle()}</LessonTitle>
            <FinishAndGoToNextButton onClick={handleGoToNext}>
              Finish and go to Next
            </FinishAndGoToNextButton>
          </BottomTab>

          <CourseInfoContainer>
            <AboutThisCourseLabel>About this course</AboutThisCourseLabel>
            <TotalClasses>{getTotalClasses()}</TotalClasses>

            <CourseDuration>
              {`Duration: ${sumDuration(currentCourse)}`}
            </CourseDuration>
          </CourseInfoContainer>
        </VideoContainer>
      </ContentContainer>

      <Sidebar
        autoPlayEnabled={autoPlayEnabled}
        currentCourse={currentCourse}
        currentIndex={currentIndex}
        currentModuleIndex={currentModuleIndex}
        handleAutoPlay={handleAutoPlay}
        handleDeleteCourse={handleDeleteCourse}
        handleOnEditCoursePress={handleOnEditCoursePress}
        handleToggle={handleToggle}
        lessonsScrollViewRef={lessonsScrollViewRef}
        setCurrentIndex={setCurrentIndex}
        setCurrentModuleIndex={setCurrentModuleIndex}
        handleCheckLesson={handleCheckLesson}
      />

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
