import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import close from '../../assets/close.png';
import editing from '../../assets/editing.png';
import { updateCourse } from '../../store/modules/catalog/actions';
import { ICourse } from '../../store/modules/catalog/types';
import {
  BottomButton,
  CloseButton,
  Container,
  CourseTitle,
  CourseTitleInput,
  EditIcon,
  Icon,
  ModuleCard,
  ModuleInput,
  ModuleTitle,
  SectionTitle,
  StyledModal,
  Thumbnail,
  ThumbnailButton,
  UploadImageInput,
} from './styles';

interface EditCourseModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  currentEditCourse: ICourse;
  currentCourse: ICourse;
  setCurrentCourse: (currentCourse: ICourse) => void;
  setCurrentEditCourse: (currentCourse: ICourse) => void;
  currentIndex: number;
  currentModuleIndex: number;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  currentEditCourse,
  currentCourse,
  setCurrentCourse,
  setCurrentEditCourse,
  currentIndex,
  currentModuleIndex,
}) => {
  const dispatch = useDispatch();

  const inputFile = useRef<HTMLInputElement>({} as HTMLInputElement);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const imagePath = (event.target.files[0].path as unknown) as string;

    const updatedCurrentCourse: ICourse = {
      ...currentCourse,
      courseThumbnail: imagePath,
    };

    setCurrentEditCourse(updatedCurrentCourse);
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  const handleOnInputLessonNameChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
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
  };

  const handleOnSaveChangesPress = async () => {
    const courseWithChanges = currentEditCourse;
    setCurrentCourse(courseWithChanges);
    dispatch(updateCourse(courseWithChanges));
    setIsModalOpen(false);
  };

  const handleOnInputModuleNameChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    moduleIndex: number
  ) => {
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
  };

  const handleOnTitleInput = (title: string) => {
    const updatedEditCourse: ICourse = {
      ...currentEditCourse,
      courseTitle: title,
    };
    setCurrentEditCourse(updatedEditCourse);
  };

  return (
    <StyledModal
      isOpen={isModalOpen}
      ariaHideApp={false}
      onRequestClose={() => setIsModalOpen(false)}
      contentLabel="modal"
    >
      <Container>
        <CloseButton onClick={() => setIsModalOpen(false)}>
          <Icon src={close} />
        </CloseButton>

        <SectionTitle>Cover</SectionTitle>

        <ThumbnailButton onClick={onButtonClick}>
          <UploadImageInput
            ref={inputFile}
            onChange={async (e) => handleImageUpload(e)}
            type="file"
          />
          <Thumbnail
            src={currentEditCourse.courseThumbnail}
            alt="course thumbnail"
          />

          <EditIcon src={editing} />
        </ThumbnailButton>

        <CourseTitle>Title</CourseTitle>

        <CourseTitleInput
          onChange={(e) => handleOnTitleInput(e.target.value)}
          value={currentEditCourse?.courseTitle}
        />

        <CourseTitle>Modules</CourseTitle>

        {currentEditCourse?.modules?.map((module, index) => {
          return (
            <ModuleCard key={String(index)}>
              <ModuleTitle>Title</ModuleTitle>
              <ModuleInput
                onChange={(e) => handleOnInputModuleNameChange(e, index)}
                key={String(index)}
                value={module.title}
              />

              <ModuleTitle>Lessons</ModuleTitle>
              {currentEditCourse?.modules[index].lessons.map((lesson) => (
                <ModuleInput
                  onChange={(e) =>
                    handleOnInputLessonNameChange(e, lesson.path, index)
                  }
                  key={lesson.path}
                  value={lesson.name}
                />
              ))}
            </ModuleCard>
          );
        })}
      </Container>
      <BottomButton
        isEqual={
          JSON.stringify(currentCourse) === JSON.stringify(currentEditCourse)
        }
        disabled={
          JSON.stringify(currentCourse) === JSON.stringify(currentEditCourse)
        }
        type="button"
        onClick={handleOnSaveChangesPress}
      >
        Save changes
      </BottomButton>
    </StyledModal>
  );
};

export default EditCourseModal;
