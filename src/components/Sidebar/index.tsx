import React from 'react';
import Checkbox from 'react-simple-checkbox';
import Switch from 'react-switch';
import deleteIcon from '../../assets/delete.png';
import down_chevron from '../../assets/down-chevron.png';
import editing from '../../assets/editing.png';
import play_button from '../../assets/play-button.png';
import up_chevron from '../../assets/up-chevron.png';

import { ICourse, IModule } from '../../store/modules/catalog/types';
import getProgressPercentage from '../../utils/getProgressPercentage';
import secondsToHms from '../../utils/secondsToHms';
import {
  AutoplayControllerContainer,
  AutoPlayLabel,
  CheckBoxContainer,
  ClassContainerButton,
  ClassesContainer,
  ClassSubContainerButton,
  Container,
  CourseContentContainer,
  CourseProgress,
  Icon,
  LessonDuration,
  LessonInfoContainer,
  LessonName,
  ModuleContainer,
  ModuleHeader,
  ModuleInfo,
  ModuleTitle,
  ModuleToggle,
  OptionButton,
  OptionButtonLabel,
  PlayIcon,
  SidebarToolbar,
  ToggleButton,
  ToggleIcon,
} from './styles';

interface SidebarProps {
  currentCourse: ICourse;
  handleOnEditCoursePress: () => void;
  handleDeleteCourse: () => void;
  autoPlayEnabled: boolean;
  handleAutoPlay: (isChecked: boolean) => void;
  handleToggle: (moduleIndex: number) => void;
  currentIndex: number;
  currentModuleIndex: number;
  setCurrentIndex: (newIndex: number) => void;
  setCurrentModuleIndex: (newIndex: number) => void;
  handleCheckLesson: (
    lessonIndex: number,
    alwaysAstrue: boolean,
    moduleIndex: number
  ) => void;
  lessonsScrollViewRef: React.MutableRefObject<HTMLButtonElement>;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentCourse,
  handleOnEditCoursePress,
  handleDeleteCourse,
  handleAutoPlay,
  autoPlayEnabled,
  handleToggle,
  currentIndex,
  currentModuleIndex,
  setCurrentIndex,
  setCurrentModuleIndex,
  handleCheckLesson,
  lessonsScrollViewRef,
}) => {
  const getLessonDuration = (module: IModule) => {
    return `${module.lessons.filter((lesson) => lesson.isCompleted).length}/${
      module.lessons.length
    } | ${secondsToHms(
      module.lessons.reduce((acc, item) => {
        return (acc + item.duration) as number;
      }, 0)
    )}`;
  };

  const getNextScrollPoistion = (
    currentLessonIndex: number,
    itemIndex: number,
    moduleIndex: number
  ) => {
    if (
      currentLessonIndex ===
        currentCourse.modules[currentModuleIndex].lessons.length - 1 &&
      currentModuleIndex === currentCourse.modules.length - 1
    ) {
      return null;
    }

    if (
      currentLessonIndex <
        currentCourse.modules[currentModuleIndex].lessons.length - 1 &&
      currentLessonIndex + 1 === itemIndex &&
      currentModuleIndex === moduleIndex
    ) {
      return lessonsScrollViewRef;
    }
  };

  return (
    <Container>
      <SidebarToolbar>
        <OptionButton onClick={handleOnEditCoursePress}>
          <OptionButtonLabel>Edit</OptionButtonLabel>
          <Icon src={editing} />
        </OptionButton>

        <OptionButton onClick={handleDeleteCourse}>
          <OptionButtonLabel>Delete</OptionButtonLabel>
          <Icon src={deleteIcon} />
        </OptionButton>
      </SidebarToolbar>
      <CourseContentContainer>
        <CourseProgress>
          {`Content - ${getProgressPercentage(currentCourse)}% completed`}
        </CourseProgress>
        <AutoplayControllerContainer>
          <AutoPlayLabel>Autoplay</AutoPlayLabel>
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
        </AutoplayControllerContainer>
      </CourseContentContainer>

      <ClassesContainer>
        {currentCourse?.modules?.map((module, moduleIndex) => {
          return (
            <ModuleContainer key={String(module.title)}>
              {module.title && (
                <ModuleToggle onClick={() => handleToggle(moduleIndex)}>
                  <ModuleHeader>
                    <ModuleTitle>{module.title}</ModuleTitle>

                    <ToggleButton onClick={() => handleToggle(moduleIndex)}>
                      {module.sectionActive ? (
                        <ToggleIcon src={up_chevron} />
                      ) : (
                        <ToggleIcon src={down_chevron} />
                      )}
                    </ToggleButton>
                  </ModuleHeader>

                  <ModuleInfo>{getLessonDuration(module)}</ModuleInfo>
                </ModuleToggle>
              )}

              {module.sectionActive && (
                <>
                  {module?.lessons?.map((item, i) => (
                    <ClassContainerButton
                      isSelected={
                        currentIndex === i && currentModuleIndex === moduleIndex
                      }
                      ref={getNextScrollPoistion(currentIndex, i, moduleIndex)}
                      onClick={() => {
                        setCurrentIndex(i);
                        setCurrentModuleIndex(moduleIndex);
                      }}
                      key={String(item.path)}
                    >
                      <CheckBoxContainer>
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
                      </CheckBoxContainer>
                      <ClassSubContainerButton>
                        <LessonName>{item.name}</LessonName>
                        <LessonInfoContainer>
                          <PlayIcon src={play_button} />

                          <LessonDuration>
                            {secondsToHms(item.duration)}
                          </LessonDuration>
                        </LessonInfoContainer>
                      </ClassSubContainerButton>
                    </ClassContainerButton>
                  ))}
                </>
              )}
            </ModuleContainer>
          );
        })}
      </ClassesContainer>
    </Container>
  );
};

export default Sidebar;
